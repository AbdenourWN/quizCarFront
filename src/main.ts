import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { StartupService } from './app/services/startup.service';
import { APP_INITIALIZER } from '@angular/core';

export function initializeAppFactory(
  startupService: StartupService
): () => Promise<any> {
  return () => startupService.initializeApp();
}

bootstrapApplication(AppComponent, {
  ...appConfig, // Spread the existing appConfig
  providers: [
    ...appConfig.providers, // Spread existing providers
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [StartupService],
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
