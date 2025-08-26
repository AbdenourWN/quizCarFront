import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  // A BehaviorSubject to track the loading state
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // This is the main method to call on app startup
  initializeApp(): Promise<void> {
    console.log("StartupService: Initializing app and waking up APIs...");
    
    // We use a Promise here because it integrates nicely with Angular's APP_INITIALIZER
    return new Promise((resolve) => {
      const mainApiHealthCheck$ = this.http.get(environment.apiUrl).pipe(
        catchError(() => of('Main API is offline')) // Don't let an error stop the whole process
      );
      
      const aiApiHealthCheck$ = this.http.post(environment.aiApiUrl + '/predict', {}).pipe(
        catchError(() => of('AI API is offline')) // Send an empty post to wake it up
      );

      // forkJoin waits for all observables to complete
      forkJoin([mainApiHealthCheck$, aiApiHealthCheck$]).subscribe({
        next: (responses) => {
          console.log("StartupService: Both APIs have responded.", responses);
          this.isLoadingSubject.next(false); // APIs are awake, turn off loading screen
          resolve(); // Resolve the promise to let the app continue loading
        },
        error: (err) => {
          // This block should ideally not be hit because of catchError, but it's good practice
          console.error("StartupService: An unexpected error occurred.", err);
          this.isLoadingSubject.next(false); // Still hide loading screen on error
          resolve();
        }
      });
    });
  }
}