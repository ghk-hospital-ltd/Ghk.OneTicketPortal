import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TICKET_STATUSES } from './ticket-status.config';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  template: `
    <header class="ghk-header">
      <div class="ghk-header-content">
        <img src="assets/logo.png" alt="Gleneagles Hospital Hong Kong Logo" class="ghk-logo" />
        <span class="ghk-title">Ticket Portal</span>
      </div>
    </header>
    <main class="ghk-main">
      <section class="ghk-ticket-status-card">
        <div *ngIf="ticketNumber" class="ghk-ticket-status-number-row">
          <span class="ghk-ticket-status-label">Ticket Number</span>
          <span class="ghk-ticket-status-number">{{ ticketNumber }}</span>
        </div>
        <div class="ghk-ticket-status-divider"></div>
        <div class="ghk-ticket-status-content">
          <span class="ghk-ticket-status-heading">Ticket Status</span>
          <p [innerHTML]="ticketMessageHtml"></p>
          <div *ngIf="currentStatus === 'invoice-ready'" class="ghk-payment-options">
             <div class="ghk-payment-icons">
              <img src="assets/payment/visa.svg" alt="Visa" title="Visa" />
              <img src="assets/payment/mastercard.svg" alt="MasterCard" title="MasterCard" />
              <img src="assets/payment/cup.svg" alt="CUP" title="CUP" />
              <img src="assets/payment/jcb.svg" alt="JCB" title="JCB" />
              <img src="assets/payment/amex.svg" alt="AMEX" title="AMEX" />
              <img src="assets/payment/alipay.svg" alt="Alipay" title="Alipay" />
              <img src="assets/payment/wechatpay.svg" alt="WeChat Pay" title="WeChat Pay" />
              <img src="assets/payment/googlepay.svg" alt="Google Pay" title="Google Pay" />
              <img src="assets/payment/applepay.svg" alt="Apple Pay" title="Apple Pay" />
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer class="ghk-footer">
      <div class="ghk-footer-content">
        <span>&copy; {{ currentYear }} Gleneagles Hospital Hong Kong. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles: [],
})
export class App implements OnInit {
  protected readonly title = signal('Ticket Portal');
  currentYear = new Date().getFullYear();

  ticketNumber: string | null = null;
  currentStatus = 'invoice-ready';

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      this.ticketNumber = params.get('ticket');
      if (this.ticketNumber === '12345') {
        this.currentStatus = 'invoice-ready';
      } else if (this.ticketNumber === '23456') {
        this.currentStatus = 'journey-incomplete';
      } else {
        this.currentStatus = 'journey-incomplete';
      }
    }
  }

  get ticketMessage() {
    const found = TICKET_STATUSES.find(s => s.status === this.currentStatus);
    return found ? found.message : '';
  }

  get ticketMessageHtml() {
    return this.ticketMessage.replace(/\n/g, '<br>');
  }

}
