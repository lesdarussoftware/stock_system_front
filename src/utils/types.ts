export type ShowFormType = 'NEW' | 'VIEW' | 'EDIT' | 'DELETE' | 'ADJUST' | null;

export type Item = {
    product_id: number;
    product_sale_price: number | undefined;
    product_buy_price: number;
    product_earn: number;
    amount: number;
}

export interface User {
    id: number;
    username: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Supplier {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Store {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    bar_code?: string;
    description?: string;
    buy_price: number;
    earn: number;
    sale_price?: number;
    min_stock?: number;
    is_active: boolean;
    category_id: number;
    supplier_id: number;
    store_id?: number;
    created_at: Date;
    updated_at: Date;
}

export interface Movement {
    id: number;
    product_id: number;
    amount: number;
    date: Date;
    type: 'INGRESO' | 'EGRESO';
    observations?: string;
    user: string;
    created_at: Date;
    updated_at: Date;
}

export interface Client {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    created_at: Date;
    updated_at: Date;
}

export interface BuyOrder {
    id: number;
    date: Date;
    status: 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA';
    user: number;
    payments_amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface BuyProduct {
    id: number;
    buy_order_id: number;
    product_id: number;
    amount: number;
    product_buy_price: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface SaleOrder {
    id: number;
    client_id: number;
    date: Date;
    status: 'PENDIENTE' | 'FINALIZADA' | 'CANCELADA';
    user: number;
    payments_amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface SaleProduct {
    id: number;
    sale_order_id: number;
    product_id: number;
    amount: number;
    product_buy_price: number;
    product_earn: number;
    product_sale_price?: number;
    created_at?: Date;
    updated_at?: Date;
}

export type PaymentMethod = 'EFECTIVO' | 'CREDITO' | 'DEBITO' | 'TRANSFERENCIA';

export interface SalePayment {
    id: number;
    sale_order_id: number;
    method: PaymentMethod;
    amount: number;
    date: Date;
    observations?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface BuyPayment {
    id: number;
    buy_order_id: number;
    method: PaymentMethod;
    amount: number;
    date: Date;
    observations?: string;
    created_at?: Date;
    updated_at?: Date;
}
