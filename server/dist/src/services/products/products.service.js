"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const fs_1 = __importDefault(require("fs"));
const index_1 = require("../../constants/index");
const readProducts = () => {
    const raw = fs_1.default.readFileSync(index_1.PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
};
exports.productService = {
    getAll(query) {
        let products = readProducts();
        // Поиск по имени/описанию
        if (query.search) {
            const s = query.search.toLowerCase();
            products = products.filter((p) => p.name.toLowerCase().includes(s) ||
                p.description.toLowerCase().includes(s));
        }
        // Фильтр по категории
        if (query.category) {
            products = products.filter((p) => p.category.toLowerCase() === query.category.toLowerCase());
        }
        // Фильтр по доступности
        if (query.available !== undefined) {
            const isAvailable = query.available === 'true';
            products = products.filter((p) => p.available === isAvailable);
        }
        // Фильтр по цене
        if (query.minPrice) {
            const min = parseFloat(query.minPrice);
            products = products.filter((p) => p.price >= min);
        }
        if (query.maxPrice) {
            const max = parseFloat(query.maxPrice);
            products = products.filter((p) => p.price <= max);
        }
        // Сортировка по цене
        if (query.sortBy === 'price_asc') {
            products.sort((a, b) => a.price - b.price);
        }
        else if (query.sortBy === 'price_desc') {
            products.sort((a, b) => b.price - a.price);
        }
        return products;
    },
    getById(id) {
        const products = readProducts();
        return products.find((p) => p.id === id);
    },
    getCategories() {
        const products = readProducts();
        const cats = new Set(products.map((p) => p.category));
        return Array.from(cats);
    },
};
