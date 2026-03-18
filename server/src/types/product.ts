export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  quantity: number;
  rating: number;
}

export interface ProductQueryParams {
  search?: string;
  sortBy?: 'price_asc' | 'price_desc';
  category?: string;
  available?: string;
  minPrice?: string;
  maxPrice?: string;
}