import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cart } from '../domain/cart.entity';
import { ICartRepository, CART_REPOSITORY } from '../infrastructure/cart.repository';
import {
  PRODUCT_REPOSITORY,
  IProductRepository,
} from '../../catalog/infrastructure/product.repository';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: ICartRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  /**
   * Obtiene el carrito del usuario.
   * Si no existe, crea uno vacío.
   */
  async getUserCart(userId: string): Promise<Cart> {
    const existing = await this.cartRepository.findByUserId(userId);
    if (existing) return existing;

    const newCart = new Cart('', userId, [], 0);
    await this.cartRepository.save(newCart);
    return newCart;
  }

  /**
   * US-07: agrega un producto al carrito.
   * Valida que el producto exista y tenga stock suficiente.
   */
  async addItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const product = await this.productRepository.findById(productId);
    if (!product || !product.active) {
      throw new NotFoundException(`Producto ${productId} no encontrado`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente: disponible ${product.stock}, solicitado ${quantity}`,
      );
    }

    const cart = await this.getUserCart(userId);
    cart.addItem(productId, product.name, product.price, quantity);
    await this.cartRepository.save(cart);
    return cart;
  }

  /**
   * US-07 / US-08: elimina un ítem del carrito.
   */
  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    try {
      cart.removeItem(itemId);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    await this.cartRepository.save(cart);
    return cart;
  }

  /**
   * US-08: modifica la cantidad de un ítem.
   * El total se recalcula automáticamente.
   * No se permiten cantidades negativas.
   */
  async updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<Cart> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    try {
      cart.updateItemQuantity(itemId, quantity);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    await this.cartRepository.save(cart);
    return cart;
  }
}
