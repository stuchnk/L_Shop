import { Router, Request, Response } from 'express';

// Создаем и ЭКСПОРТИРУЕМ роутер (это ключевое слово решает вашу ошибку)
export const apiRouter = Router();

// Тестовый маршрут
apiRouter.get('/ping', (req: Request, res: Response) => {
    res.json({ message: 'API через Router работает!', time: new Date() });
});

// ==========================================
// Сюда ваша команда будет добавлять свои роуты:
// ==========================================

// import { usersController } from '../controllers/users/users.controller';
// apiRouter.post('/users/register', usersController.register);

// import { basketController } from '../controllers/basket/basket.controller';
// apiRouter.get('/basket', basketController.getBasket);
