export interface IBasketItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

export interface IBasket {
    userId: string;
    items: IBasketItem[];
}