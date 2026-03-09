import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware (Парсеры и CORS)
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin: 'http://localhost:5173', // Порт вашего Vite фронтенда
    credentials: true // Разрешаем куки
}));

// Настройка "Базы данных" из JSON файлов
const dbPath = path.join(__dirname, 'data');
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath); // Создаем папку data, если ее нет

const getFilePath = (name: string) => path.join(dbPath, name);

// Функции для чтения и записи в JSON
const readDb = (file: string, isArray: boolean = true) => {
    try {
        if (!fs.existsSync(file)) return isArray ? [] : {};
        const data = fs.readFileSync(file, 'utf-8');
        return data ? JSON.parse(data) : (isArray ? [] : {});
    } catch (e) {
        console.error(`Ошибка чтения ${file}:`, e);
        return isArray ? [] : {}; // Если файл пуст, возвращаем пустой массив или объект
    }
};
const writeDb = (file: string, data: any) => {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// ================= РОУТЫ АВТОРИЗАЦИИ =================

// Регистрация
app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const usersFile = getFilePath('users.json');
    const users = readDb(usersFile, true) || []; // true = массив

    // Проверка, есть ли такой email
    if (users.find((u: any) => u.email === email)) {
        return res.status(400).json({ message: 'Email уже используется' });
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    writeDb(usersFile, users);
    
    // Ставим куку на 10 минут
    res.cookie('sessionId', newUser.id, { maxAge: 10 * 60 * 1000, httpOnly: true });
    res.status(201).json({ message: 'Успешная регистрация', user: { name: newUser.name } });
});

// Логин
app.post('/api/auth/login', (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    const users = readDb(getFilePath('users.json'), true) || []; // true = массив
    
    // Ищем пользователя по логину/email и паролю
    const user = users.find((u: any) => 
        (u.email === identifier || u.identifier === identifier) && u.password === password
    );

    if (user) {
        res.cookie('sessionId', user.id, { maxAge: 10 * 60 * 1000, httpOnly: true });
        res.status(200).json({ message: 'Успешный вход', user: { name: user.name } });
    } else {
        res.status(401).json({ message: 'Неверные данные для входа' });
    }
});

// ================= РОУТЫ ТОВАРОВ И КОРЗИНЫ =================

// Получить все товары
app.get('/api/products', (req: Request, res: Response) => {
    const products = readDb(getFilePath('products.json'), true); // true = массив
    res.status(200).json(products);
});

// Получить корзину текущего пользователя
app.get('/api/cart', (req: Request, res: Response) => {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return res.status(401).json({ message: 'Не авторизован' });
    
    const cartsFile = getFilePath('carts.json');
    const carts = readDb(cartsFile, false) || {}; // carts.json - это объект { "sessionId": [товары] }
    const userCart = carts[sessionId] || [];
    
    res.status(200).json(userCart);
});

// Добавить товар в корзину
app.post('/api/cart', (req: Request, res: Response) => {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return res.status(401).json({ message: 'Не авторизован. Войдите в аккаунт.' });

    const cartsFile = getFilePath('carts.json');
    const carts = readDb(cartsFile, false) || {}; // Получаем объект
    if (!carts[sessionId]) carts[sessionId] = [];
    
    carts[sessionId].push(req.body.product);
    writeDb(cartsFile, carts);
    
    res.status(200).json({ message: 'Товар добавлен', cart: carts[sessionId] });
});

// Удалить товар из корзины по индексу
app.delete('/api/cart/:index', (req: Request, res: Response) => {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return res.status(401).json({ message: 'Не авторизован' });

    const cartsFile = getFilePath('carts.json');
    const carts = readDb(cartsFile, false) || {};
    const index = parseInt(String(req.params.index));

    if (!carts[sessionId] || !carts[sessionId][index]) {
        return res.status(404).json({ message: 'Товар не найден в корзине' });
    }

    carts[sessionId].splice(index, 1);
    writeDb(cartsFile, carts);

    res.status(200).json({ message: 'Товар удален', cart: carts[sessionId] });
});

// Очистить корзину (после оформления заказа)
app.post('/api/cart/clear', (req: Request, res: Response) => {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return res.status(401).json({ message: 'Не авторизован' });

    const cartsFile = getFilePath('carts.json');
    const carts = readDb(cartsFile, false) || {}; // Получаем объект
    carts[sessionId] = []; 
    writeDb(cartsFile, carts);

    res.status(200).json({ message: 'Корзина успешно очищена' });
});

// Заглушка для Chrome
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => { res.status(204).end(); });

app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
