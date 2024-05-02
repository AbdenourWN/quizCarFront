import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private userService: UserService
  ) {}
  error = false;
  showError = false;
  errorMsg = '';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  @Input() changePage: any;
  @Input() login: any;
  private _loginUrl = 'http://localhost:3000/api/auth/login';
  loginUser() {
    if (this.loginForm.valid) {
      this.error = false;
      this.http.post(this._loginUrl, this.loginForm.value).subscribe(
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
