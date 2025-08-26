import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { catchError, Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
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
  private questionSubject = new Subject<any>();
  watch(): Observable<any> {
    return this.questionSubject.asObservable();
  }
  getItsPermission() {
    let options = this.getStandardOptions();
    return this.http
      .get<any>('http://localhost:3000/api/question/permissions', options)
      .pipe(catchError(this.handleError));
  }
  getQuestions() {
    let options = this.getStandardOptions();
    const questions = this.http
      .get('http://localhost:3000/api/question', options)
      .pipe(catchError(this.handleError));
    questions.subscribe((res) => {
      this.questionSubject.next(res);
    });
    return questions;
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
        new Error('Cannot retrive questions from the server. Please try again.')
    );
  }
  getQuestion(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .get(`http://localhost:3000/api/question/${id}`, options)
      .pipe(catchError(this.handleError));
  }
}
