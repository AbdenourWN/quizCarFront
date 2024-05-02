import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: BehaviorSubject<any>;
  public user;

  constructor(private storage: StorageService, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(null);
    this.user = this.userSubject.asObservable();
  }

  // Function to set user data
  setUser() {
    const token = this.storage.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // This is typically not needed for GET requests
    });
    this.http
      .get('http://localhost:3000/api/user/me', { headers: headers })
      .subscribe(
        (response) => {
          this.userSubject.next(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // Function to get user data
  getUser() {
    return this.userSubject.asObservable();
  }
  // Function to remove user data
  removeUser() {
    this.userSubject.next(null);
  }
}
