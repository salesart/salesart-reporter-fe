import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogClose
} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'user-guide-dialog',
  imports: [
    MatDialogContent,
    FormsModule,
    MatIcon,
    MatIconButton,
    MatDialogClose,
    TranslatePipe
  ],
  templateUrl: './user-guide-dialog.html'
})
export class UserGuideDialog {

  constructor(
    public dialogRef: MatDialogRef<UserGuideDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

}
