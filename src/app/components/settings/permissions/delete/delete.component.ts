import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogDataPermission } from '../update/update.component';
import { PermissionService } from '../../../../services/permission.service';

@Component({
  selector: 'delete-permission',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataPermission,
    private permissionService: PermissionService
  ) {}
  deletePermission() {
    this.permissionService.deletePermission(this.data._id).subscribe(
      (res) => {
        this.permissionService.socket$.next(res);
        this.dialog.closeAll();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
