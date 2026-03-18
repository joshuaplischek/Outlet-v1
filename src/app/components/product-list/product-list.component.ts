import { Component, Input, OnInit } from '@angular/core';
import { Product, ProductCategory } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

type MaterialFilter = 'ALLE' | 'Kunststoff' | 'Holz' | 'Aluminium' | 'Holz-Aluminium' | 'Sonstige';
type SortOption = 'pos' | 'price_asc' | 'price_desc' | 'name';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    @Input() mode: 'teaser' | 'full' = 'full';

    selectedCategory: ProductCategory | 'ALLE' = 'ALLE';
    selectedMaterial: MaterialFilter = 'ALLE';
    selectedSort: SortOption = 'pos';
    selectedProduct: Product | null = null;
    showModal = false;

    private pageSize = 12;
    private currentPage = 1;
    private _filteredCache: Product[] = [];

    displayedProducts: Product[] = [];
    hasMore = false;

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
        this.applyFilters();
    }

    private normalizeMaterial(material: string | undefined): MaterialFilter {
        if (!material) return 'Sonstige';
        const m = material.toLowerCase();
        if (m.includes('holz-alu') || m.includes('holz-aluminium')) return 'Holz-Aluminium';
        if (m.includes('kunststoff') || m.includes('pvc')) return 'Kunststoff';
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
            this.hasMore = false;
        } else {
            this.displayedProducts = filtered.slice(0, this.pageSize);
            this.hasMore = filtered.length > this.pageSize;
        }
    }

    loadMore(): void {
        this.currentPage++;
        this.displayedProducts = this._filteredCache.slice(0, this.currentPage * this.pageSize);
        this.hasMore = this.displayedProducts.length < this._filteredCache.length;
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

    resetFilters(): void {
        this.selectedCategory = 'ALLE';
        this.selectedMaterial = 'ALLE';
        this.selectedSort = 'pos';
        this.applyFilters();
    }

    get hasActiveFilters(): boolean {
        return this.selectedCategory !== 'ALLE' || this.selectedMaterial !== 'ALLE';
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
