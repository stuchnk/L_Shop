import { Product, FilterState } from '../types/product';

const BASE: string = 'http://localhost:3000/api';

export const fetchProducts = async (filters: FilterState): Promise<Product[]> => {
  const params: URLSearchParams = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.category) params.append('category', filters.category);
  if (filters.available) params.append('available', filters.available);

  const res: Response = await fetch(`${BASE}/products?${params.toString()}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Ошибка загрузки товаров');
  return res.json() as Promise<Product[]>;
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const res: Response = await fetch(`${BASE}/products/${id}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Товар не найден');
  return res.json() as Promise<Product>;
};

export const fetchCategories = async (): Promise<string[]> => {
  const res: Response = await fetch(`${BASE}/products/categories`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Ошибка загрузки категорий');
  return res.json() as Promise<string[]>;
};