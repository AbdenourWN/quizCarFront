import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  passwordMatch = true;
  error = false;
  showError = false;
  errorMsg = '';
  private _signupUrl = `${environment.apiUrl}/api/auth/signup`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private userService: UserService
  ) {}

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    fullName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    ConfirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  onChange() {
    if (
      this.signUpForm.value.password !==
        this.signUpForm.value.ConfirmPassword &&
      this.signUpForm.get('ConfirmPassword')?.dirty
    ) {
      this.passwordMatch = false;
    } else {
      this.passwordMatch = true;
    }
  }
  @Input() changePage: any;
  @Input() signup: any;
  signupUser() {
    if (this.signUpForm.valid && this.passwordMatch) {
      this.error = false;
      const payload = {
        fullName: this.signUpForm.value.fullName,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
      };

      this.http.post(this._signupUrl, payload).subscribe(
        (res: any) => {
          this.storageService.setToken(res.token);
          this.userService.setUser();
          this.router.navigateByUrl('Quiz');
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
}
