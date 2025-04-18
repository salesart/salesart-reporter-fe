import {Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'preview-dialog',
  templateUrl: 'preview-dialog.html',
  imports: [MatDialogContent, MatIcon, MatDialogClose, MatIconButton, TranslateModule],
  standalone: true
})
export class PreviewDialog {
  data = inject(MAT_DIALOG_DATA);
  constructor(public translate: TranslateService){

  }
}
