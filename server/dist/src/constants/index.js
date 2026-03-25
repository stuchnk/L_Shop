"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_MAX_AGE = exports.COOKIE_NAME = exports.ORDERS_FILE = exports.DELIVERY_FILE = exports.BASKET_FILE = exports.USERS_FILE = exports.PRODUCTS_FILE = exports.DATABASE_PATH = void 0;
const path_1 = __importDefault(require("path"));
exports.DATABASE_PATH = path_1.default.join(__dirname, '../../database');
exports.PRODUCTS_FILE = path_1.default.join(exports.DATABASE_PATH, 'products.json');
exports.USERS_FILE = path_1.default.join(exports.DATABASE_PATH, 'users.json');
exports.BASKET_FILE = path_1.default.join(exports.DATABASE_PATH, 'basket.json');
// ❗ исправил опечатку (было delvery)
exports.DELIVERY_FILE = path_1.default.join(exports.DATABASE_PATH, 'delivery.json');
// ✅ ДОБАВЬ ЭТО
exports.ORDERS_FILE = path_1.default.join(exports.DATABASE_PATH, 'orders.json');
exports.COOKIE_NAME = 'session_token';
exports.COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
