import { RenderMode, ServerRoute } from '@angular/ssr';
import { PaymentSuccessComponent } from './payment.success.component';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'payment/success',
 
    renderMode: RenderMode.Server,  // render fresh on each request
  },
  
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
