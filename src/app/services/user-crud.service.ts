import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  map,
  catchError,
  distinctUntilChanged,
  pairwise,
  tap,
  delay,
  first,
  takeLast,
  distinct,
  switchMap,
} from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface user {
  _id?: string;
  fullName?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserCRUDService {
  private users: user[] = [];
  private userSubject = new BehaviorSubject<user[]>([]);
  public socket$!: WebSocketSubject<any>;

  private apiUrl = `${environment.apiUrl}/api/user`;
  constructor(private storage: StorageService, private http: HttpClient) {
    //this.initWebSocket();
  }

  watch(): Observable<user[]> {
    return this.userSubject.asObservable();
  }

  getUsers() {
    let options = this.getStandardOptions();
    this.http
      .get<user[]>(this.apiUrl, options)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.users = res; // Update the local users array
        this.userSubject.next(res); // Emit the new list to subscribers
      });
  }

  private initWebSocket() {
    const token = this.storage.getToken(); // Assuming you want to use the token later for authentication
    const url = `ws://${environment.apiUrl}/api/user?token=${token}`;
    this.socket$ = webSocket(url);
    this.socket$.subscribe({
      next: (msg) => {
        if (msg.url === '/api/user') {
          if (msg.method === 'create') {
            this.users = [...this.users, msg.user];
            this.userSubject.next(this.users);
          } else if (msg.method == 'update') {
            this.users.forEach((el, index) => {
              if (el._id === msg.user._id) {
                this.users[index] = msg.user;
                return;
              }
            });
            this.userSubject.next(this.users);
          } else {
            this.users = this.users.filter((el) => el._id !== msg.user._id);
            this.userSubject.next(this.users);
          }
        }
      }, // Called whenever there is a message from the server.
      error: (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete'), // Called when connection is closed (for whatever reason).
    });
  }

  private getStandardOptions(): any {
    const token = this.storage.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error(
        'There is an issue with the client or network',
        error.error
      );
    } else {
      alert(error.error.error);
    }
    return throwError(
      () =>
        new Error('Cannot retrieve users from the server. Please try again.')
    );
  }
  getItsPermission() {
    let options = this.getStandardOptions();
    return this.http
      .get<any>(
        this.apiUrl + '/permissions',
        options
      )
      .pipe(catchError(this.handleError));
  }
  getUser(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .get(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
  addUser(payload: any) {
    let options = this.getStandardOptions();
    return this.http.post(
      this.apiUrl,
      payload,
      options
    );
  }
  updateUser(id: string, payload: user | null) {
    let options = this.getStandardOptions();
    return this.http.patch(
      this.apiUrl + `/${id}`,
      payload,
      options
    );
  }
  updateOldUser(id: string, payload: user | null) {
    let options = this.getStandardOptions();
    return this.http.patch(
      this.apiUrl + `/me/${id}`,
      payload,
      options
    );
  }
  deleteUser(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .delete(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
  updateUserSubject(user: user) {
    this.users = [...this.users, user];
    this.userSubject.next(this.users);
  }
}
