import {ButtonView, Editor, Plugin} from 'ckeditor5';
import {SharedService} from '../shared-service';

export class Preview extends Plugin {
  private sharedService!: SharedService;

  constructor(editor: Editor) {
    super(editor);
    this.sharedService = SharedService.instance;
  }

  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('preview', (locale) => {
      const button = new ButtonView(locale);
      button.set({
        label: locale.t("Preview"),
        tooltip: true,
        withText: false,
        icon: "<svg fill=\"#000000\" width=\"800px\" height=\"800px\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m23.589 22.261-2.102-2.101c.51-.769.814-1.713.814-2.728 0-2.389-1.683-4.385-3.929-4.866l-.033-.006v-4.043c0-.009 0-.018 0-.026 0-.246-.088-.471-.233-.646l.001.002v-.005c-.019-.023-.039-.045-.06-.066l-.008-.009c-.009-.009-.018-.018-.027-.027l-7.44-7.44c-.021-.021-.042-.04-.065-.059l-.026-.018c-.016-.013-.033-.026-.05-.038l-.025-.018c-.018-.012-.036-.022-.054-.034l-.023-.012q-.034-.02-.075-.037l-.032-.013-.051-.018-.036-.011-.058-.015-.028-.006c-.028-.006-.057-.01-.086-.013h-8.948c-.559.002-1.011.454-1.015 1.012v20.377c0 .561.454 1.017 1.015 1.019h16.306.004c1.013 0 1.955-.304 2.74-.827l-.018.011 2.102 2.102c.181.166.423.268.689.268.563 0 1.019-.456 1.019-1.019 0-.266-.102-.508-.269-.689l.001.001zm-3.325-4.827c0 1.625-1.318 2.943-2.943 2.943s-2.943-1.318-2.943-2.943 1.318-2.943 2.943-2.943c1.624.002 2.941 1.318 2.943 2.942zm-9.396-13.956 3.993 3.994h-3.993zm-8.83-1.44h6.793v6.453c0 .563.456 1.019 1.019 1.019h6.453v3.05c-2.278.487-3.962 2.483-3.962 4.873 0 1.109.362 2.133.975 2.96l-.01-.013h-11.269z\"/></svg>"
      });
      button.on('execute', () => {
        this.sharedService.updateData("previewClicked");
      });
      return button;
    });
  }
}
