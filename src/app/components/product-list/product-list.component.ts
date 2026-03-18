import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product, ProductCategory } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

type MaterialFilter = 'ALLE' | 'Kunststoff' | 'Holz' | 'Aluminium' | 'Holz-Aluminium' | 'Sonstige';
type SortOption = 'pos' | 'price_asc' | 'price_desc' | 'name';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
    @Input() mode: 'teaser' | 'full' = 'full';

    selectedCategory: ProductCategory | 'ALLE' = 'ALLE';
    selectedMaterial: MaterialFilter = 'ALLE';
    selectedSort: SortOption = 'pos';
    selectedProduct: Product | null = null;
    showModal = false;

    minBreite: number | null = null;
    maxBreite: number | null = null;
    minHoehe: number | null = null;
    maxHoehe: number | null = null;

    private pageSize = 12;
    currentPage = 1;
    totalPages = 0;
    visiblePages: (number | '…')[] = [];

    private _filteredCache: Product[] = [];

    displayedProducts: Product[] = [];
    isLoading = true;
    hasError = false;

    private _loadingSub?: Subscription;
    private _errorSub?: Subscription;

    categoryFilters: Array<{ label: string; value: ProductCategory | 'ALLE' }> = [
        { label: 'Alle', value: 'ALLE' },
        { label: 'Fenster', value: 'Fenster' },
        { label: 'Balkontüren', value: 'Balkontür' },
        { label: 'Haustüren', value: 'Haustür' }
    ];

    materialFilters: Array<{ label: string; value: MaterialFilter }> = [
        { label: 'Alle', value: 'ALLE' },
        { label: 'Kunststoff', value: 'Kunststoff' },
        { label: 'Holz', value: 'Holz' },
        { label: 'Aluminium', value: 'Aluminium' },
        { label: 'Holz-Aluminium', value: 'Holz-Aluminium' },
        { label: 'Sonstige', value: 'Sonstige' }
    ];

    sortOptions: Array<{ label: string; value: SortOption }> = [
        { label: 'Position', value: 'pos' },
        { label: 'Preis ↑', value: 'price_asc' },
        { label: 'Preis ↓', value: 'price_desc' },
        { label: 'Name', value: 'name' }
    ];

    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this._errorSub = this.productService.loadError$.subscribe(err => {
            this.hasError = err;
        });
        this._loadingSub = this.productService.isLoading$.subscribe(loading => {
            this.isLoading = loading;
            if (!loading) this.applyFilters();
        });
    }

    ngOnDestroy(): void {
        this._loadingSub?.unsubscribe();
        this._errorSub?.unsubscribe();
    }

    private normalizeMaterial(material: string | undefined): MaterialFilter {
        if (!material) return 'Sonstige';
        const m = material.toLowerCase();
        if (m.includes('holz-alu') || m.includes('holz-aluminium')) return 'Holz-Aluminium';
        if (m.includes('kunststoff') || m.includes('pvc') || m.includes('pcv')) return 'Kunststoff';
        if (m.includes('aluminium') || m.includes('alu')) return 'Aluminium';
        if (m.includes('holz') || m.includes('eiche') || m.includes('nussbaum') || m.includes('kiefer')) return 'Holz';
        return 'Sonstige';
    }

    private applyFilters(): void {
        this.currentPage = 1;
        let filtered = this.productService.getAllProducts();

        if (this.selectedCategory !== 'ALLE') {
            filtered = filtered.filter(p => p.category === this.selectedCategory);
        }

        if (this.selectedMaterial !== 'ALLE') {
            filtered = filtered.filter(p =>
                this.normalizeMaterial(p.specifications['Material']) === this.selectedMaterial
            );
        }

        const parseMm = (val: string | undefined): number | null => {
            if (!val) return null;
            const n = parseInt(val, 10);
            return isNaN(n) ? null : n;
        };

        if (this.minBreite !== null) {
            filtered = filtered.filter(p => {
                const b = parseMm(p.specifications['Breite']);
                return b !== null && b >= this.minBreite!;
            });
        }
        if (this.maxBreite !== null) {
            filtered = filtered.filter(p => {
                const b = parseMm(p.specifications['Breite']);
                return b !== null && b <= this.maxBreite!;
            });
        }
        if (this.minHoehe !== null) {
            filtered = filtered.filter(p => {
                const h = parseMm(p.specifications['Höhe']);
                return h !== null && h >= this.minHoehe!;
            });
        }
        if (this.maxHoehe !== null) {
            filtered = filtered.filter(p => {
                const h = parseMm(p.specifications['Höhe']);
                return h !== null && h <= this.maxHoehe!;
            });
        }

        switch (this.selectedSort) {
            case 'price_asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                filtered.sort((a, b) => a.pos - b.pos);
        }

        this._filteredCache = filtered;

        if (this.mode === 'teaser') {
            this.displayedProducts = filtered.slice(0, 6);
        } else {
            this.totalPages = Math.ceil(filtered.length / this.pageSize);
            this.displayedProducts = filtered.slice(0, this.pageSize);
            this.buildVisiblePages();
        }
    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        const start = (page - 1) * this.pageSize;
        this.displayedProducts = this._filteredCache.slice(start, start + this.pageSize);
        this.buildVisiblePages();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private buildVisiblePages(): void {
        const total = this.totalPages;
        const cur = this.currentPage;
        const pages: (number | '…')[] = [];
        const add = (n: number) => { if (!pages.includes(n)) pages.push(n); };

        // Immer erste 2 und letzte 2
        for (let i = 1; i <= Math.min(2, total); i++) add(i);
        for (let i = Math.max(total - 1, 1); i <= total; i++) add(i);
        // Aktuelle ±2
        for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) add(i);

        const sorted = (pages.filter(p => typeof p === 'number') as number[]).sort((a, b) => a - b);

        this.visiblePages = [];
        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) this.visiblePages.push('…');
            this.visiblePages.push(sorted[i]);
        }
    }

    filterByCategory(category: ProductCategory | 'ALLE'): void {
        this.selectedCategory = category;
        this.applyFilters();
    }

    filterByMaterial(material: MaterialFilter): void {
        this.selectedMaterial = material;
        this.applyFilters();
    }

    sortBy(sort: SortOption): void {
        this.selectedSort = sort;
        this.applyFilters();
    }

    onDimensionInput(): void {
        this.applyFilters();
    }

    resetFilters(): void {
        this.selectedCategory = 'ALLE';
        this.selectedMaterial = 'ALLE';
        this.selectedSort = 'pos';
        this.minBreite = null;
        this.maxBreite = null;
        this.minHoehe = null;
        this.maxHoehe = null;
        this.applyFilters();
    }

    get hasActiveFilters(): boolean {
        return this.selectedCategory !== 'ALLE'
            || this.selectedMaterial !== 'ALLE'
            || this.minBreite !== null || this.maxBreite !== null
            || this.minHoehe !== null || this.maxHoehe !== null;
    }

    openProductDetail(product: Product): void {
        this.selectedProduct = product;
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.selectedProduct = null;
    }
}
