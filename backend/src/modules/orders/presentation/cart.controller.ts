import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CartService } from '../application/cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

/**
 * Controlador de carrito de compras.
 *
 * Autenticación: se espera el header `x-user-id` con el userId del cliente autenticado.
 * Cuando el módulo auth esté completo se reemplazará por un JwtAuthGuard + @Request().
 */
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private extractUserId(headers: Record<string, string>): string {
    const userId = headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedException('Header x-user-id es requerido');
    }
    return userId;
  }

  /** US-07 / US-08: ver el carrito actual del usuario */
  @Get()
  async getCart(@Headers() headers: Record<string, string>) {
    const userId = this.extractUserId(headers);
    const cart = await this.cartService.getUserCart(userId);
    return { id: cart.id, userId: cart.userId, total: cart.total, items: cart.items };
  }

  /**
   * US-07: agregar un producto al carrito.
   * Valida stock y existencia del producto.
   */
  @Post('items')
  async addItem(@Headers() headers: Record<string, string>, @Body() dto: AddCartItemDto) {
    const userId = this.extractUserId(headers);
    const cart = await this.cartService.addItem(userId, dto.productId, dto.quantity);
    return { id: cart.id, userId: cart.userId, total: cart.total, items: cart.items };
  }

  /**
   * US-08: modificar la cantidad de un ítem.
   * El total se recalcula automáticamente.
   */
  @Patch('items/:itemId')
  async updateItemQuantity(
    @Headers() headers: Record<string, string>,
    @Param('itemId') itemId: string,
    @Body() body: UpdateCartItemDto,
  ) {
    const userId = this.extractUserId(headers);
    const cart = await this.cartService.updateItemQuantity(userId, itemId, body.quantity);
    return { id: cart.id, userId: cart.userId, total: cart.total, items: cart.items };
  }

  /** US-07 / US-08: eliminar un ítem del carrito */
  @Delete('items/:itemId')
  async removeItem(@Headers() headers: Record<string, string>, @Param('itemId') itemId: string) {
    const userId = this.extractUserId(headers);
    const cart = await this.cartService.removeItem(userId, itemId);
    return { id: cart.id, userId: cart.userId, total: cart.total, items: cart.items };
  }
}
