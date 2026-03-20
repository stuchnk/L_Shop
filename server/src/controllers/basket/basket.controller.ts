import { Response } from 'express';
import { basketService } from '../../services/basket/basket.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { BasketItem } from '../../types/basket';

export const basketController = {
  getBasket(req: AuthRequest, res: Response): void {
    const userId: number = req.userId!;
    const items: BasketItem[] = basketService.getByUserId(userId);
    res.json(items);
  },

  addItem(req: AuthRequest, res: Response): void {
    const userId: number = req.userId!;
    const { productId, name, price, quantity, image } = req.body as BasketItem;

    if (!productId || !name || !price || !quantity) {
      res.status(400).json({ message: 'Заполните все поля товара' });
      return;
    }

    const items: BasketItem[] = basketService.addItem(userId, {
      productId,
      name,
      price,
      quantity,
      image,
    });
    res.json(items);
  },

  updateQuantity(req: AuthRequest, res: Response): void {
    const userId: number = req.userId!;
    const productId: number = parseInt(req.params.productId, 10);
    const { quantity } = req.body as { quantity: number };

    try {
      const items: BasketItem[] = basketService.updateQuantity(userId, productId, quantity);
      res.json(items);
    } catch (error: unknown) {
      res.status(404).json({
        message: error instanceof Error ? error.message : 'Ошибка',
      });
    }
  },

  removeItem(req: AuthRequest, res: Response): void {
    const userId: number = req.userId!;
    const productId: number = parseInt(req.params.productId, 10);

    try {
      const items: BasketItem[] = basketService.removeItem(userId, productId);
      res.json(items);
    } catch (error: unknown) {
      res.status(404).json({
        message: error instanceof Error ? error.message : 'Ошибка',
      });
    }
  },
};