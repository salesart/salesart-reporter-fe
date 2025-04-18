import {ButtonView, Editor, Plugin} from 'ckeditor5';
import {SharedService} from '../shared-service';

export class UserGuide extends Plugin {
  private sharedService!: SharedService;

  constructor(editor: Editor) {
    super(editor);
    this.sharedService = SharedService.instance;
  }

  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('userGuide', (locale) => {
      const button = new ButtonView(locale);
      button.set({
        label: locale.t("User Guide"),
        tooltip: true,
        withText: false,
        class: "pluginPlace",
        icon: '<svg width="452" height="452" viewBox="0 0 452 452" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(1.17037,0,0,1.17037,-1115.2,-382.3)"><path d="M1338.57,519.505C1338.57,625.303 1251.51,712.362 1145.71,712.362C1039.92,712.362 952.857,625.303 952.857,519.505C952.857,413.707 1039.92,326.648 1145.71,326.648C1251.51,326.648 1338.57,413.707 1338.57,519.505L1338.57,519.505Z" style="fill:rgb(51,102,204);fill-rule:nonzero;"/></g><g transform="matrix(3.14355,0,0,3.14355,-7587.14,782.282)"><path d="M2494.29,-197.591L2494.29,-123.719L2476.43,-123.719L2476.43,-197.591L2494.29,-197.591" style="fill:white;fill-rule:nonzero;"/><g transform="matrix(0.318111,0,0,0.318111,2440.91,-251.447)"><path d="M174.804,101.287C174.804,120.524 158.974,136.354 139.737,136.354C120.499,136.354 104.669,120.524 104.669,101.287C104.669,82.049 120.499,66.219 139.737,66.219C158.974,66.219 174.804,82.049 174.804,101.287Z" style="fill:white;fill-rule:nonzero;"/></g></g></svg>'
      });
      button.on('execute', () => {
        this.editor?.model.change((writer: any) => {
          this.sharedService.updateUserGuideData();
        });
      });
      return button;
    });
  }
}
