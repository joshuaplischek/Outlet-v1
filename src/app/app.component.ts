import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <button
      class="scroll-top-btn"
      [class.visible]="showScrollTop"
      (click)="scrollToTop()"
      aria-label="Nach oben scrollen">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  `,
  styles: [`
    .scroll-top-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 44px;
      height: 44px;
      background: var(--color-accent-blue);
      color: #fff;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 250ms ease, transform 250ms ease, background 150ms ease;
      pointer-events: none;
      box-shadow: 0 4px 16px rgba(0,102,255,0.35);
    }
    .scroll-top-btn.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .scroll-top-btn:hover {
      background: var(--color-accent-blue-light);
    }
  `]
})
export class AppComponent {
  title = 'Fensterpreiswert';
  showScrollTop = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.showScrollTop = window.scrollY > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
