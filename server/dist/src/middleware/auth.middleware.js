"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const index_1 = require("../constants/index");
const authMiddleware = (req, res, next) => {
    const token = req.cookies?.[index_1.COOKIE_NAME];
    if (!token) {
        res.status(401).json({ message: 'Необходима авторизация' });
        return;
    }
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const parts = decoded.split(':');
        if (parts.length < 3) {
            res.status(401).json({ message: 'Невалидный токен' });
            return;
        }
        const userId = parseInt(parts[0], 10);
        const userEmail = parts[1];
        const timestamp = parseInt(parts[2], 10);
        // Проверка истечения токена (10 минут)
        const TEN_MINUTES = 10 * 60 * 1000;
        if (Date.now() - timestamp > TEN_MINUTES) {
            res.clearCookie(index_1.COOKIE_NAME);
            res.status(401).json({ message: 'Сессия истекла' });
            return;
        }
        req.userId = userId;
        req.userEmail = userEmail;
        next();
    }
    catch {
        res.status(401).json({ message: 'Ошибка авторизации' });
    }
};
exports.authMiddleware = authMiddleware;
