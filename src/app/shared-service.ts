import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UserGuideDialog} from './user-guide-dialog/user-guide-dialog';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  static instance: SharedService;

  constructor(public dialog: MatDialog) {
    SharedService.instance = this;
  }

  private previewData = new BehaviorSubject<string>('');
  previewData$ = this.previewData.asObservable();

  private userGuideData = new BehaviorSubject<any>(null);
  userGuideData$ = this.userGuideData.asObservable();

  updateData(newData: string) {
    this.previewData.next(newData);
  }

  updateUserGuideData() {
    const dialogRef = this.dialog.open(UserGuideDialog, {
      width: '90vw',
      height: '80vh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userGuideData.next(result);
    });
  }
}
