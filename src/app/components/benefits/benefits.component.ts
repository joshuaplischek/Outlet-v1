import { Component } from '@angular/core';

interface Benefit {
    icon: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-benefits',
    templateUrl: './benefits.component.html',
    styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent {
    benefits: Benefit[] = [
        {
            icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>`,
            title: 'Premium Qualität',
            description: 'Hochwertige Fenster und Türen von führenden Herstellern'
        },
        {
            icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>`,
            title: 'Sofort verfügbar',
            description: 'Alle Produkte sind lagernd und können sofort abgeholt werden'
        },
        {
            icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
      </svg>`,
            title: 'Bis zu 60% Rabatt',
            description: 'Outlet-Preise für Ausstellungsstücke und Rückläufer'
        },
        {
            icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>`,
            title: 'Geprüfte Qualität',
            description: 'Alle Produkte werden vor dem Verkauf sorgfältig geprüft'
        }
    ];
}
