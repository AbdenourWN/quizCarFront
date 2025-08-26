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

export interface Quiz {
  _id?: string;
  name?: string;
  type?: string;
  result?: number;
  createdBy?: string;
  quizQuestions?: { question: string; response: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private quizSubject = new BehaviorSubject<Quiz[]>([]);
  public socket$!: WebSocketSubject<any>;
  private quizzes: Quiz[] = [];

  private apiUrl = `${environment.apiUrl}/api/quiz`; 

  constructor(private storage: StorageService, private http: HttpClient) {
    //this.initWebSocket();
  }

  watch(): Observable<Quiz[]> {
    return this.quizSubject.asObservable();
  }

  getQuizzes() {
    let options = this.getStandardOptions();
    this.http
      .get<Quiz[]>(this.apiUrl , options)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.quizzes = res;
        this.quizSubject.next(res);
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
    const url = `ws://${environment.apiUrl}/api/quiz?token=${token}`;
    this.socket$ = webSocket(url);
    this.socket$.subscribe({
      next: (msg) => {
        if (msg.url === '/api/quiz') {
          if (msg.method === 'create') {
            this.quizzes = [...this.quizzes, msg.quiz];
            this.quizSubject.next(this.quizzes);
          } else if (msg.method == 'update') {
            this.quizzes.forEach((el, index) => {
              if (el._id === msg.quiz._id) {
                this.quizzes[index] = msg.quiz;
                return;
              }
            });
            this.quizSubject.next(this.quizzes);
          } else {
            this.quizzes = this.quizzes.filter((el) => el._id !== msg.quiz._id);
            this.quizSubject.next(this.quizzes);
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
        new Error('Cannot retrieve quizzes from the server. Please try again.')
    );
  }
  getQuiz(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .get(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
  getMyQuizzes(id: string) {
    let options = this.getStandardOptions();
    this.http
      .get(this.apiUrl + `/me/${id}`, options)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.quizzes = res;
        this.quizSubject.next(res);
      });
  }
  addQuiz(payload: Quiz) {
    let options = this.getStandardOptions();
    return this.http
      .post(this.apiUrl, payload, options)
      .pipe(catchError(this.handleError));
  }
  updateQuiz(id: string, payload: Quiz | null) {
    let options = this.getStandardOptions();
    return this.http
      .patch(this.apiUrl + `/${id}`, payload, options)
      .pipe(catchError(this.handleError));
  }
  deleteQuiz(id: string) {
    let options = this.getStandardOptions();
    return this.http
      .delete(this.apiUrl + `/${id}`, options)
      .pipe(catchError(this.handleError));
  }
}
