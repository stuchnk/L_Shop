"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryController = void 0;
const delivery_service_1 = require("../../services/delivery/delivery.service");
const basket_service_1 = require("../../services/basket/basket.service");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CITY_REGEX = /^[A-Za-zА-Яа-яЁёІіЇїЄє\s-]{2,}$/;
const CARD_HOLDER_REGEX = /^[A-Za-zА-Яа-яЁёІіЇїЄє\s.'-]{2,}$/;
const normalizeValue = (value) => String(value ?? '').trim();
const digitsOnly = (value) => value.replace(/\D/g, '');
const normalizePhone = (value) => value.replace(/[^\d+]/g, '');
const isValidExpiry = (value) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) {
        return false;
    }
    const [monthString, yearString] = value.split('/');
    const month = Number(monthString);
    const year = Number(yearString) + 2000;
    if (!month || month < 1 || month > 12) {
        return false;
    }
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear) {
        return false;
    }
    if (year === currentYear && month < currentMonth) {
        return false;
    }
    return true;
};
const validateDeliveryPayload = (delivery, payment) => {
    const city = normalizeValue(delivery?.city);
    const address = normalizeValue(delivery?.address);
    const phone = normalizePhone(normalizeValue(delivery?.phone));
    const email = normalizeValue(delivery?.email);
    const cardNumber = digitsOnly(normalizeValue(payment?.cardNumber));
    const cardHolder = normalizeValue(payment?.cardHolder);
    const expiry = normalizeValue(payment?.expiry);
    const cvv = digitsOnly(normalizeValue(payment?.cvv));
    if (!city)
        return 'Введите город';
    if (!CITY_REGEX.test(city))
        return 'Укажите корректное название города';
    if (!address)
        return 'Введите адрес доставки';
    if (address.length < 5)
        return 'Адрес должен быть не короче 5 символов';
    if (!phone)
        return 'Введите телефон';
    if (!/^\+?\d{10,15}$/.test(phone)) {
        return 'Телефон должен содержать от 10 до 15 цифр';
    }
    if (!email)
        return 'Введите email';
    if (!EMAIL_REGEX.test(email))
        return 'Введите корректный email';
    if (!cardNumber)
        return 'Введите номер карты';
    if (cardNumber.length !== 16)
        return 'Номер карты должен содержать 16 цифр';
    if (!cardHolder)
        return 'Введите имя владельца карты';
    if (!CARD_HOLDER_REGEX.test(cardHolder)) {
        return 'Укажите имя владельца латиницей или кириллицей';
    }
    if (!expiry)
        return 'Введите срок действия карты';
    if (!isValidExpiry(expiry)) {
        return 'Укажите корректный срок действия в формате MM/YY';
    }
    if (!cvv)
        return 'Введите CVV';
    if (!/^\d{3}$/.test(cvv))
        return 'CVV должен содержать 3 цифры';
    return null;
};
exports.deliveryController = {
    getDeliveries(req, res) {
        const userId = req.userId;
        const orders = delivery_service_1.deliveryService.getByUserId(userId);
        res.json(orders);
    },
    createDelivery(req, res) {
        const userId = req.userId;
        const { delivery, payment } = req.body;
        const validationError = validateDeliveryPayload(delivery, payment);
        if (validationError) {
            res.status(400).json({ message: validationError });
            return;
        }
        const basketItems = basket_service_1.basketService.getByUserId(userId);
        if (basketItems.length === 0) {
            res.status(400).json({ message: 'Корзина пуста' });
            return;
        }
        const orderItems = basketItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));
        const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = delivery_service_1.deliveryService.create({
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
        basket_service_1.basketService.clearBasket(userId);
        res.status(201).json(order);
    },
};
