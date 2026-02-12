export type ProductCategory = 'Fenster' | 'Balkontür' | 'Haustür';

export interface Product {
    id: string;
    name: string;
    category: ProductCategory;
    price: number;
    images: string[];
    condition: string;
    description: string;
    specifications: {
        [key: string]: string | undefined;
    };
    pos: number;
    available: boolean;
}

export interface InquiryData {
    productId: string;
    productName: string;
    fullName: string;
    email: string;
    phone?: string;
    deliveryOption: 'Lieferung' | 'Selbstabholung';
    privacyAccepted: boolean;
}
