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
import { environment } from '../../environments/environment';
export interface Model {
  _id?: string;
  brand?: string;
  model?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private modelSubject = new BehaviorSubject<Model[]>([]);
  private models: Model[] = [];
  public socket$!: WebSocketSubject<any>;

  private apiUrl = `${environment.apiUrl}/api/model`; 

  constructor(private storage: StorageService, private http: HttpClient) {
    //this.initWebSocket();
  }
  getItsPermission() {
    let options = this.getStandardOptions();
    return this.http
      .get<any>(this.apiUrl + '/permissions', options)
      .pipe(catchError(this.handleError));
  }
  watch(): Observable<Model[]> {
    return this.modelSubject.asObservable();
  }

  getModels() {
    let options = this.getStandardOptions();
    this.http
      .get<Model[]>(this.apiUrl, options)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.models = res;
        this.modelSubject.next(res);
      });
  }

  private initWebSocket() {
    const token = this.storage.getToken(); // Assuming you want to use the token later for authentication
    const url = `ws://${environment.apiUrl}/api/model?token=${token}`;
    this.socket$ = webSocket(url);
    this.socket$.subscribe({
      next: (msg) => {
        if (msg.url === '/api/model') {
          if (msg.method === 'create') {
            this.models = [...this.models, msg.model];
            this.modelSubject.next(this.models);
          } else if (msg.method == 'update') {
            this.models.forEach((el, index) => {
              if (el._id === msg.model._id) {
                this.models[index] = msg.model;
                return;
              }
            });
            this.modelSubject.next(this.models);
          } else {
            this.models = this.models.filter((el) => el._id !== msg.model._id);
            this.modelSubject.next(this.models);
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
        new Error('Cannot retrieve models from the server. Please try again.')
    );
  }
  getModel(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .get(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
  addModel(payload: Model) {
    let options = this.getStandardOptions();
    return this.http
      .post(this.apiUrl, payload, options)
      .pipe(catchError(this.handleError));
  }
  updateModel(id: string, payload: Model | null) {
    let options = this.getStandardOptions();
    return this.http
      .patch(this.apiUrl + `/${id}`, payload, options)
      .pipe(catchError(this.handleError));
  }
  deleteModel(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .delete(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
}
