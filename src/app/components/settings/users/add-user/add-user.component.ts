import { Component, Inject, OnInit } from '@angular/core';
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
import { RoleService } from '../../../../services/role.service';
import { UserCRUDService } from '../../../../services/user-crud.service';

export interface DialogDataUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogDataUser,
    public dialog: MatDialog,
    private roleService: RoleService,
    private userCRUDService: UserCRUDService
  ) {}
  roles: any;
  updatePass = false;
  ngOnInit(): void {
    this.roleService.watch().subscribe(
      (res) => {
        this.roles = res;
      },
      (err) => {
        console.log(err);
      }
    );

    if (!this.roles) this.roleService.getRoles();
    this.onChange();
  }
  error = false;
  showError = false;
  errorMsg = '';
  userForm = new FormGroup({
    email: new FormControl(this.data ? this.data.email : '', [
      Validators.required,
      Validators.email,
    ]),
    fullName: new FormControl(this.data ? this.data.fullName : '', [
      Validators.required,
    ]),
    password: new FormControl(
      '',
      this.data && !this.updatePass
        ? []
        : [Validators.required, Validators.minLength(8)]
    ),
    role: new FormControl(this.data ? this.data.role : '', [
      Validators.required,
    ]),
  });

  onChange() {
    const passwordControl = this.userForm.get('password');

    if (this.data && !this.updatePass) {
      passwordControl?.clearValidators(); // Clear validators if updatePass is false and there is initial data
    } else {
      passwordControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]); // Set validators otherwise
    }
    passwordControl?.updateValueAndValidity(); // Update the validation status
  }
  createUser() {
    if (this.userForm.valid && this.userForm.value.role !== 'Role') {
      this.error = false;
      const payload = {
        fullName: this.userForm.value.fullName,
        email: this.userForm.value.email,
        role: this.userForm.value.role,
        password: this.userForm.value.password,
      };

      this.userCRUDService.addUser(payload).subscribe(
        (res: any) => {
          this.userCRUDService.socket$.next(res);
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
  updateUser() {
    if (this.userForm.valid) {
      this.error = false;
      let payload: any = {
        fullName: this.userForm.value.fullName,
        role: this.userForm.value.role,
        email: this.userForm.value.email,
      };
      if (this.updatePass) {
        payload.password = this.userForm.value.password;
      }
      this.userCRUDService.updateUser(this.data._id, payload).subscribe(
        (res: any) => {
          this.userCRUDService.socket$.next(res);
          this.dialog.closeAll();
        },
        (err) => {
          this.errorMsg = err.error.error;
          this.showError = true;
          console.log(err);
        }
      );
    } else {
      this.error = true;
    }
  }
  togglePassword() {
    this.updatePass = !this.updatePass;
    this.onChange();
  }
  handleUser() {
    if (this.data) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }
}
