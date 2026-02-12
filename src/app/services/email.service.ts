import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InquiryData } from '../models/product.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    private readonly API_URL = 'assets/php/contact.php';

    constructor(private http: HttpClient) { }

    async sendInquiry(inquiryData: InquiryData): Promise<boolean> {
        try {
            const payload = {
                product_id: inquiryData.productId,
                product_name: inquiryData.productName,
                customer_name: inquiryData.fullName,
                customer_email: inquiryData.email,
                customer_phone: inquiryData.phone || 'Nicht angegeben',
                delivery_option: inquiryData.deliveryOption
            };

            await lastValueFrom(this.http.post(this.API_URL, payload));
            console.log('Email sent successfully via PHP backend');
            return true;
        } catch (error) {
            console.error('Failed to send email via PHP backend:', error);
            return false;
        }
    }
}
