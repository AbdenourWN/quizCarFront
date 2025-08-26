import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { StorageService } from './services/storage.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { StartupService } from './services/startup.service';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './loading-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [AuthComponent],
})
export class AppComponent implements OnInit {
  title = 'quizCars';
  isLoading$: Observable<boolean>; // Create a property to hold the observable

  constructor(private startupService: StartupService) {
    // Assign the observable from the service
    this.isLoading$ = this.startupService.isLoading$;
  }

  ngOnInit(): void {
    // We will call the initializeApp method from the main.ts file
    // so it runs before anything else.
  }
}
