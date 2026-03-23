import { CartItem } from '../types/product';
import { clearSession } from '../utils/auth';
import { navigateTo } from '../utils/router';

const BASE: string = 'http://localhost:3000/api';

const handleUnauthorized = (): never => {
  clearSession();
  alert('Сессия истекла. Войдите заново.');
  navigateTo('/login');
  throw new Error('Unauthorized');
};

export const fetchBasket = async (): Promise<CartItem[]> => {
  const res: Response = await fetch(`${BASE}/basket`, {
    credentials: 'include',
  });
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) throw new Error('Ошибка загрузки корзины');
  return res.json() as Promise<CartItem[]>;
};

export const addToBasketApi = async (item: CartItem): Promise<CartItem[]> => {
  const res: Response = await fetch(`${BASE}/basket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(item),
  });
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) throw new Error('Ошибка добавления в корзину');
  return res.json() as Promise<CartItem[]>;
};

export const updateBasketQuantity = async (
  productId: number,
  quantity: number
): Promise<CartItem[]> => {
  const res: Response = await fetch(`${BASE}/basket/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ quantity }),
  });
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) throw new Error('Ошибка обновления количества');
  return res.json() as Promise<CartItem[]>;
};

export const removeFromBasket = async (productId: number): Promise<CartItem[]> => {
  const res: Response = await fetch(`${BASE}/basket/${productId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (res.status === 401) handleUnauthorized();
  if (!res.ok) throw new Error('Ошибка удаления из корзины');
  return res.json() as Promise<CartItem[]>;
};