import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TicketStatusPage } from './ticket-status.page';
 import { PaymentSuccessComponent } from './payment.success.component';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(), provideClientHydration(withEventReplay()),  
     provideHttpClient(), provideRouter([
      {path: 'ticket', pathMatch: 'full', component: TicketStatusPage},{ path: 'payment/success', component: PaymentSuccessComponent },
 
    ])
  ]
};
