"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserService = exports.registerUserService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const usersFilePath = path_1.default.resolve(process.cwd(), 'database', 'users.json');
const readUsers = async () => {
    try {
        const data = await promises_1.default.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    }
    catch {
        return [];
    }
};
const writeUsers = async (users) => {
    await promises_1.default.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};
const normalizeValue = (value) => String(value ?? '').trim();
const normalizeEmail = (email) => normalizeValue(email).toLowerCase();
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const generateToken = (user) => {
    return Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
};
const registerUserService = async (name, email, password) => {
    const trimmedName = normalizeValue(name);
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = normalizeValue(password);
    if (!trimmedName || !normalizedEmail || !trimmedPassword) {
        throw new Error('Заполните все поля');
    }
    if (!isValidEmail(normalizedEmail)) {
        throw new Error('Некорректный email');
    }
    if (trimmedPassword.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
    }
    const users = await readUsers();
    const existingUser = users.find((user) => normalizeEmail(user.email) === normalizedEmail);
    if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
    }
    const newUser = {
        id: Date.now(),
        name: trimmedName,
        email: normalizedEmail,
        password: trimmedPassword,
    };
    users.push(newUser);
    await writeUsers(users);
    const token = generateToken(newUser);
    return {
        message: 'Регистрация успешна',
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
    };
};
exports.registerUserService = registerUserService;
const loginUserService = async (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = normalizeValue(password);
    if (!normalizedEmail || !trimmedPassword) {
        throw new Error('Введите email и пароль');
    }
    const users = await readUsers();
    const user = users.find((item) => normalizeEmail(item.email) === normalizedEmail);
    if (!user) {
        throw new Error('Пользователь с таким email не найден');
    }
    if (normalizeValue(user.password) !== trimmedPassword) {
        throw new Error('Неверный пароль');
    }
    const token = generateToken(user);
    return {
        message: 'Авторизация успешна',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};
exports.loginUserService = loginUserService;
