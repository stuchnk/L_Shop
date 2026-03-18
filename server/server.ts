import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiRouter } from './src/router/router'; // Подключаем роутер команды

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Подключаем все маршруты из папки src/router
app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`====================================`);
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api/ping`);
    console.log(`====================================`);
});
