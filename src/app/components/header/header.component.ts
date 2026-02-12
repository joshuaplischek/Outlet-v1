import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    isScrolled = false;
    isMenuOpen = false;

    constructor() {
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
}
