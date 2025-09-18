import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface TicketInfo {
  isSuccess: boolean;
  displayTicketNumber?: string;
  clinicNameEn?: string;
  clinicNameZh?: string;
  doctorNameEn?: string;
  doctorNameZh?: string;
  visitDate?: string;               // "yyyy-MM-dd HH:mm:ss"
  patientJourneyStatus?: string;    // e.g. "INVOICED", "COMPLETED", etc.
  statusMessageEn?: string;
  statusMessageZh?: string;
  amount? : string;
}

interface PaymentInitResponse {
  paymentUrl: string;
  fields: Record<string, string>;
}

@Component({
  selector: 'app-ticket-status-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="ghk-main">
      <section class="ghk-ticket-status-card">

        <!-- Top info -->
          <div *ngIf="ticketInfo?.isSuccess" class="ghk-ticket-info-row">
      <div class="ghk-ticket-info-value">{{ ticketInfo?.displayTicketNumber }}</div>
    </div>

        <div *ngIf="ticketInfo?.isSuccess" class="ghk-ticket-info-pill-row">
            <div class="ghk-ticket-info-pill" *ngIf="ticketInfo?.clinicNameEn || ticketInfo?.clinicNameZh">
        <div>{{ ticketInfo?.clinicNameEn }}</div>
        <div *ngIf="ticketInfo?.clinicNameZh" lang="zh" class="ghk-zh-line">{{ ticketInfo?.clinicNameZh }}</div>
      </div>

      <!-- Keep Doctor EN/ZH as separate lines in one pill too (optional but consistent) -->
       <div *ngIf="ticketInfo?.isSuccess" class="ghk-ticket-info-pill-row">
        <div class="ghk-ticket-info-pill" *ngIf="ticketInfo?.doctorNameEn || ticketInfo?.doctorNameZh">
          <div>{{ ticketInfo?.doctorNameEn }}</div>
          <div *ngIf="ticketInfo?.doctorNameZh" lang="zh" class="ghk-zh-line">{{ ticketInfo?.doctorNameZh }}</div>
        </div>
      </div>

          <div class="ghk-ticket-info-pill-last" *ngIf="ticketInfo?.visitDate">
            {{ ticketInfo?.visitDate | date:'yyyy-MM-dd HH:mm' }}
          </div>

        </div>

        <div *ngIf="ticketInfo?.isSuccess" class="ghk-ticket-status-divider"></div>

        <!-- Status message from backend -->
        <div class="ghk-ticket-status-content">
          <p *ngIf="ticketInfo && !showPaymentOptions" [innerHTML]="ticketMessageHtml"></p>

          <!-- Online payment only when INVOICED -->
          <div *ngIf="ticketInfo?.isSuccess && isInvoiced">
           <div class="ghk-terms-consent" *ngIf="!showPaymentOptions">
  <input
    id="termsCheck"
    type="checkbox"
    [checked]="agreeTerms"
    (change)="agreeTerms = $any($event.target).checked"
    aria-describedby="termsDesc"
  />


  <div id="termsDesc" class="ghk-terms-desc">
    I have read and understood and agree to abide by the
    <a href="/terms" target="_blank" rel="noopener" class="ghk-terms-link">
      terms and conditions
    </a>.<br>
    <span lang="zh" class="ghk-zh-line">
      已閱讀並理解上述
      <a href="/terms" target="_blank" rel="noopener"  lang="zh" class="ghk-terms-link">
        條款與條件
      </a>，並同意遵守。
    </span>
  </div>
</div>


            <button
              class="ghk-payment-btn"
              (click)="showPaymentOptions = true"
              *ngIf="!showPaymentOptions"   [disabled]="!agreeTerms"
            >
              Online Payment 線上付款
            </button>

            <div *ngIf="showPaymentOptions">

              <div class="ghk-payment-amount">
                <span>Amount:</span>
                 <span class="ghk-payment-amount-value">
    {{ ticketInfo?.amount | number:'1.2-2' }} HKD
  </span>
              </div>


              <div class="ghk-payment-options">
                <div class="ghk-payment-icons">
                  <button class="ghk-pay-icon-btn" (click)="onPay('visa')" title="Visa">
                    <img src="assets/payment/visa.svg" alt="Visa" />
                  </button>
                  <button class="ghk-pay-icon-btn" (click)="onPay('mastercard')" title="MasterCard">
                    <img src="assets/payment/mastercard.svg" alt="MasterCard" />
                  </button>
                  <button class="ghk-pay-icon-btn" (click)="onPay('cup')" title="CUP">
                    <img src="assets/payment/cup.svg" alt="CUP" />
                  </button>
                  <button class="ghk-pay-icon-btn" (click)="onPay('jcb')" title="JCB">
                    <img src="assets/payment/jcb.svg" alt="JCB" />
                  </button>
                  <button class="ghk-pay-icon-btn" (click)="onPay('amex')" title="AMEX">
                    <img src="assets/payment/amex.svg" alt="AMEX" />
                  </button>

                  <!-- (Apple/Google Pay later via Simple Order API) -->
                  <!--  <img src="assets/payment/alipay.svg" alt="Alipay" title="Alipay" />-->
                  <!--  <img src="assets/payment/wechatpay.svg" alt="WeChat Pay" title="WeChat Pay" />-->
                  <!--  <img src="assets/payment/googlepay.svg" alt="Google Pay" title="Google Pay" />-->
                  <!--  <img src="assets/payment/applepay.svg" alt="Apple Pay" title="Apple Pay" />  -->
                </div>
              </div>

              <div *ngIf="payError" class="ghk-pay-error">{{ payError }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
.ghk-payment-btn[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
.ghk-terms-label { line-height: 1.2; }

.ghk-terms-link { color: var(--ghk-blue, #0066b3); text-decoration: underline; }
.ghk-terms-link:focus { outline: 2px solid #93c5fd; outline-offset: 2px; }
.ghk-terms-consent {
  display: grid;
  grid-template-columns: 26px auto; /* match bigger box */
  gap: 8px 10px;
  align-items: start;
  margin: 10px 0 14px 0;
  font-size: 0.95rem;
  color: #334155;
}
  .ghk-terms-consent input[type="checkbox"] {
  width: 22px;       /* bigger box */
  height: 22px;
  transform: scale(1); /* enlarge the native checkbox */
  margin-top: 2px;
  cursor: pointer;
}
.ghk-terms-consent input { margin-top: 2px; }
    .ghk-ticket-number-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
  margin-bottom: 10px;
}

.ghk-zh-line {
  font-size: 0.86rem;
  opacity: 0.9;
  font-family: var(--font-cjk);
}
    .ghk-payment-btn {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--ghk-blue, #0066b3); color: var(--ghk-white, #fff);
      font-size: 1rem; font-weight: 600; letter-spacing: 0.5px;
      padding: 0.9rem 1.8rem; border: none; border-radius: 12px; cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 102, 179, 0.25);
      transition: all 0.2s ease-in-out;
    }
    .ghk-payment-btn:hover { background: #00539b; box-shadow: 0 6px 16px rgba(0, 83, 155, 0.3); transform: translateY(-2px); }
    .ghk-payment-btn:active { background: #004080; transform: translateY(0); box-shadow: 0 2px 6px rgba(0, 64, 128, 0.25); }
    .ghk-payment-icons { display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:1rem; justify-content:center; }
    .ghk-payment-icons img { height:24px; width:auto; }
    .ghk-pay-icon-btn { background: transparent; border: 0; padding: 0; cursor: pointer; }
    .ghk-pay-icon-btn img { height: 28px; }
    .ghk-pay-error { color:#c00; margin-top:8px; }
  `]
})
export class TicketStatusPage implements OnInit {
  ticketInfo: TicketInfo | null = null;
  showPaymentOptions = false;
  payError = '';
  agreeTerms = false;
  private apiUrl = '';
    ticketId: String | null = '';
  get isInvoiced(): boolean {
    return (this.ticketInfo?.patientJourneyStatus?.toUpperCase() === 'INVOICED') ;
  }

  get ticketMessageHtml(): string {
    if (!this.ticketInfo) return '';
    const en = this.ticketInfo.statusMessageEn ?? '';
    const zh = this.ticketInfo.statusMessageZh ? `<br><span  lang="zh" class="ghk-zh-line" >${this.ticketInfo.statusMessageZh}</span>` : '';
    return `${en}${zh}`;
  }

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
      this.ticketId = params.get('data');

    this.http.get<{ apiUrl: string   }>('assets/config.json').subscribe(cfg => {
      this.apiUrl = cfg.apiUrl;

      if ( this.ticketId && this.apiUrl) {
        this.http.get<TicketInfo>(`${this.apiUrl}/api/Ticket/GetTicketInfo/${ this.ticketId}` ).subscribe({
          next: info => {
            this.zone.run(() => {
              this.ticketInfo = info;
              this.cd.markForCheck();
            });
          },
          error: _ => {
            this.ticketInfo = {
              isSuccess: false,
              statusMessageEn: 'We’re currently experiencing a temporary service disruption. Our team is working to resolve the issue as quickly as possible. Thank you for your patience.',
              statusMessageZh: '我們目前正在處理系統問題，服務將儘快恢復，感謝您的耐心等候。'
            };
            this.cd.markForCheck();
          }
        });
      }else{
        this.ticketInfo = {
              isSuccess: false,
              statusMessageEn: 'Invalid QR code',
              statusMessageZh: '二維碼無效'
            };
            this.cd.markForCheck();
      }
    });
  }

  onPay(method: 'visa' | 'mastercard' | 'cup' | 'jcb' | 'amex' | 'card') {
    this.payError = '';
    if (!this.ticketInfo?.isSuccess || !this.apiUrl || !this.ticketInfo.displayTicketNumber) {
      this.payError = 'Payment is not available right now.';
      return;
    }

    const body = {
      ticketNumber:   this.ticketId,
      method
    };

    this.http.post<PaymentInitResponse>(`${this.apiUrl}/api/Ticket/InitiatePayment`, body )
      .subscribe({
        next: res => this.submitToGateway(res),
        error: _ => this.payError = 'Unable to initiate payment. Please try again.'
      });
  }

  private submitToGateway(res: PaymentInitResponse) {
    if (!res?.paymentUrl || !res?.fields) {
      this.payError = 'Payment setup incomplete.';
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = res.paymentUrl;

    for (const [k, v] of Object.entries(res.fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = String(v ?? '');
      form.appendChild(input);
    }

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.style.display = 'none';
    form.appendChild(submit);

    document.body.appendChild(form);
    submit.click();
  }
}
