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

export interface Version {
  _id?: string;
  model?: string;
  version?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private versionSubject = new BehaviorSubject<Version[]>([]);
  public socket$!: WebSocketSubject<any>;
  private versions: Version[] = [];

  constructor(private storage: StorageService, private http: HttpClient) {
    this.initWebSocket();
  }

  watch(): Observable<Version[]> {
    return this.versionSubject.asObservable();
  }

  getVersions() {
    let options = this.getStandardOptions();
    this.http
      .get<Version[]>('http://localhost:3000/api/version', options)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.versions = res;
        this.versionSubject.next(res);
      });
  }

  private initWebSocket() {
    const token = this.storage.getToken(); // Assuming you want to use the token later for authentication
    const url = `ws://localhost:3000/api/version?token=${token}`;
    this.socket$ = webSocket(url);
    this.socket$.subscribe({
      next: (msg) => {
        if (msg.url === '/api/version') {
          if (msg.method === 'create') {
            this.versions = [...this.versions, msg.version];
            this.versionSubject.next(this.versions);
          } else if (msg.method == 'update') {
            this.versions.forEach((el, index) => {
              if (el._id === msg.version._id) {
                this.versions[index] = msg.version;
                return;
              }
            });
            this.versionSubject.next(this.versions);
          } else {
            this.versions = this.versions.filter((el) => el._id !== msg.version._id);
            this.versionSubject.next(this.versions);
          }
        }
      }, // Called whenever there is a message from the server.
      error: (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete'), // Called when connection is closed (for whatever reason).
    });
  }
  getItsPermission() {
    let options = this.getStandardOptions();
    return this.http
      .get<any>('http://localhost:3000/api/version/permissions', options)
      .pipe(catchError(this.handleError));
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
        new Error('Cannot retrieve versions from the server. Please try again.')
    );
  }
  getVersion(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .get(`http://localhost:3000/api/version/${id}`, options)
      .pipe(catchError(this.handleError));
  }
  addVersion(payload: Version) {
    let options = this.getStandardOptions();
    return this.http
      .post(`http://localhost:3000/api/version`, payload, options)
      .pipe(catchError(this.handleError));
  }
  updateVersion(id: string, payload: Version | null) {
    let options = this.getStandardOptions();
    return this.http
      .patch(`http://localhost:3000/api/version/${id}`, payload, options)
      .pipe(catchError(this.handleError));
  }
  deleteVersion(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .delete(`http://localhost:3000/api/version/${id}`, options)
      .pipe(catchError(this.handleError));
  }
}
