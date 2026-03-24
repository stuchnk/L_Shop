"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basketController = void 0;
const basket_service_1 = require("../../services/basket/basket.service");
exports.basketController = {
    getBasket(req, res) {
        const userId = req.userId;
        const items = basket_service_1.basketService.getByUserId(userId);
        res.json(items);
    },
    addItem(req, res) {
        const userId = req.userId;
        const { productId, name, price, quantity, image } = req.body;
        if (!productId || !name || !price || !quantity) {
            res.status(400).json({ message: 'Заполните все поля товара' });
            return;
        }
        const items = basket_service_1.basketService.addItem(userId, {
            productId,
            name,
            price,
            quantity,
            image,
        });
        res.json(items);
    },
    updateQuantity(req, res) {
        const userId = req.userId;
        const productId = parseInt(req.params.productId, 10);
        const { quantity } = req.body;
        try {
            const items = basket_service_1.basketService.updateQuantity(userId, productId, quantity);
            res.json(items);
        }
        catch (error) {
            res.status(404).json({
                message: error instanceof Error ? error.message : 'Ошибка',
            });
        }
    },
    removeItem(req, res) {
        const userId = req.userId;
        const productId = parseInt(req.params.productId, 10);
        try {
            const items = basket_service_1.basketService.removeItem(userId, productId);
            res.json(items);
        }
        catch (error) {
            res.status(404).json({
                message: error instanceof Error ? error.message : 'Ошибка',
            });
        }
    },
};
