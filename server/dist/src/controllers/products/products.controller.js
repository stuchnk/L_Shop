"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const products_service_1 = require("../../services/products/products.service");
exports.productController = {
    getAll(req, res) {
        const query = {
            search: req.query.search,
            sortBy: req.query.sortBy,
            category: req.query.category,
            available: req.query.available,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
        };
        const products = products_service_1.productService.getAll(query);
        res.json(products);
    },
    getById(req, res) {
        const id = parseInt(req.params.id, 10);
        const product = products_service_1.productService.getById(id);
        if (!product) {
            res.status(404).json({ error: 'Товар не найден' });
            return;
        }
        res.json(product);
    },
    getCategories(_req, res) {
        const categories = products_service_1.productService.getCategories();
        res.json(categories);
    },
};
