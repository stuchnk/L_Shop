import { Router, Request, Response } from 'express';
import { productController } from '../controllers/products/products.controller';
import {
  loginUserController,
  registerUserController,
} from '../controllers/users/users.controller';
import { basketController } from '../controllers/basket/basket.controller';
import { deliveryController } from '../controllers/delivery/delivery.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const apiRouter: Router = Router();

// Пинг
apiRouter.get('/ping', (_req: Request, res: Response) => {
  res.json({ message: 'API работает!', time: new Date() });
});

// Продукты (доступны всем)
apiRouter.get('/products', productController.getAll);
apiRouter.get('/products/categories', productController.getCategories);
apiRouter.get('/products/:id', productController.getById);

// Пользователи
apiRouter.post('/users/register', registerUserController);
apiRouter.post('/users/login', loginUserController);

// Корзина (только авторизованные)
apiRouter.get('/basket', authMiddleware, basketController.getBasket);
apiRouter.post('/basket', authMiddleware, basketController.addItem);
apiRouter.patch('/basket/:productId', authMiddleware, basketController.updateQuantity);
apiRouter.delete('/basket/:productId', authMiddleware, basketController.removeItem);

// Доставка (только авторизованные)
apiRouter.get('/delivery', authMiddleware, deliveryController.getDeliveries);
apiRouter.post('/delivery', authMiddleware, deliveryController.createDelivery);