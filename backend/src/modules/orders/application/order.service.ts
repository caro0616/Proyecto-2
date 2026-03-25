import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICartRepository, CART_REPOSITORY } from '../infrastructure/cart.repository';
import { Order, OrderStatus } from '../domain/order.entity';
import { IOrderRepository, ORDER_REPOSITORY } from '../infrastructure/order.repository';
import {
  PRODUCT_REPOSITORY,
  IProductRepository,
} from '../../catalog/infrastructure/product.repository';

// Lightweight uuid v4 generator compatible with CommonJS
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async checkout(userId: string): Promise<Order> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock availability for all items before creating order
    const outOfStockItems: string[] = [];
    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        outOfStockItems.push(item.name);
      }
    }

    if (outOfStockItems.length > 0) {
      throw new BadRequestException(`Insufficient stock for: ${outOfStockItems.join(', ')}`);
    }

    const order = new Order(
      uuidv4(),
      userId,
      cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      cart.total,
      'pending',
    );

    // Decrement stock atomically for all items after order is created
    for (const item of cart.items) {
      const success = await this.productRepository.decreaseStockAtomic(item.productId, item.quantity);
      if (!success) {
        // Log warning - this should not happen due to pre-validation
        console.warn(`Failed to decrement stock for product ${item.productId}`);
      }
    }

    await this.orderRepository.save(order);

    // Clear the cart after successful checkout
    cart.items = [];
    cart.total = 0;
    await this.cartRepository.save(cart);

    return order;
  }

  async listAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async updateStatus(orderId: string, status: OrderStatus, adminId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.changeStatus(status, adminId);
    await this.orderRepository.save(order);
    return order;
  }
}
