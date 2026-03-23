import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    isScrolled = false;
    isMenuOpen = false;

    constructor(private router: Router) {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', () => {
                this.isScrolled = window.scrollY > 50;
            });
        }
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu(): void {
        this.isMenuOpen = false;
        document.body.style.overflow = '';
    }

    navigateToFaq(): void {
        this.closeMenu();
        if (this.router.url === '/') {
            document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            this.router.navigate(['/'], { fragment: 'faq' }).then(() => {
                setTimeout(() => {
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
            });
        }
    }
}
