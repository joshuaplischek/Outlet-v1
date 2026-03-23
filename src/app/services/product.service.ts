import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Product, ProductCategory } from '../models/product.model';
import { environment } from '../../environments/environment';
import productsData from '../../assets/data/products.json';

interface ApiResponse {
    generatedAt: string;
    count: number;
    items: ApiProduct[];
}

interface ApiProduct {
    page: number;
    produktname: string;
    produkttyp: string;
    oeffnungsfaehigkeit: string;
    aussenfarbe: string;
    innenfarbe: string;
    breite_mm: string;
    hoehe_mm: string;
    material: string;
    addons: string;
    nettopreis: string;
    waehrung: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private products: Product[] = [];

    isLoading$ = new BehaviorSubject<boolean>(true);
    loadError$ = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        this.http.get<ApiResponse>(environment.apiUrl).subscribe({
            next: (data) => {
                try {
                    const items = data?.items ?? [];
                    this.products = this.mapApiProducts(items);
                } catch {
                    this.products = productsData as Product[];
                    this.loadError$.next(true);
                }
                this.isLoading$.next(false);
            },
            error: () => {
                this.products = productsData as Product[];
                this.loadError$.next(true);
                this.isLoading$.next(false);
            }
        });
    }

    private mapCategory(typ: string): ProductCategory {
        if (typ === 'Fenster') return 'Fenster';
        if (typ === 'Balkon') return 'Balkontür';
        if (typ === 'Haustür' || typ === 'Tür') return 'Haustür';
        return 'Fenster';
    }

    private mapApiProducts(data: ApiProduct[]): Product[] {
        return data.map((item, index) => {
            const specs: { [key: string]: string } = {
                Material: item.material,
                Außenfarbe: item.aussenfarbe,
                Innenfarbe: item.innenfarbe,
                Öffnung: item.oeffnungsfaehigkeit
            };
            if (item.breite_mm) specs['Breite'] = `${item.breite_mm} mm`;
            if (item.hoehe_mm) specs['Höhe'] = `${item.hoehe_mm} mm`;
            if (item.addons && item.addons !== '---') specs['Extras'] = item.addons;

            return {
                id: `${item.page}-${index}`,
                name: item.produktname,
                category: this.mapCategory(item.produkttyp),
                price: Math.round((parseFloat(item.nettopreis) || 0) * 1.3 * 1.19 * 100) / 100,
                images: ['/assets/img/products/balkon/balkon 01/1.png'],
                condition: `Outlet – ${item.material}`,
                description: `${item.produktname} – ${item.produkttyp}, ${item.material}`,
                specifications: specs,
                pos: item.page,
                available: true
            };
        });
    }

    getAllProducts(): Product[] {
        return this.products.filter(p => p.available).sort((a, b) => a.pos - b.pos);
    }

    getProductById(id: string): Product | undefined {
        return this.products.find(p => p.id === id);
    }
}
