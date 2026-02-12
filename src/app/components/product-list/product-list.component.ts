import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductCategory } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    products$!: Observable<Product[]>;
    selectedFilter: ProductCategory | 'ALLE' = 'ALLE';
    selectedProduct: Product | null = null;
    showModal = false;

    filters: Array<{ label: string; value: ProductCategory | 'ALLE' }> = [
        { label: 'Alle', value: 'ALLE' },
        { label: 'Fenster', value: 'Fenster' },
        { label: 'Balkontüren', value: 'Balkontür' },
        { label: 'Haustüren', value: 'Haustür' }
    ];

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.products$ = this.productService.filteredProducts$;
    }

    filterProducts(category: ProductCategory | 'ALLE'): void {
        this.selectedFilter = category;
        this.productService.filterByCategory(category);
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
