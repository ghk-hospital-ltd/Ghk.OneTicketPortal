import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-failure-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="ghk-main">
      <section class="ghk-ticket-status-card ghk-failure-wrap">

        <div class="ghk-failure-icon" aria-hidden="true">✕</div>

        <h1 class="ghk-failure-title">
          Payment Unsuccessful<br>
          <span lang="zh" class="ghk-zh">未能付款</span>
        </h1>

        <p class="ghk-failure-msg">
          {{ errorMessageEn }}<br>
          <span lang="zh" class="ghk-zh">{{ errorMessageZh }}</span>
        </p>

  <div class="ref-row" *ngIf="referenceNumber">
          <span>Reference No.:</span>
          <span class="ref">{{ referenceNumber }}</span>
        </div>

        <div class="ghk-help">
          <div>Need help? Contact support.</div>
          <div lang="zh" class="ghk-zh">需要協助？請聯絡客服。</div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .ghk-failure-wrap { text-align: center; padding: 18px 16px; }
    .ghk-failure-icon {
      width: 56px; height: 56px; margin: 8px auto 6px;
      display: grid; place-items: center; border-radius: 50%;
      background: #ffe8e8; color: #b00020; font-size: 28px; font-weight: 700;
    }
    .ghk-failure-title {
      margin: 8px 0 6px; font-size: 1.4rem; font-weight: 700;
      letter-spacing: 0.2px; color: var(--ghk-black, #0b1a2b);
    }
    .ghk-zh { font-family: "PT Sans Caption", "PingFang TC", "Microsoft JhengHei", system-ui; }
    .ghk-failure-msg { margin: 10px auto 16px; max-width: 680px; line-height: 1.4rem; font-size: 0.98rem; color: #333; }
    .ghk-actions { display: flex; gap: 10px; justify-content: center; margin-top: 6px; }
    .ghk-primary {
      background: var(--ghk-blue, #0066b3); color: #fff; border: 0; border-radius: 10px;
      padding: 10px 16px; font-weight: 700; cursor: pointer;
    }
    .ghk-primary:hover { background:#00539b; }
    .ghk-secondary {
      background: #eef2f6; color: #0b1a2b; border: 0; border-radius: 10px;
      padding: 10px 16px; font-weight: 600; cursor: pointer;
    }
        .ref-row, .amount-row {
      display:flex; gap:6px; justify-content:center; flex-wrap:wrap;
      font-size:13px; color:#334155; margin:4px 0;
    }
    .ghk-secondary:hover { background: #e6ecf3; }
    .ghk-help { margin-top: 14px; font-size: 0.9rem; color: #555; }
  `]
})
export class PaymentFailurePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  errorMessageEn = '';
  errorMessageZh = '';
  referenceNumber = '';
  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap;
    this.errorMessageEn = qp.get('errorMessageEn') || 'Your payment could not be processed.';
    this.errorMessageZh = qp.get('errorMessageZh') || '未能處理您的付款。';
    this.referenceNumber = qp.get('reference_number') || '';
  }


}
