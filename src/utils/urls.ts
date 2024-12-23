const BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api`;

export const USER_URL = `${BASE_URL}/users`;
export const CATEGORY_URL = `${BASE_URL}/categories`;
export const SUPPLIER_URL = `${BASE_URL}/suppliers`;
export const CLIENT_URL = `${BASE_URL}/clients`;
export const PRODUCT_URL = `${BASE_URL}/products`;
export const SALE_ORDER_URL = `${BASE_URL}/sale-orders`;
export const BUY_ORDER_URL = `${BASE_URL}/buy-orders`;
export const STORE_URL = `${BASE_URL}/stores`;
export const SALE_PAYMENT_URL = `${BASE_URL}/sale-payments`;
export const BUY_PAYMENT_URL = `${BASE_URL}/buy-payments`;
export const SALE_PRODUCT_URL = `${BASE_URL}/sale-products`;
export const BUY_PRODUCT_URL = `${BASE_URL}/buy-products`;
export const MOVEMENT_URL = `${BASE_URL}/movements`;
export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const LOGOUT_URL = `${BASE_URL}/auth/logout`;
export const REFRESH_URL = BASE_URL + '/auth/refresh'