import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogDataUser } from '../add-user/add-user.component';
import { UserCRUDService } from '../../../../services/user-crud.service';

@Component({
  selector: 'delete-brand',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataUser,
    private userCRUDService: UserCRUDService
  ) {}
  deleteUser() {
    this.userCRUDService.deleteUser(this.data._id).subscribe(
      (res) => {
        this.userCRUDService.socket$.next(res);
        this.dialog.closeAll();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
