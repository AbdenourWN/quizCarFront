import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center text-center p-4">
      <img src="assets/logo.png" alt="QuizCars Logo" class=" mb-8 animate-pulse">
      <mat-progress-spinner mode="indeterminate" class="mb-8 animate-spin" color="accent"></mat-progress-spinner>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Waking Up the Engines...</h1>
      <p class="text-gray-600 max-w-md">
        Welcome! As this is a free portfolio project, our backend services go to sleep after a period of inactivity. 
        The first startup can take up to 40 seconds. Thanks for your patience! 😅
      </p>
    </div>
  `
})
export class LoadingScreenComponent {}