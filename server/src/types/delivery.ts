export interface DeliveryAddress {
    city: string;
    address: string;
    phone: string;
    email: string;
    comment: string;
  }
  
  export interface PaymentInfo {
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
  }
  
  export interface DeliveryOrder {
    id: number;
    userId: number;
    items: DeliveryOrderItem[];
    delivery: DeliveryAddress;
    payment: PaymentInfo;
    totalPrice: number;
    createdAt: string;
    status: 'pending' | 'confirmed' | 'delivered';
  }
  
  export interface DeliveryOrderItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }