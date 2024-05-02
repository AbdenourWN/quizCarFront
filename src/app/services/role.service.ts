import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface Role {
  _id?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roleSubject = new BehaviorSubject<Role[]>([]);
  public socket$!: WebSocketSubject<any>;
  private roles: Role[] = [];

  constructor(private storage: StorageService, private http: HttpClient) {
    this.initWebSocket();
  }

  watch(): Observable<Role[]> {
    return this.roleSubject.asObservable();
  }

  getRoles() {
    let options = this.getStandardOptions();
    this.http
      .get<Role[]>('http://localhost:3000/api/role', options)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.roles = res;
        this.roleSubject.next(res);
      });
  }

  private initWebSocket() {
    const token = this.storage.getToken(); // Assuming you want to use the token later for authentication
    const url = `ws://localhost:3000/api/role?token=${token}`;
    this.socket$ = webSocket(url);
    this.socket$.subscribe({
      next: (msg) => {
        if (msg.url === '/api/role') {
          if (msg.method === 'create') {
            this.roles = [...this.roles, msg.role];
            this.roleSubject.next(this.roles);
          } else if (msg.method == 'update') {
            this.roles.forEach((el, index) => {
              if (el._id === msg.role._id) {
                this.roles[index] = msg.role;
                return;
              }
            });
            this.roleSubject.next(this.roles);
          } else {
            this.roles = this.roles.filter((el) => el._id !== msg.role._id);
            this.roleSubject.next(this.roles);
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
      console.error('Server-Side-Error: ', error.error);
    }
    return throwError(
      () =>
        new Error('Cannot retrieve roles from the server. Please try again.')
    );
  }
  getItsPermission() {
    let options = this.getStandardOptions();
    return this.http
      .get<any>('http://localhost:3000/api/role/permissions', options)
      .pipe(catchError(this.handleError));
  }
  getRole(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .get(`http://localhost:3000/api/role/${id}`, options)
      .pipe(catchError(this.handleError));
  }
  addRole(payload: Role) {
    let options = this.getStandardOptions();
    return this.http
      .post(`http://localhost:3000/api/role`, payload, options)
      .pipe(catchError(this.handleError));
  }
  updateRole(id: string, payload: Role | null) {
    let options = this.getStandardOptions();
    return this.http
      .patch(`http://localhost:3000/api/role/${id}`, payload, options)
      .pipe(catchError(this.handleError));
  }
  deleteRole(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .delete(`http://localhost:3000/api/role/${id}`, options)
      .pipe(catchError(this.handleError));
  }
}
