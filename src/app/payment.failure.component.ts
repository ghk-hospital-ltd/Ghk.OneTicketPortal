import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'C7fX9pQ2LmZ4r8aN1vS6dW3tG0yHb5kE';

function base64UrlToUint8Array(b64url: string): Uint8Array {
  const pad = (s: string) => s + '==='.slice((s.length + 3) % 4);
  const b64 = pad(b64url.replace(/-/g, '+').replace(/_/g, '/'));
  const firstDecoded = atob(b64); // First base64 decode

  // Check if it's still base64-encoded — try decode again if needed
  const maybeSecondDecoded = (() => {
    try {
      return atob(firstDecoded);
    } catch {
      return firstDecoded;
    }
  })();

  const bytes = Uint8Array.from(maybeSecondDecoded, c => c.charCodeAt(0));
  return bytes;
}

function uint8ToWordArray(u8Array: Uint8Array): CryptoJS.lib.WordArray {
  const words = [];
  for (let i = 0; i < u8Array.length; i += 4) {
    words.push(
      (u8Array[i] << 24) |
      (u8Array[i + 1] << 16) |
      (u8Array[i + 2] << 8) |
      (u8Array[i + 3])
    );
  }

  return CryptoJS.lib.WordArray.create(words, u8Array.length);
}

export function decryptPayload(data: string): Record<string, unknown> {
  // bytes = IV (16) || ciphertext
  const all = base64UrlToUint8Array(data);
  const ivBytes = all.slice(0, 16);
  const ctBytes = all.slice(16);

  const ivWA = uint8ToWordArray(ivBytes);
  const ctWA = uint8ToWordArray(ctBytes);
  const keyWA = CryptoJS.enc.Utf8.parse(SECRET_KEY); // 32 bytes


  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: ctWA
  });

  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    keyWA,
    { iv: ivWA, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  if (!plaintext) throw new Error('Decryption failed (empty plaintext)');
  return JSON.parse(plaintext);
}
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

      const enc = qp.get('data');
      if (enc) {
        const payload = decryptPayload(enc);
        this.errorMessageEn = String(payload['errorMessageEn'] ?? 'Your payment could not be completed. Please retry or proceed to the Business Office cashier to finalise your transaction.');
        this.referenceNumber = String(payload['reference_number'] ?? '');
        this.errorMessageZh = String(payload['errorMessageZh'] ??'目前無法處理您的賬單付款，請稍後重新嘗試，或前往收費處辦理繳款事宜。');
      }

  }


}
