import { Routes } from '@angular/router';
import { TicketStatusPage } from './ticket-status.page';
import { PaymentSuccessComponent } from './payment.success.component';
import { PaymentFailurePage } from './payment.failure.component';
 export const routes: Routes = [
  { path: 'ticketStatus/ticket', component: TicketStatusPage },
  { path: 'payment/success', component: PaymentSuccessComponent },
    { path: 'payment/failure', component: PaymentFailurePage },
  { path: '', redirectTo: '/ticket', pathMatch: 'full' }, // Redirect root to /ticket
  { path: '**', redirectTo: '/ticket' }
];
