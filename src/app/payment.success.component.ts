import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="success-container">
 
      <section class="success-card">
        <div class="icon-circle">
          <svg viewBox="0 0 24 24" class="check">
            <path d="M20.285 6.709a1 1 0 0 0-1.57-1.246l-8.2 10.33-4.23-4.23a1 1 0 0 0-1.414 1.415l5 5a1 1 0 0 0 1.51-.065l8.904-11.204z"/>
          </svg>
        </div>

        <h2 class="title">Thanks for Payment</h2>
        <p class="subtitle" *ngIf="isAccept; else notAccept">
          Your payment is successfully paid.
        </p>
        <ng-template #notAccept>
          <p class="subtitle">Payment status: {{ decision || 'Unknown' }}</p>
        </ng-template>

        <div class="ref-row" *ngIf="referenceNo">
          <span>Reference No.:</span>
          <span class="ref">{{ referenceNo }}</span>
        </div>

        <div class="amount-row" *ngIf="amount">
          <span>Amount:</span>
          <span class="amt">HKD {{ amount }}</span>
        </div>

      
      </section>
    </main>
  `,
  styles: [` 
    :host { display:block; width:100%; }

  /* Fill the AVAILABLE space in the shell-main, not the whole viewport */
  .success-container {
    min-height: 100%;
    width: 100%;
    display: grid;  
    place-items: center;   /* vertical + horizontal center */
    padding: 16px;
    box-sizing: border-box;
  }

 
    .success-card {width: 100%;
      background:#fff; border-radius:16px; padding:24px; box-shadow:0 8px 24px rgba(15,23,42,.06);
      text-align:center;
    }
    .icon-circle {
      width:72px; height:72px; border-radius:999px;
      background:#e6f7ee; margin:0 auto 12px; display:grid; place-items:center;
      box-shadow: inset 0 0 0 2px #b7ebc6;
    }
    .check { width:36px; height:36px; fill:#19a75a; }
    .title { margin:4px 0 2px; font-size:20px; color:#0f172a; }
    .subtitle { margin:0 0 12px; color:#334155; font-size:14px; }
    .ref-row, .amount-row {
      display:flex; gap:6px; justify-content:center; flex-wrap:wrap;
      font-size:13px; color:#334155; margin:4px 0;
    }
    .ref { color:#0f172a; font-weight:600; word-break:break-all; }
    .amt { color:#0f172a; font-weight:600; } 
 
  `]
})
export class PaymentSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  decision = '';
  referenceNo = '';
  amount = '';
  now = new Date();

  get isAccept() { return this.decision?.toUpperCase() === 'ACCEPT'; }

  ngOnInit() {
    // Cybersource Hosted Checkout commonly returns these names. We pick the first present.
    const qp = this.route.snapshot.queryParamMap;

    this.decision =
      qp.get('decision') ||
      qp.get('req_decision') || '';

    this.referenceNo =
      qp.get('reference_number') ||
      qp.get('req_reference_number') ||
      qp.get('transaction_id') || // sometimes handy to display if reference not present
      '';

    this.amount =
      qp.get('amount') ||
      qp.get('req_amount') || '';

    // If you redirect via POST->redirect, you might map post fields to query on your backend before redirecting.
  }

  onCheckReceipt() {
    // If you have a receipt route or backend receipt URL, push to it here.
    // Example: /receipt?ref=...
    this.router.navigate(['/receipt'], { queryParams: { ref: this.referenceNo } });
  }

  onBack() {
    // Back to ticket/billing page (adjust route as needed)
    this.router.navigate(['/']);
  }
}
