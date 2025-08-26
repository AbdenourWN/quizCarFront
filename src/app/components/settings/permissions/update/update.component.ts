import { Component, Inject, model, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ModelService } from '../../../../services/model.service';
import { PermissionService } from '../../../../services/permission.service';

export interface DialogDataPermission {
  _id: string;
  Get: boolean;
  Post: boolean;
  Patch: boolean;
  Delete: boolean;
  role: string;
  feature: string;
}

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, FormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css',
})
export class UpdateComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataPermission,
    public dialog: MatDialog,
    private permissionService: PermissionService
  ) {}
  models!: any[];
  ngOnInit(): void {}
  error = false;
  showError = false;
  errorMsg = '';
  permissionForm = new FormGroup({
    Get: new FormControl(this.data.Get),
    Post: new FormControl(this.data.Post),
    Patch: new FormControl(this.data.Patch),
    Delete: new FormControl(this.data.Delete),
    role: new FormControl({ value: this.data.role, disabled: true }),
    feature: new FormControl({ value: this.data.feature, disabled: true }),
  });
  updatePermission() {
    if (this.permissionForm.valid) {
      this.error = false;
      let payload: any = {
        Get: this.permissionForm.value.Get,
        Post: this.permissionForm.value.Post,
        Patch: this.permissionForm.value.Patch,
        Delete: this.permissionForm.value.Delete,
      };
      this.permissionService.updatePermission(this.data._id, payload).subscribe(
        (res: any) => {
          this.permissionService.socket$.next(res);
          this.dialog.closeAll();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.error = true;
    }
  }
}
