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

    private mapColorToFilename(aussenfarbe: string, innenfarbe: string, material: string): string {
        // For wood, the interior color describes the wood finish
        const isWood = material.toLowerCase().includes('holz');
        const c = (isWood ? (innenfarbe || aussenfarbe) : (aussenfarbe || '')).toLowerCase();

        if (c.includes('anthrazitgrau glatt') || c.includes('anthrazit glatt') || c.includes('quarzgrau glatt') || c.includes('703905-097')) return 'Anthrazit Glatt';
        if (c.includes('ulti') && (c.includes('anthrazit') || c.includes('7016') || c.includes('grau'))) return 'Anthrazit Ulti Mat';
        if (c.includes('anthrazit') || c.includes('7016') || c.includes('quarzgrau') || c.includes('basaltgrau') || c.includes('db 703') || c.includes('eisenglimmer') || c.includes('schiefergrau')) return 'Anthrazit';
        if (c.includes('jet black') || (c.includes('ulti') && (c.includes('schwarz') || c.includes('9005') || c.includes('czarny')))) return 'Schwarz Ulti Mat';
        if (c.includes('schwarz') || c.includes('9005') || c.includes('czarny')) return 'Anthrazit';
        if (c.includes('weiss fx') || c.includes('weiß fx') || c.includes('white sand') || c.includes('915205')) return 'Weiß FX';
        if (c.includes('cremeweiss') || c.includes('9016')) return 'Weiß';
        if (c.includes('weiß') || c.includes('biały') || c.includes('bialy')) return 'Weiß';
        if (c.includes('crown') || c.includes('platin') || c.includes('platinum')) return 'Crown Platinum';
        if (c.includes('winchester')) return 'Winchester';
        if (c.includes('golden oak') || c.includes('złoty') || c.includes('zloty') || c.includes('2178001')) return 'Goldene Eiche';
        if (c.includes('sheffield') || c.includes('dąb bielony') || c.includes('dab bielony') || c.includes('gebleicht')) return 'Gebleichte Eiche';
        if (c.includes('eiche dunkel') || c.includes('dąb ciemny') || c.includes('ciemny dąb') || c.includes('2052089')) return 'Dunkle Eiche';
        if (c.includes('turner oak') || c.includes('dąb jasny') || c.includes('jasny dąb') || c.includes('006 dąb') || c.includes('006 dab') || c.includes('dab jasny')) return 'Helle Eiche';
        if (c.includes('nussbaum') || c.includes('orzech') || c.includes('2178007')) return 'Walnuss';
        if (c.includes('teak') || c.includes('085 teak')) return 'Teak';
        if (c.includes('macore') || c.includes('mahon') || c.includes('mahoń') || c.includes('3162002')) return 'Mahagoni';
        if (c.includes('hellgrau') || c.includes('7035') || c.includes('grau 715')) return 'Hellgrau';
        if (c.includes('oregon') || c.includes('2115008')) return 'Walnuss';
        return 'Weiß';
    }

    private getProductImage(item: ApiProduct): string {
        const BASE = '/assets/img/products/ex';
        const typ = (item.produkttyp || '').toLowerCase();
        const mat = (item.material || '').toLowerCase();

        const isWood = mat.includes('holz');
        const isAlu = mat.includes('aluminium');

        // Determine product folder
        const isFenster = typ === 'fenster' || typ === 'renovierung, fenster' || typ === 'schiebbar';
        const folder = isFenster ? 'fenster' : 'tür';

        // Material subfolder (duo = Holz+Alu combo, only in fenster)
        let matFolder: string;
        if (isAlu && isWood) {
            matFolder = isFenster ? 'duo' : 'alu';
        } else if (isAlu) {
            matFolder = 'alu';
        } else if (isWood) {
            matFolder = 'wood';
        } else {
            matFolder = 'pvc';
        }

        const color = this.mapColorToFilename(item.aussenfarbe, item.innenfarbe, item.material);

        if (matFolder === 'alu') {
            const aluFile = isFenster ? 'MB79N' : 'MB86N';
            return `${BASE}/${folder}/alu/2-glass/${aluFile}.png`;
        }

        if (matFolder === 'duo') {
            return `${BASE}/fenster/duo/2-glass/Duoline 88 - Meranti - ${color}.png`;
        }

        if (matFolder === 'wood') {
            if (!isFenster) {
                return `${BASE}/tür/wood/${color}-Meranti.png`;
            }
            return `${BASE}/fenster/wood/2-glass/${color}-Meranti.png`;
        }

        // pvc
        return `${BASE}/${folder}/pvc/2-glass/${color}.png`;
    }

    private mapCategory(typ: string): ProductCategory {
        const t = typ.toLowerCase();
        if (t.includes('balkon')) return 'Balkontür';
        if (t === 'tür' || t === 'renovierung, tür') return 'Haustür';
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
                images: [this.getProductImage(item)],
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
