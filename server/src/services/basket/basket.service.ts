import fs from 'fs';
import { BASKET_FILE, PRODUCTS_FILE } from '../../constants/index';
import { UserBasket, BasketItem } from '../../types/basket';

type Product = {
  id: number;
  quantity: number;
  available: boolean;
};

const readBaskets = (): UserBasket[] => {
  try {
    const raw = fs.readFileSync(BASKET_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error(e);
    return [];
  }
};

const writeBaskets = (baskets: UserBasket[]): void => {
  fs.writeFileSync(BASKET_FILE, JSON.stringify(baskets, null, 2), 'utf-8');
};

const readProducts = (): Product[] => {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const basketService = {
  getByUserId(userId: number): BasketItem[] {
    const baskets = readBaskets();
    const userBasket = baskets.find(b => b.userId === userId);
    return userBasket ? userBasket.items : [];
  },

  addItem(userId: number, item: BasketItem): BasketItem[] {
    const baskets = readBaskets();
    const products = readProducts();

    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error('Товар не найден');

    if (!product.available || product.quantity === 0) {
      throw new Error('Товара нет в наличии');
    }

    let userBasket = baskets.find(b => b.userId === userId);

    if (!userBasket) {
      userBasket = { userId, items: [] };
      baskets.push(userBasket);
    }

    const existingItem = userBasket.items.find(i => i.productId === item.productId);

    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQty = currentQty + item.quantity;

    if (newQty > product.quantity) {
      throw new Error(`Доступно только ${product.quantity} шт.`);
    }

    if (existingItem) {
      existingItem.quantity = newQty;
    } else {
      userBasket.items.push(item);
    }

    writeBaskets(baskets);
    return userBasket.items;
  },

  updateQuantity(userId: number, productId: number, quantity: number): BasketItem[] {
    const baskets = readBaskets();
    const products = readProducts();

    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Товар не найден');

    if (!product.available) {
      throw new Error('Товар недоступен');
    }

    const userBasket = baskets.find(b => b.userId === userId);
    if (!userBasket) throw new Error('Корзина не найдена');

    const item = userBasket.items.find(i => i.productId === productId);
    if (!item) throw new Error('Товар не найден в корзине');

    if (quantity > product.quantity) {
      throw new Error(`Максимум ${product.quantity} шт.`);
    }

    if (quantity <= 0) {
      userBasket.items = userBasket.items.filter(i => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    writeBaskets(baskets);
    return userBasket.items;
  },

  removeItem(userId: number, productId: number): BasketItem[] {
    const baskets = readBaskets();
    const userBasket = baskets.find(b => b.userId === userId);

    if (!userBasket) throw new Error('Корзина не найдена');

    userBasket.items = userBasket.items.filter(i => i.productId !== productId);

    writeBaskets(baskets);
    return userBasket.items;
  },

  clearBasket(userId: number): void {
    const baskets = readBaskets();
    const userBasket = baskets.find(b => b.userId === userId);

    if (userBasket) {
      userBasket.items = [];
      writeBaskets(baskets);
    }
  },
};