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

export interface Brand {
  _id?: string;
  brand?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private brands: Brand[] = [];
  private brandSubject = new BehaviorSubject<Brand[]>([]);
  public socket$!: WebSocketSubject<any>;

  private apiUrl = `${environment.apiUrl}/api/brand`; 

  constructor(private storage: StorageService, private http: HttpClient) {
    //this.initWebSocket();
  }

  watch(): Observable<Brand[]> {
    return this.brandSubject.asObservable();
  }

  getBrands() {
    let options = this.getStandardOptions();
    this.http
      .get<Brand[]>(this.apiUrl, options)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.brands = res;
        this.brandSubject.next(res);
      });
  }
  getItsPermission() {
    let options = this.getStandardOptions();
    return this.http
      .get<any>(this.apiUrl + '/permissions', options)
      .pipe(catchError(this.handleError));
  }
  private initWebSocket() {
    const token = this.storage.getToken(); // Assuming you want to use the token later for authentication
    const url = `ws://${environment.apiUrl}/api/brand?token=${token}`;
    this.socket$ = webSocket(url);
    this.socket$.subscribe({
      next: (msg) => {
        if (msg.url === '/api/brand') {
          if (msg.method === 'create') {
            this.brands = [...this.brands, msg.brand];
            this.brandSubject.next(this.brands);
          } else if (msg.method == 'update') {
            this.brands.forEach((el, index) => {
              if (el._id === msg.brand._id) {
                this.brands[index] = msg.brand;
                return;
              }
            });
            this.brandSubject.next(this.brands);
          } else {
            this.brands = this.brands.filter((el) => el._id !== msg.brand._id);
            this.brandSubject.next(this.brands);
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
        new Error('Cannot retrieve brands from the server. Please try again.')
    );
  }
  getBrand(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .get(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
  addBrand(payload: Brand) {
    let options = this.getStandardOptions();
    return this.http
      .post(this.apiUrl, payload, options)
      .pipe(catchError(this.handleError));
  }
  updateBrand(id: string, payload: Brand | null) {
    let options = this.getStandardOptions();
    return this.http
      .patch(this.apiUrl + `/${id}`, payload, options)
      .pipe(catchError(this.handleError));
  }
  deleteBrand(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .delete(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
}
