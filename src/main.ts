import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { provideRouter } from '@angular/router';

import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // For HttpClient

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // Add for HttpClient in TicketStatusPage
  ]
}).catch(err => console.error(err));
