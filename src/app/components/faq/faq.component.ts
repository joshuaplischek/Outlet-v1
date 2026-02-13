import { Component } from '@angular/core';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
    faqs = [
        {
            question: 'Wo muss ich meine Bestellung abholen?',
            answer: 'Sie können Ihre Bestellung direkt an unserem Lager in der Hauptstraße 8B, 56457 Halbs abholen. Bitte vereinbaren Sie vorab einen Termin, damit wir Ihre Ware für die Verladung bereitstellen können.'
        },
        {
            question: 'Bis wohin liefern Sie und was kostet der Versand?',
            answer: 'Wir liefern deutschlandweit. Die Versandkosten richten sich nach Menge, Gewicht und Entfernung. Gerne erstellen wir Ihnen ein individuelles Angebot inklusive Lieferung direkt zu Ihrer Baustelle.'
        },
        {
            question: 'Wie lange ist die Lieferzeit?',
            answer: 'Lagerware ist sofort verfügbar und kann kurzfristig abgeholt oder versendet werden. Bei Sonderanfertigungen beträgt die Lieferzeit in der Regel zwischen 2 und 3 Wochen.'
        },
        {
            question: 'Sind die Fenster neu oder gebraucht?',
            answer: 'Wir verkaufen Ware, welche Beispielsweise falsch geliefert oder falsch bestellt wurde. Diese Ware ist Neuware und unbenutzt. Es gibt aber auch gebrauchte Produkte. Den Zustand der Ware können Sie den Bildern und der Produktbeschreibung entnehmen.'
        },
        {
            question: 'Bieten Sie auch die Montage der Bauelemente an?',
            answer: 'Als spezialisierter Outlet-Händler konzentrieren wir uns auf den Verkauf hochwertiger Bauelemente. Wir vermitteln Ihnen jedoch gerne erfahrene Partnerbetriebe aus Ihrer Region für die fachgerechte Montage.'
        }
    ];

    activeIndex: number | null = null;

    toggleFaq(index: number): void {
        this.activeIndex = this.activeIndex === index ? null : index;
    }
}
