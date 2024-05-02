import { Component, Inject, model, OnInit } from '@angular/core';
import {
  FormBuilder,
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
import { RoleService } from '../../../../services/role.service';
import { FeatureService } from '../../../../services/feature.service';
export interface DialogDataRole {
  _id: string;
  role: string;
}
@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css',
})
export class AddRoleComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataRole,
    public dialog: MatDialog,
    private roleService: RoleService,
    private featureService: FeatureService,
    private _formBuilder: FormBuilder
  ) {}

  features!: any[];
  featureForms: FormGroup[] = [];
  roleForm = new FormControl(this.data ? this.data.role : '', [
    Validators.required,
  ]);
  ngOnInit(): void {
    this.featureService.getFeatures().subscribe(
      (res: any) => {
        this.features = res;
        if (!this.data) this.initializeRoleForm(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  error = false;
  showError = false;
  errorMsg = '';
  initializeRoleForm(features: any) {
    for (let i = 0; i < 8; i++) {
      const group = this._formBuilder.group({});
      group.addControl('Get', this._formBuilder.control(true));
      group.addControl('Post', this._formBuilder.control(false));
      group.addControl('Patch', this._formBuilder.control(false));
      group.addControl('Delete', this._formBuilder.control(false));
      this.featureForms.push(group);
    }
  }
  createRole() {
    if (this.roleForm.valid) {
      const featureFormsAsObject = this.featureForms.map((featureForm) =>
        featureForm.getRawValue()
      );
      const permissions: any[] = [];
      featureFormsAsObject.forEach((element, index) => {
        permissions.push({
          ...element,
          feature: this.features[index]._id,
        });
      });
      this.error = false;
      const payload: any = {
        role: this.roleForm.value,
        permissions,
      };
      this.roleService.addRole(payload).subscribe(
        (res: any) => {
          this.roleService.socket$.next(res);
          this.dialog.closeAll();
        },
        (err: any) => {
          this.errorMsg = err.error.error;
          this.showError = true;
        }
      );
    } else {
      this.error = true;
    }
  }
  updateRole() {
    if (this.roleForm.valid) {
      this.error = false;
      let payload: any = {
        role: this.roleForm.value,
      };
      this.roleService.updateRole(this.data._id, payload).subscribe(
        (res: any) => {
          this.roleService.socket$.next(res);
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
  handleRole() {
    if (this.data) {
      this.updateRole();
    } else {
      this.createRole();
    }
  }
}
