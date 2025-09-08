import { Routes } from '@angular/router';
import { TicketStatusPage } from './ticket-status.page';
import { PaymentSuccessComponent } from './payment.success.component';
 export const routes: Routes = [
  { path: 'ticket', component: TicketStatusPage },
  { path: 'payment/success', component: PaymentSuccessComponent },
  { path: '', redirectTo: '/ticket', pathMatch: 'full' }, // Redirect root to /ticket
  { path: '**', redirectTo: '/ticket' }
];
