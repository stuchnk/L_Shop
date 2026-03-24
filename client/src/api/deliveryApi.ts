interface DeliveryPayload {
    delivery: {
      city: string;
      address: string;
      phone: string;
      email: string;
      comment: string;
    };
    payment: {
      cardNumber: string;
      cardHolder: string;
      expiry: string;
      cvv: string;
    };
  }
  
  export interface DeliveryOrderItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }

  export interface DeliveryOrderAddress {
    city: string;
    address: string;
    phone: string;
    email: string;
    comment: string;
  }

  export interface DeliveryOrder {
    id: number;
    userId: number;
    items: DeliveryOrderItem[];
    delivery: DeliveryOrderAddress;
    totalPrice: number;
    status: string;
    createdAt: string;
  }
  
  const BASE: string = 'http://localhost:3000/api';
  
  export const createDelivery = async (payload: DeliveryPayload): Promise<DeliveryOrder> => {
    const res: Response = await fetch(`${BASE}/delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Ошибка оформления доставки');
    }
    return res.json() as Promise<DeliveryOrder>;
  };
  
  export const fetchDeliveries = async (): Promise<DeliveryOrder[]> => {
    const res: Response = await fetch(`${BASE}/delivery`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Ошибка загрузки доставок');
    return res.json() as Promise<DeliveryOrder[]>;
  };
