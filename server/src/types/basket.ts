export interface BasketItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  
  export interface UserBasket {
    userId: number;
    items: BasketItem[];
  }