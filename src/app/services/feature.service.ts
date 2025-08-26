import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private apiUrl = `${environment.apiUrl}/api/feature`;
  constructor(private storage: StorageService, private http: HttpClient) {}
  private getStandardOptions(): any {
    const token = this.storage.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }
  private featureSubject = new Subject<any>();
  watch(): Observable<any> {
    return this.featureSubject.asObservable();
  }
  getItsPermission() {
    let options = this.getStandardOptions();
    return this.http
      .get<any>(this.apiUrl + '/permissions', options)
      .pipe(catchError(this.handleError));
  }
  getFeatures() {
    let options = this.getStandardOptions();
    const features = this.http
      .get(this.apiUrl, options)
      .pipe(catchError(this.handleError));
    features.subscribe((res) => {
      this.featureSubject.next(res);
    });
    return features;
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
        new Error('Cannot retrive features from the server. Please try again.')
    );
  }
  getFeature(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .get(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
}
