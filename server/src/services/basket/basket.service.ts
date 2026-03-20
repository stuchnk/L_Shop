import fs from 'fs';
import { BASKET_FILE } from '../../constants/index';
import { UserBasket, BasketItem } from '../../types/basket';

const readBaskets = (): UserBasket[] => {
  try {
    const raw: string = fs.readFileSync(BASKET_FILE, 'utf-8');
    const parsed: UserBasket[] = JSON.parse(raw || '[]');
    return parsed;
  } catch {
    return [];
  }
};

const writeBaskets = (baskets: UserBasket[]): void => {
  fs.writeFileSync(BASKET_FILE, JSON.stringify(baskets, null, 2), 'utf-8');
};

export const basketService = {
  getByUserId(userId: number): BasketItem[] {
    const baskets: UserBasket[] = readBaskets();
    const userBasket: UserBasket | undefined = baskets.find(
      (b: UserBasket) => b.userId === userId
    );
    return userBasket ? userBasket.items : [];
  },

  addItem(userId: number, item: BasketItem): BasketItem[] {
    const baskets: UserBasket[] = readBaskets();
    let userBasket: UserBasket | undefined = baskets.find(
      (b: UserBasket) => b.userId === userId
    );

    if (!userBasket) {
      userBasket = { userId, items: [] };
      baskets.push(userBasket);
    }

    const existingIdx: number = userBasket.items.findIndex(
      (i: BasketItem) => i.productId === item.productId
    );

    if (existingIdx >= 0) {
      userBasket.items[existingIdx].quantity += item.quantity;
    } else {
      userBasket.items.push(item);
    }

    writeBaskets(baskets);
    return userBasket.items;
  },

  updateQuantity(userId: number, productId: number, quantity: number): BasketItem[] {
    const baskets: UserBasket[] = readBaskets();
    const userBasket: UserBasket | undefined = baskets.find(
      (b: UserBasket) => b.userId === userId
    );

    if (!userBasket) {
      throw new Error('Корзина не найдена');
    }

    const item: BasketItem | undefined = userBasket.items.find(
      (i: BasketItem) => i.productId === productId
    );

    if (!item) {
      throw new Error('Товар не найден в корзине');
    }

    if (quantity <= 0) {
      userBasket.items = userBasket.items.filter(
        (i: BasketItem) => i.productId !== productId
      );
    } else {
      item.quantity = quantity;
    }

    writeBaskets(baskets);
    return userBasket.items;
  },

  removeItem(userId: number, productId: number): BasketItem[] {
    const baskets: UserBasket[] = readBaskets();
    const userBasket: UserBasket | undefined = baskets.find(
      (b: UserBasket) => b.userId === userId
    );

    if (!userBasket) {
      throw new Error('Корзина не найдена');
    }

    userBasket.items = userBasket.items.filter(
      (i: BasketItem) => i.productId !== productId
    );

    writeBaskets(baskets);
    return userBasket.items;
  },

  clearBasket(userId: number): void {
    const baskets: UserBasket[] = readBaskets();
    const userBasket: UserBasket | undefined = baskets.find(
      (b: UserBasket) => b.userId === userId
    );

    if (userBasket) {
      userBasket.items = [];
      writeBaskets(baskets);
    }
  },
};