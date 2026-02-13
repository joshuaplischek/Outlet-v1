import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-product-detail-modal',
    templateUrl: './product-detail-modal.component.html',
    styleUrls: ['./product-detail-modal.component.scss']
})
export class ProductDetailModalComponent {
    @Input() product!: Product;
    @Output() close = new EventEmitter<void>();

    currentImageIndex = 0;
    showInquiryForm = false;

    get currentImage(): string {
        return this.product.images[this.currentImageIndex] || 'assets/images/placeholder.jpg';
    }

    get specificationEntries(): Array<{ key: string; value: string }> {
        return Object.entries(this.product.specifications)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => ({
                key,
                value: value as string
            }));
    }

    closeModal(): void {
        this.close.emit();
    }

    nextImage(): void {
        if (this.currentImageIndex < this.product.images.length - 1) {
            this.currentImageIndex++;
        }
    }

    previousImage(): void {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
        }
    }

    openInquiryForm(): void {
        console.log('Opening inquiry form for product:', this.product.name);
        this.showInquiryForm = true;
    }

    closeInquiryForm(): void {
        this.showInquiryForm = false;
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.closeModal();
        }
    }
}
