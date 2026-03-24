"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserController = exports.registerUserController = void 0;
const users_service_1 = require("../../services/users/users.service");
const index_1 = require("../../constants/index");
const setAuthCookie = (res, token) => {
    if (!token)
        return;
    res.cookie(index_1.COOKIE_NAME, token, {
        httpOnly: true, // НЕ видна через document.cookie
        maxAge: index_1.COOKIE_MAX_AGE, // 10 минут
        sameSite: 'lax',
        path: '/',
    });
};
const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await (0, users_service_1.registerUserService)(name, email, password);
        setAuthCookie(res, result.token);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Ошибка регистрации',
        });
    }
};
exports.registerUserController = registerUserController;
const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, users_service_1.loginUserService)(email, password);
        setAuthCookie(res, result.token);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({
            message: error instanceof Error ? error.message : 'Ошибка авторизации',
        });
    }
};
exports.loginUserController = loginUserController;
