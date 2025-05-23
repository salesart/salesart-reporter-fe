import {ButtonView, Plugin} from 'ckeditor5';

export class PageNumber extends Plugin {

  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('pageNumber', (locale) => {
      const button = new ButtonView(locale);
      button.set({
        label: locale.t("Page Number"),
        tooltip: true,
        withText: false,
        icon: "<svg width=\"800px\" height=\"800px\" viewBox=\"0 0 15 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
          "<path d=\"M10.5 0.5L10.8536 0.146447L10.7071 0H10.5V0.5ZM13.5 3.5H14V3.29289L13.8536 3.14645L13.5 3.5ZM9.5 12.5L9.14645 12.1464C9.00345 12.2894 8.96067 12.5045 9.03806 12.6913C9.11545 12.8782 9.29777 13 9.5 13V12.5ZM12.5 14H2.5V15H12.5V14ZM2.5 1H10.5V0H2.5V1ZM10.1464 0.853553L13.1464 3.85355L13.8536 3.14645L10.8536 0.146447L10.1464 0.853553ZM2.5 14C2.22386 14 2 13.7761 2 13.5H1C1 14.3284 1.67157 15 2.5 15V14ZM12.5 15C13.3284 15 14 14.3284 14 13.5H13C13 13.7761 12.7761 14 12.5 14V15ZM2.5 0C1.67157 0 1 0.671573 1 1.5H2C2 1.22386 2.22386 1 2.5 1V0ZM12 12H9.5V13H12V12ZM9.85355 12.8536L11.6464 11.0607L10.9393 10.3536L9.14645 12.1464L9.85355 12.8536ZM10.7929 9H10.5V10H10.7929V9ZM10.5 9C9.67157 9 9 9.67157 9 10.5H10C10 10.2239 10.2239 10 10.5 10V9ZM12 10.2071C12 9.54044 11.4596 9 10.7929 9V10C10.9073 10 11 10.0927 11 10.2071H12ZM11.6464 11.0607C11.8728 10.8343 12 10.5273 12 10.2071H11C11 10.262 10.9782 10.3147 10.9393 10.3536L11.6464 11.0607ZM13 3.5V13.5H14V3.5H13ZM2 13.5V1.5H1V13.5H2Z\" fill=\"#000000\"/>\n" +
          "</svg>"
      });
      button.on('execute', () => {
        this.editor?.model.change((writer: any) => {
          const insertPosition = this.editor?.model.document.selection.getFirstPosition();
          writer.insertText("${sayfaNumarasi}", insertPosition);
        });
      });
      return button;
    });
  }
}
