import path from 'path';

export const DATABASE_PATH: string = path.join(__dirname, '../../database');

export const PRODUCTS_FILE: string = path.join(DATABASE_PATH, 'products.json');
export const USERS_FILE: string = path.join(DATABASE_PATH, 'users.json');
export const BASKET_FILE: string = path.join(DATABASE_PATH, 'basket.json');

// ❗ исправил опечатку (было delvery)
export const DELIVERY_FILE: string = path.join(DATABASE_PATH, 'delivery.json');

// ✅ ДОБАВЬ ЭТО
export const ORDERS_FILE: string = path.join(DATABASE_PATH, 'orders.json');

export const COOKIE_NAME: string = 'session_token';
export const COOKIE_MAX_AGE: number = 10 * 60 * 1000;