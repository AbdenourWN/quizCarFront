import { Component, Injectable } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, LoginComponent, SignUpComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  constructor() {}
  switch = 'login';
  changePage = () => {
    if (this.switch === 'login') this.switch = 'signup';
    else if (this.switch === 'signup') this.switch = 'login';
  };
  loggedIn(): Boolean {
    return !!localStorage.getItem('token');
  }
}
