import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductCategory } from '../models/product.model';
import productsData from '../../assets/data/products.json';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private products: Product[] = productsData as Product[];
    private filteredProductsSubject = new BehaviorSubject<Product[]>(this.getSortedProducts());

    filteredProducts$: Observable<Product[]> = this.filteredProductsSubject.asObservable();

    constructor() { }

    private getSortedProducts(category?: ProductCategory): Product[] {
        let filtered = this.products.filter(p => p.available);

        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }

        return filtered.sort((a, b) => a.pos - b.pos);
    }

    getAllProducts(): Product[] {
        return this.getSortedProducts();
    }

    filterByCategory(category: ProductCategory | 'ALLE'): void {
        if (category === 'ALLE') {
            this.filteredProductsSubject.next(this.getSortedProducts());
        } else {
            this.filteredProductsSubject.next(this.getSortedProducts(category));
        }
    }

    getProductById(id: string): Product | undefined {
        return this.products.find(p => p.id === id);
    }
}
