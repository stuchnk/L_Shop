"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryService = void 0;
const fs_1 = __importDefault(require("fs"));
const index_1 = require("../../constants/index");
const readDeliveries = () => {
    try {
        const raw = fs_1.default.readFileSync(index_1.DELIVERY_FILE, 'utf-8');
        return JSON.parse(raw || '[]');
    }
    catch {
        return [];
    }
};
const writeDeliveries = (deliveries) => {
    fs_1.default.writeFileSync(index_1.DELIVERY_FILE, JSON.stringify(deliveries, null, 2), 'utf-8');
};
exports.deliveryService = {
    getByUserId(userId) {
        const deliveries = readDeliveries();
        return deliveries.filter((d) => d.userId === userId);
    },
    create(order) {
        const deliveries = readDeliveries();
        const newOrder = {
            ...order,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        deliveries.push(newOrder);
        writeDeliveries(deliveries);
        return newOrder;
    },
    getById(orderId) {
        const deliveries = readDeliveries();
        return deliveries.find((d) => d.id === orderId);
    },
};
