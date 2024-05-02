import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogDataRole } from '../add-role/add-role.component';
import { RoleService } from '../../../../services/role.service';

@Component({
  selector: 'app-delete-role',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './delete-role.component.html',
  styleUrl: './delete-role.component.css',
})
export class DeleteRoleComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataRole,
    private roleService: RoleService
  ) {}
  deleteRole() {
    this.roleService.deleteRole(this.data._id).subscribe(
      (res) => {
        this.roleService.socket$.next(res);
        this.dialog.closeAll();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
