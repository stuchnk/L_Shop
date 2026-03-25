"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basketService = void 0;
const fs_1 = __importDefault(require("fs"));
const index_1 = require("../../constants/index");
const readBaskets = () => {
    try {
        const raw = fs_1.default.readFileSync(index_1.BASKET_FILE, 'utf-8');
        return JSON.parse(raw || '[]');
    }
    catch (e) {
        console.error(e);
        return [];
    }
};
const writeBaskets = (baskets) => {
    fs_1.default.writeFileSync(index_1.BASKET_FILE, JSON.stringify(baskets, null, 2), 'utf-8');
};
const readProducts = () => {
    try {
        const raw = fs_1.default.readFileSync(index_1.PRODUCTS_FILE, 'utf-8');
        return JSON.parse(raw || '[]');
    }
    catch (e) {
        console.error(e);
        return [];
    }
};
exports.basketService = {
    getByUserId(userId) {
        const baskets = readBaskets();
        const products = readProducts();
        const userBasket = baskets.find(b => b.userId === userId);
        if (!userBasket) {
            return [];
        }
        return userBasket.items.map((item) => {
            const product = products.find(p => p.id === item.productId);
            return {
                ...item,
                image: item.image || product?.image || '',
            };
        });
    },
    addItem(userId, item) {
        const baskets = readBaskets();
        const products = readProducts();
        const product = products.find(p => p.id === item.productId);
        if (!product)
            throw new Error('Товар не найден');
        if (!product.available || product.quantity === 0) {
            throw new Error('Товара нет в наличии');
        }
        let userBasket = baskets.find(b => b.userId === userId);
        if (!userBasket) {
            userBasket = { userId, items: [] };
            baskets.push(userBasket);
        }
        const existingItem = userBasket.items.find(i => i.productId === item.productId);
        const currentQty = existingItem ? existingItem.quantity : 0;
        const newQty = currentQty + item.quantity;
        if (newQty > product.quantity) {
            throw new Error(`Доступно только ${product.quantity} шт.`);
        }
        if (existingItem) {
            existingItem.quantity = newQty;
            existingItem.image = item.image || existingItem.image;
        }
        else {
            userBasket.items.push(item);
        }
        writeBaskets(baskets);
        return userBasket.items;
    },
    updateQuantity(userId, productId, quantity) {
        const baskets = readBaskets();
        const products = readProducts();
        const product = products.find(p => p.id === productId);
        if (!product)
            throw new Error('Товар не найден');
        if (!product.available) {
            throw new Error('Товар недоступен');
        }
        const userBasket = baskets.find(b => b.userId === userId);
        if (!userBasket)
            throw new Error('Корзина не найдена');
        const item = userBasket.items.find(i => i.productId === productId);
        if (!item)
            throw new Error('Товар не найден в корзине');
        if (quantity > product.quantity) {
            throw new Error(`Максимум ${product.quantity} шт.`);
        }
        if (quantity <= 0) {
            userBasket.items = userBasket.items.filter(i => i.productId !== productId);
        }
        else {
            item.quantity = quantity;
        }
        writeBaskets(baskets);
        return userBasket.items;
    },
    removeItem(userId, productId) {
        const baskets = readBaskets();
        const userBasket = baskets.find(b => b.userId === userId);
        if (!userBasket)
            throw new Error('Корзина не найдена');
        userBasket.items = userBasket.items.filter(i => i.productId !== productId);
        writeBaskets(baskets);
        return userBasket.items;
    },
    clearBasket(userId) {
        const baskets = readBaskets();
        const userBasket = baskets.find(b => b.userId === userId);
        if (userBasket) {
            userBasket.items = [];
            writeBaskets(baskets);
        }
    },
};
