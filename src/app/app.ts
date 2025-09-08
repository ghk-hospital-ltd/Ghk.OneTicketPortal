// src/app/app.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
   <header class="ghk-header">
      <div class="ghk-header-content">
        <img src="/assets/logo.png" alt="Gleneagles Hospital Hong Kong Logo" class="ghk-logo" />
        <span class="ghk-title">Ticket Portal</span>
      </div>
    </header>

    <!-- Routed content area -->
    <main class="shell-main">
      <router-outlet></router-outlet>
    </main>

    <footer class="ghk-footer">
      <div class="ghk-footer-content">
        <span>&copy; {{ currentYear }} Gleneagles Hospital Hong Kong. All rights reserved.</span>
      </div>
    </footer>
  `
})
export class AppComponent {
  protected readonly title = signal('Ticket Portal');
  currentYear = new Date().getFullYear();
}
