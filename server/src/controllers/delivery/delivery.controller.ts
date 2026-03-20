import { Response } from 'express';
import { deliveryService } from '../../services/delivery/delivery.service';
import { basketService } from '../../services/basket/basket.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { DeliveryAddress, PaymentInfo, DeliveryOrderItem } from '../../types/delivery';
import { BasketItem } from '../../types/basket';

export const deliveryController = {
  getDeliveries(req: AuthRequest, res: Response): void {
    const userId: number = req.userId!;
    const orders = deliveryService.getByUserId(userId);
    res.json(orders);
  },

  createDelivery(req: AuthRequest, res: Response): void {
    const userId: number = req.userId!;
    const { delivery, payment } = req.body as {
      delivery: DeliveryAddress;
      payment: PaymentInfo;
    };

    if (!delivery || !delivery.address || !delivery.phone || !delivery.email) {
      res.status(400).json({ message: 'Заполните все поля доставки' });
      return;
    }

    if (!payment || !payment.cardNumber || !payment.cardHolder || !payment.expiry || !payment.cvv) {
      res.status(400).json({ message: 'Заполните все поля оплаты' });
      return;
    }

    // Получаем корзину пользователя
    const basketItems: BasketItem[] = basketService.getByUserId(userId);

    if (basketItems.length === 0) {
      res.status(400).json({ message: 'Корзина пуста' });
      return;
    }

    const orderItems: DeliveryOrderItem[] = basketItems.map((item: BasketItem) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const totalPrice: number = orderItems.reduce(
      (sum: number, item: DeliveryOrderItem) => sum + item.price * item.quantity,
      0
    );

    const order = deliveryService.create({
      userId,
      items: orderItems,
      delivery,
      payment,
      totalPrice,
    });

    // Очищаем корзину после успешного оформления
    basketService.clearBasket(userId);

    res.status(201).json(order);
  },
};