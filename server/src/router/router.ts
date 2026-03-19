import { Router, Request, Response } from 'express';
import { productController } from '../controllers/products/products.controller';
import {
  loginUserController,
  registerUserController,
} from '../controllers/users/users.controller';

export const apiRouter: Router = Router();

// Пинг
apiRouter.get('/ping', (_req: Request, res: Response) => {
  res.json({ message: 'API работает!', time: new Date() });
});

// Продукты
apiRouter.get('/products', productController.getAll);
apiRouter.get('/products/categories', productController.getCategories);
apiRouter.get('/products/:id', productController.getById);

// Пользователи
apiRouter.post('/users/register', registerUserController);
apiRouter.post('/users/login', loginUserController);