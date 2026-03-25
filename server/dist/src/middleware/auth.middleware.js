"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const index_1 = require("../constants/index");
const createToken = (userId, userEmail) => {
    return Buffer.from(`${userId}:${userEmail}:${Date.now()}`).toString('base64');
};
const refreshAuthCookie = (res, userId, userEmail) => {
    res.cookie(index_1.COOKIE_NAME, createToken(userId, userEmail), {
        httpOnly: true,
        maxAge: index_1.COOKIE_MAX_AGE,
        sameSite: 'lax',
        path: '/',
    });
};
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
        if (!userId || !userEmail || !timestamp) {
            res.status(401).json({ message: 'Невалидный токен' });
            return;
        }
        if (Date.now() - timestamp > index_1.COOKIE_MAX_AGE) {
            res.clearCookie(index_1.COOKIE_NAME, { path: '/' });
            res.status(401).json({ message: 'Сессия истекла' });
            return;
        }
        req.userId = userId;
        req.userEmail = userEmail;
        // Продлеваем сессию при активности пользователя.
        refreshAuthCookie(res, userId, userEmail);
        next();
    }
    catch {
        res.status(401).json({ message: 'Ошибка авторизации' });
    }
};
exports.authMiddleware = authMiddleware;
