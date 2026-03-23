import { Component } from '@angular/core';

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
    scrollToBenefits(event: Event): void {
        event.preventDefault();
        document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
    }
}
