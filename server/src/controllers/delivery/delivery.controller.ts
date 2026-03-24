import { Response } from 'express';
import { deliveryService } from '../../services/delivery/delivery.service';
import { basketService } from '../../services/basket/basket.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import {
  DeliveryAddress,
  PaymentInfo,
  DeliveryOrderItem,
} from '../../types/delivery';
import { BasketItem } from '../../types/basket';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CITY_REGEX = /^[A-Za-zА-Яа-яЁёІіЇїЄє\s-]{2,}$/;
const CARD_HOLDER_REGEX = /^[A-Za-zА-Яа-яЁёІіЇїЄє\s.'-]{2,}$/;

const normalizeValue = (value: unknown): string => String(value ?? '').trim();

const digitsOnly = (value: string): string => value.replace(/\D/g, '');

const normalizePhone = (value: string): string => value.replace(/[^\d+]/g, '');

const isValidExpiry = (value: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return false;
  }

  const [monthString, yearString] = value.split('/');
  const month: number = Number(monthString);
  const year: number = Number(yearString) + 2000;

  if (!month || month < 1 || month > 12) {
    return false;
  }

  const now: Date = new Date();
  const currentYear: number = now.getFullYear();
  const currentMonth: number = now.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
};

const validateDeliveryPayload = (
  delivery?: DeliveryAddress,
  payment?: PaymentInfo
): string | null => {
  const city: string = normalizeValue(delivery?.city);
  const address: string = normalizeValue(delivery?.address);
  const phone: string = normalizePhone(normalizeValue(delivery?.phone));
  const email: string = normalizeValue(delivery?.email);
  const cardNumber: string = digitsOnly(normalizeValue(payment?.cardNumber));
  const cardHolder: string = normalizeValue(payment?.cardHolder);
  const expiry: string = normalizeValue(payment?.expiry);
  const cvv: string = digitsOnly(normalizeValue(payment?.cvv));

  if (!city) return 'Введите город';
  if (!CITY_REGEX.test(city)) return 'Укажите корректное название города';

  if (!address) return 'Введите адрес доставки';
  if (address.length < 5) return 'Адрес должен быть не короче 5 символов';

  if (!phone) return 'Введите телефон';
  if (!/^\+?\d{10,15}$/.test(phone)) {
    return 'Телефон должен содержать от 10 до 15 цифр';
  }

  if (!email) return 'Введите email';
  if (!EMAIL_REGEX.test(email)) return 'Введите корректный email';

  if (!cardNumber) return 'Введите номер карты';
  if (cardNumber.length !== 16) return 'Номер карты должен содержать 16 цифр';

  if (!cardHolder) return 'Введите имя владельца карты';
  if (!CARD_HOLDER_REGEX.test(cardHolder)) {
    return 'Укажите имя владельца латиницей или кириллицей';
  }

  if (!expiry) return 'Введите срок действия карты';
  if (!isValidExpiry(expiry)) {
    return 'Укажите корректный срок действия в формате MM/YY';
  }

  if (!cvv) return 'Введите CVV';
  if (!/^\d{3}$/.test(cvv)) return 'CVV должен содержать 3 цифры';

  return null;
};

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

    const validationError: string | null = validateDeliveryPayload(
      delivery,
      payment
    );

    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

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
      delivery: {
        city: normalizeValue(delivery.city),
        address: normalizeValue(delivery.address),
        phone: normalizePhone(normalizeValue(delivery.phone)),
        email: normalizeValue(delivery.email),
        comment: normalizeValue(delivery.comment),
      },
      payment: {
        cardNumber: digitsOnly(normalizeValue(payment.cardNumber)),
        cardHolder: normalizeValue(payment.cardHolder),
        expiry: normalizeValue(payment.expiry),
        cvv: digitsOnly(normalizeValue(payment.cvv)),
      },
      totalPrice,
    });

    basketService.clearBasket(userId);

    res.status(201).json(order);
  },
};
