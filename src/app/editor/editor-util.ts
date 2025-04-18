import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EditorUtil {
  constructor() {
  }

  public insertParameterToEditor(editorInstance:any, fieldValue: string): void {
    editorInstance?.model.change((writer: any) => {
      const insertPosition = editorInstance?.model.document.selection.getFirstPosition();
      writer.insertText('${'+fieldValue+'}', insertPosition);
    });
  }

  public generateHtmlTable(listType: string, editorInstance: any, listKey: string, tableHeaderFieldMap: [string, string][]): void {
    const entries = Object.entries(tableHeaderFieldMap);
    const columnCount = entries.length;
    const columnWidth = (100 / columnCount).toFixed(2) + '%';

    const colGroup = `<colgroup>${entries.map(() => `<col style="width:${columnWidth};">`).join('')}</colgroup>`;

    const thead = `<thead><tr>${entries.map(([header]) => `<th style="border:1px solid hsl(0, 0%, 0%);padding:5px">${header}</th>`).join('')}</tr></thead>`;

    // eslint-disable-next-line max-len
    let tbody = `<tbody><tr>${entries.map(([, field]) => `<td style="border:1px solid hsl(0, 0%, 0%);padding:5px">\${${field}}</td>`).join('')}</tr><tr><td colspan="${columnCount}">#${listKey}(0)</td></tr></tbody>`;

    if (listType === "SUBLIST") {
      tbody = `<tbody><tr>${entries.map(([, field]) => `<td style="border:1px solid hsl(0, 0%, 0%);padding:5px">\${${field}}</td>`).join('')}</tr><tr><td colspan="${columnCount}">#${listKey}(altToplamAlani,10)</td></tr><tr><td colspan="${columnCount}"><p style="text-align:right;"><strong><u>Ara Toplam:</u></strong> $&#123;araToplam&#125;</p></td></tr></tbody>`;
    }

    const viewFragment = editorInstance!.data.processor.toView(
      `<figure class="table" style="width:100%;"><table class="ck-table-resized" style="border:1px solid hsl(0, 0%, 0%);">${colGroup}${thead}${tbody}</table></figure>`
    );
    const modelFragment = editorInstance!.data.toModel(viewFragment);

    editorInstance!.model.change((writer: any) => {
      const insertPosition = editorInstance!.model.document.selection.getFirstPosition();
      editorInstance!.model?.insertContent(modelFragment, insertPosition);
    });
  }

  public convertCkToFreeMarkerFormat(html: string | undefined): string {
    html = this.convertTable(html);
    return html;
  }

  private convertTable(html: string | undefined): string {
    // @ts-ignore
    return html!.replace(/<figure class="table".*?<table(.*?)>(.*?)<\/table>.*?<\/figure>/gs, (tablePartMatch, tableAttributes, tableContent) => {
      let tableParameters = tableContent.match(/<td[^>]*>(?:.|\n)*?#([a-zA-Z_][a-zA-Z0-9_]*)\(([^,()]+)(?:,(\d+))?\)(?:.|\n)*?<\/td>/);
      if (!tableParameters) {
        return tablePartMatch;
      }

      let tableListAttributeName = tableParameters[1];
      let tableSubTotalField;
      let tablePageSize;
      if (tableParameters[3]) {
        tablePageSize = parseInt(tableParameters[3], 10);
        tableSubTotalField = tableParameters[2] || 'subTotalField';
      } else if (!tableParameters[3] && tableParameters[2]) {
        tablePageSize = parseInt(tableParameters[2], 10)
        if (isNaN(tablePageSize)) {
          tablePageSize = 10;
          tableSubTotalField = tableParameters[2];
        } else {
          tableSubTotalField = 'subTotalField';
        }
      }

      // @ts-ignore
      let tableColGroupMatch = tableContent.match(/<colgroup.*?>(.*?)<\/colgroup>/s);
      // @ts-ignore
      let tableFirstRowMatch = tableContent.match(/<tr>(.*?)<\/tr>/s);
      let tableColGroupContent = tableColGroupMatch ? tableColGroupMatch[1] : '';
      let tableFirstRowContent = tableFirstRowMatch ? tableFirstRowMatch[1] : '';

      const parser = new DOMParser();
      const doc = parser.parseFromString(html!, 'text/html');
      const mainTable = doc.querySelector('table.ck-table-resized tbody');
      const lastRow = mainTable?.querySelectorAll('tr')[2];
      let tableFourthRowContent = '';
      if (lastRow) {
        // @ts-ignore
        tableFourthRowContent = lastRow!.outerHTML.replace(/<tr>\s*<td[^>]*colspan="[^"]*"[^>]*>/s, "").slice(0, -10);
      }

      // @ts-ignore
      tableContent = tableContent.replace(/<tr>\s*<td colspan="\d+">#.*?<\/td>\s*<\/tr>/s, "");
      // @ts-ignore
      tableContent = tableContent.replace(/<tr><td colspan[^>]*>(?:.|\n)*?([a-zA-Z_][a-zA-Z0-9_]*)(?:.|\n)*?<\/td><\/tr>/gs, "");

      // @ts-ignore
      let tbodyMatch = tableContent.match(/<tbody>(.*?)<\/tbody>/s);
      if (!tbodyMatch) return tablePartMatch;

      // @ts-ignore
      let rowTemplates = tbodyMatch[1].match(/<tr>(.*?)<\/tr>/gs);
      if (!rowTemplates) return tablePartMatch;

      let updatedTableRowTemplates = rowTemplates.map((row: string) =>
        row
          .replace(/\$\{(.*?)\}/g, "${data.$1}")
          .replace(/<td(?![^>]*class=['"][^'"]*['"])/g, "<td class='ellipsis'") // Eğer class yoksa ekler
      );

      let tableTbodyContent = `<tbody>\n<#assign araToplam = 0>\n<#list ${tableListAttributeName} as data>\n`;
      if (tablePageSize) {
        tableTbodyContent += `\n<#if data_index % ${tablePageSize} == 0 && data_index != 0>\n` +
          `</tbody>\n</table>\n${tableFourthRowContent}\n<div class='table-page-break'></div>\n<table${tableAttributes}>\n<tbody>\n${tableFirstRowContent}` +
          `</#if>\n`;
      }
      tableTbodyContent += updatedTableRowTemplates.join("\n") + `\n<#assign araToplam = araToplam + data.${tableSubTotalField}>\n</#list>\n</tbody>`;
      // @ts-ignore
      tableContent = tableContent.replace(/<tbody>.*?<\/tbody>/s, tableTbodyContent);

      return `<figure class="table" style="width:100%;">\n<colgroup>${tableColGroupContent}</colgroup>\n<table${tableAttributes}>\n${tableContent}\n</table>\n</figure>`;
    });
  }

}
