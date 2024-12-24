import { Item, BuyProduct, Product, SaleProduct } from "./types";

export function getProductSalePrice(product: Product): number {
    if (product.sale_price && +product.sale_price > 0) return +product.sale_price;
    return parseFloat((+product.buy_price + ((+product.buy_price / 100) * +product.earn)).toFixed(2));
}

export function getItemSalePrice(item: Item): number {
    const { product_sale_price, product_buy_price, product_earn } = item;
    if (product_sale_price && +product_sale_price > 0) return +product_sale_price;
    return parseFloat((+product_buy_price + ((+product_buy_price / 100) * +product_earn)).toFixed(2));
}

export function getSaleTotal(items: Item[]): number {
    return parseFloat(items.reduce((acc, i) => acc + getItemSalePrice(i) * i.amount, 0).toFixed(2));
}

export function getPurchaseTotal(items: Item[]): number {
    return parseFloat(items.reduce((acc, i) => acc + i.product_buy_price * i.amount, 0).toFixed(2));
}

export function getSaleProductsTotal(saleProducts: SaleProduct[]): number {
    return parseFloat(saleProducts.reduce((acc, sp) => {
        let price: number;
        const { product_sale_price, product_buy_price, product_earn } = sp;
        if (product_sale_price && +product_sale_price > 0) {
            price = +product_sale_price;
        } else {
            price = parseFloat((+product_buy_price + ((+product_buy_price / 100) * +product_earn)).toFixed(2));
        }
        return acc + (price * sp.amount)
    }, 0).toFixed(2));
}

export function getBuyProductsTotal(buyProducts: BuyProduct[]): number {
    return parseFloat(buyProducts.reduce((acc, bp) => acc + (bp.product_buy_price * bp.amount), 0).toFixed(2));
}