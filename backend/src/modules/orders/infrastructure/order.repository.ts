import { Order } from '../domain/order.entity';

/** Injection token for the order repository. */
export const ORDER_REPOSITORY = Symbol('IOrderRepository');

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  /** US-10: historial de órdenes del usuario */
  findByUserId(userId: string): Promise<Order[]>;
  save(order: Order): Promise<void>;
}

// ─── In-memory implementation (unit tests / local dev without DB) ─────────────

export class InMemoryOrderRepository implements IOrderRepository {
  private readonly orders = new Map<string, Order>();

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.userId === userId);
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
}
