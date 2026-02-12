import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { EmailService } from '../../services/email.service';
import { InquiryData } from '../../models/product.model';

@Component({
    selector: 'app-inquiry-form',
    templateUrl: './inquiry-form.component.html',
    styleUrls: ['./inquiry-form.component.scss']
})
export class InquiryFormComponent {
    @Input() product!: Product;
    @Output() close = new EventEmitter<void>();

    inquiryForm: FormGroup;
    isSubmitting = false;
    submitSuccess = false;
    submitError = false;

    constructor(
        private fb: FormBuilder,
        private emailService: EmailService
    ) {
        this.inquiryForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            deliveryOption: ['Selbstabholung', Validators.required],
            privacyAccepted: [false, Validators.requiredTrue]
        });
    }

    get f() {
        return this.inquiryForm.controls;
    }

    async onSubmit(): Promise<void> {
        if (this.inquiryForm.invalid) {
            Object.keys(this.inquiryForm.controls).forEach(key => {
                this.inquiryForm.controls[key].markAsTouched();
            });
            return;
        }

        this.isSubmitting = true;
        this.submitError = false;

        const inquiryData: InquiryData = {
            productId: this.product.id,
            productName: this.product.name,
            fullName: this.f['fullName'].value,
            email: this.f['email'].value,
            phone: this.f['phone'].value,
            deliveryOption: this.f['deliveryOption'].value,
            privacyAccepted: this.f['privacyAccepted'].value
        };

        try {
            const success = await this.emailService.sendInquiry(inquiryData);

            if (success) {
                this.submitSuccess = true;
                setTimeout(() => {
                    this.closeForm();
                }, 3000);
            } else {
                this.submitError = true;
            }
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            this.submitError = true;
        } finally {
            this.isSubmitting = false;
        }
    }

    closeForm(): void {
        this.close.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.closeForm();
        }
    }
}
