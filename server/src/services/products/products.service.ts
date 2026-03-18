import fs from 'fs';
import { PRODUCTS_FILE } from '../../constants/index';
import { Product, ProductQueryParams } from '../../types/product';

const readProducts = (): Product[] => {
  const raw: string = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(raw) as Product[];
};

export const productService = {
  getAll(query: ProductQueryParams): Product[] {
    let products: Product[] = readProducts();

    // Поиск по имени/описанию
    if (query.search) {
      const s: string = query.search.toLowerCase();
      products = products.filter(
        (p: Product) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }

    // Фильтр по категории
    if (query.category) {
      products = products.filter(
        (p: Product) => p.category.toLowerCase() === query.category!.toLowerCase()
      );
    }

    // Фильтр по доступности
    if (query.available !== undefined) {
      const isAvailable: boolean = query.available === 'true';
      products = products.filter((p: Product) => p.available === isAvailable);
    }

    // Фильтр по цене
    if (query.minPrice) {
      const min: number = parseFloat(query.minPrice);
      products = products.filter((p: Product) => p.price >= min);
    }
    if (query.maxPrice) {
      const max: number = parseFloat(query.maxPrice);
      products = products.filter((p: Product) => p.price <= max);
    }

    // Сортировка по цене
    if (query.sortBy === 'price_asc') {
      products.sort((a: Product, b: Product) => a.price - b.price);
    } else if (query.sortBy === 'price_desc') {
      products.sort((a: Product, b: Product) => b.price - a.price);
    }

    return products;
  },

  getById(id: number): Product | undefined {
    const products: Product[] = readProducts();
    return products.find((p: Product) => p.id === id);
  },

  getCategories(): string[] {
    const products: Product[] = readProducts();
    const cats: Set<string> = new Set(products.map((p: Product) => p.category));
    return Array.from(cats);
  },
};