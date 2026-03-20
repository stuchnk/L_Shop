import fs from 'fs';
import { DELIVERY_FILE } from '../../constants/index';
import { DeliveryOrder } from '../../types/delivery';

const readDeliveries = (): DeliveryOrder[] => {
  try {
    const raw: string = fs.readFileSync(DELIVERY_FILE, 'utf-8');
    return JSON.parse(raw || '[]') as DeliveryOrder[];
  } catch {
    return [];
  }
};

const writeDeliveries = (deliveries: DeliveryOrder[]): void => {
  fs.writeFileSync(DELIVERY_FILE, JSON.stringify(deliveries, null, 2), 'utf-8');
};

export const deliveryService = {
  getByUserId(userId: number): DeliveryOrder[] {
    const deliveries: DeliveryOrder[] = readDeliveries();
    return deliveries.filter((d: DeliveryOrder) => d.userId === userId);
  },

  create(order: Omit<DeliveryOrder, 'id' | 'createdAt' | 'status'>): DeliveryOrder {
    const deliveries: DeliveryOrder[] = readDeliveries();

    const newOrder: DeliveryOrder = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    deliveries.push(newOrder);
    writeDeliveries(deliveries);
    return newOrder;
  },

  getById(orderId: number): DeliveryOrder | undefined {
    const deliveries: DeliveryOrder[] = readDeliveries();
    return deliveries.find((d: DeliveryOrder) => d.id === orderId);
  },
};