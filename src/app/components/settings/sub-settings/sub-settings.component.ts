import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserCRUDService } from '../../../services/user-crud.service';

@Component({
  selector: 'app-sub-settings',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './sub-settings.component.html',
  styleUrl: './sub-settings.component.css',
})
export class SubSettingsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private userCRUDService: UserCRUDService
  ) {}
  updatePass = false;
  update = false;
  userForm!: FormGroup;
  user: any;
  error = false;
  showError = false;
  errorMsg = '';
  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (res) => {
        this.user = res;
        this.userForm = new FormGroup({
          fullName: new FormControl(
            { value: res?.user.fullName, disabled: true },
            [Validators.required]
          ),
          email: new FormControl({ value: res?.user.email, disabled: true }, [
            Validators.required,
            Validators.email,
          ]),
          role: new FormControl({ value: res?.role?.role, disabled: true }),
          oldPassword: new FormControl(
            '',
            !this.updatePass
              ? []
              : [Validators.required, Validators.minLength(8)]
          ),
          newPassword: new FormControl(
            '',
            !this.updatePass
              ? []
              : [Validators.required, Validators.minLength(8)]
          ),
        });
      },
      (err) => {
        console.log(err);
      }
    );
    this.onChange();
  }
  onChange() {
    const oldPassword = this.userForm.get('oldPassword');
    const newPassword = this.userForm.get('newPassword');

    if (!this.updatePass) {
      oldPassword?.clearValidators();
      newPassword?.clearValidators();
    } else {
      newPassword?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
      oldPassword?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
    }
    newPassword?.updateValueAndValidity();
    oldPassword?.updateValueAndValidity();
  }
  updateUser() {
    if (this.userForm.valid) {
      this.error = false;
      let payload: any = {
        fullName: this.userForm.value.fullName,
        email: this.userForm.value.email,
      };
      if (this.updatePass) {
        payload.newPassword = this.userForm.value.newPassword;
        payload.oldPassword = this.userForm.value.oldPassword;
      }
      this.userCRUDService.updateOldUser(this.user.user._id, payload).subscribe(
        (res: any) => {
          this.userCRUDService.socket$.next(res);
          this.userService.setUser();
          this.update = false;
          this.updatePass = false;
          this.errorMsg = '';
          this.showError = false;
        },
        (err) => {
          this.errorMsg = err.error.error;
          this.showError = true;
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
  switchUpdate() {
    this.update = !this.update;
    if (this.update) {
      this.userForm.get('fullName')?.enable();
      this.userForm.get('email')?.enable();
    } else {
      this.userForm.get('fullName')?.disable();
      this.userForm.get('email')?.disable();
      this.updatePass = false;
      this.errorMsg = '';
      this.showError = false;
    }
  }
}
