import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="p-8 flex flex-col items-center gap-4">
      <h2 class="text-xl font-bold">Calculating Price...</h2>
      <mat-progress-spinner mode="indeterminate" color="accent"></mat-progress-spinner>
      <p class="text-center text-gray-600 mt-2">
        Connecting to the AI model. This may take a moment on the first request.(Using free hosting so the first request may take longer 😅)
      </p>
    </div>
  `,
})
export class LoadingDialogComponent {}