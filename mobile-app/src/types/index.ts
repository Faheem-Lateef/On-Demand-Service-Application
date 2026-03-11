export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    rating?: number;
    image?: string;
    categoryId?: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    services: Service[];
    icon?: string;
}

export interface Provider extends User {
    avatarUrl?: string;
    rating?: number;
    jobsDone?: number;
    providerBookings?: Array<{
        service: Service & { category: Category }
    }>;
}

export interface Booking {
    id: string;
    scheduledAt: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    totalAmount: number;
    address: string;
    notes?: string;
    customerId: string;
    providerId?: string | null;
    serviceId: string;
    customer?: User;
    provider?: Provider;
    service?: Service & { category: Category };
    createdAt?: string;
}
