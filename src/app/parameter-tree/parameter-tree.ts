import {Component, Input} from "@angular/core";
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle
} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Parameter} from '../model/parameter';
import {EditorUtil} from '../editor/editor-util';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {Editor} from 'ckeditor5';
import {FlatNode} from '../model/flat-node';
import {NgIf} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'parameter-tree',
  templateUrl: 'parameter-tree.html',
  imports: [
    MatTree,
    MatTreeNode,
    MatIcon,
    MatButton,
    MatIconButton,
    MatTreeNodePadding,
    MatTreeNodeToggle,
    MatTreeNodeDef,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    MatTooltip,
    TranslateModule,
  ],
  standalone: true
})
export class ParameterTree {
  @Input()
  editorInstance: Editor | undefined;

  parameterNodes: Parameter[] = [];

  constructor(private editorUtil: EditorUtil,
              private translate: TranslateService) {
  }

  private _transformer = (node: Parameter, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      code: node.code,
      type: node.type,
      level: level
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  parameterMatFlatDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  onNodeClick(node: any) {
    if (node.type === "LIST" || node.type === "SUBLIST") {
      this.editorUtil.generateHtmlTable(node.type,
        this.editorInstance,
        node.code,
        this.getParameterEditorAttributeMap(node)
      )
    } else if (node.type === "STRING")
      this.editorUtil.insertParameterToEditor(this.editorInstance, node.code)
  }

  filterRecursive(filterText: string, array: any[], property: string) {
    let filteredData;

    function copy(o: any) {
      return Object.assign({}, o);
    }

    if (filterText) {
      filterText = filterText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

      filteredData = array.map(copy).filter(function x(y) {
        if (y[property].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(filterText)) {
          return true;
        }
        if (y.children) {
          return (y.children = y.children.map(copy).filter(x)).length;
        }
      });
    } else {
      filteredData = array;
    }

    return filteredData;
  }

  filterTree(filterText: string) {
    this.parameterMatFlatDataSource.data = this.filterRecursive(filterText, this.parameterNodes, 'name');
  }

  applyFilter(event: any) {
    this.filterTree(event.target['value']);
    if (event.target['value']) {
      this.treeControl.expandAll();
      return;
    }
    this.treeControl.collapseAll();
  }

  getParameterEditorAttributeMap(node: any): any[] {
    const findNode = (nodes: Parameter[], code: string): Parameter | undefined => {
      for (const parameterNode of nodes) {
        if (parameterNode.code === code) {
          return parameterNode;
        }

        if (parameterNode.children) {
          const found = findNode(parameterNode.children, code);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    };

    const foundNode = findNode(this.parameterNodes, node.code);
    return foundNode ? foundNode.editorAttributeMap : []; // Return the editorAttributeMap or an empty array if not found
  }

  public renderParameters(parameters: Parameter[]): void {
    this.parameterMatFlatDataSource.data = parameters;
    this.parameterNodes = parameters;
  }

  getTooltipText(type: string): string {
    switch (type) {
      case 'LIST':
        return this.translate.instant("list_tooltip");
      case 'SUBLIST':
        return this.translate.instant("sublist_tooltip");
      case 'STRING':
        return this.translate.instant("text_tooltip");
      default:
        return "";
    }
  }

}
