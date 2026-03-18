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

export interface FilterState {
  search: string;
  sortBy: 'price_asc' | 'price_desc' | '';
  category: string;
  available: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}