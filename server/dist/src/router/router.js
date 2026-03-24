"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const products_controller_1 = require("../controllers/products/products.controller");
const users_controller_1 = require("../controllers/users/users.controller");
const basket_controller_1 = require("../controllers/basket/basket.controller");
const delivery_controller_1 = require("../controllers/delivery/delivery.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.apiRouter = (0, express_1.Router)();
// Пинг
exports.apiRouter.get('/ping', (_req, res) => {
    res.json({ message: 'API работает!', time: new Date() });
});
// Продукты (доступны всем)
exports.apiRouter.get('/products', products_controller_1.productController.getAll);
exports.apiRouter.get('/products/categories', products_controller_1.productController.getCategories);
exports.apiRouter.get('/products/:id', products_controller_1.productController.getById);
// Пользователи
exports.apiRouter.post('/users/register', users_controller_1.registerUserController);
exports.apiRouter.post('/users/login', users_controller_1.loginUserController);
// Корзина (только авторизованные)
exports.apiRouter.get('/basket', auth_middleware_1.authMiddleware, basket_controller_1.basketController.getBasket);
exports.apiRouter.post('/basket', auth_middleware_1.authMiddleware, basket_controller_1.basketController.addItem);
exports.apiRouter.patch('/basket/:productId', auth_middleware_1.authMiddleware, basket_controller_1.basketController.updateQuantity);
exports.apiRouter.delete('/basket/:productId', auth_middleware_1.authMiddleware, basket_controller_1.basketController.removeItem);
// Доставка (только авторизованные)
exports.apiRouter.get('/delivery', auth_middleware_1.authMiddleware, delivery_controller_1.deliveryController.getDeliveries);
exports.apiRouter.post('/delivery', auth_middleware_1.authMiddleware, delivery_controller_1.deliveryController.createDelivery);
