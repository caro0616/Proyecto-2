import { randomUUID } from 'crypto';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export class Cart {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public items: CartItem[] = [],
    public total: number = 0,
  ) {}

  /**
   * US-07: agrega un producto al carrito.
   * Si el producto ya existe, incrementa la cantidad.
   */
  addItem(productId: string, name: string, unitPrice: number, quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const existing = this.items.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = existing.unitPrice * existing.quantity;
    } else {
      this.items.push({
        id: randomUUID(),
        productId,
        name,
        unitPrice,
        quantity,
        subtotal: unitPrice * quantity,
      });
    }

    this.recalculateTotal();
  }

  /**
   * US-07 / US-08: elimina un ítem del carrito por itemId.
   */
  removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new Error('Item not found in cart');
    }
    this.items.splice(index, 1);
    this.recalculateTotal();
  }

  /**
   * US-08: modifica la cantidad de un ítem ya existente.
   * Cantidad debe ser entero positivo.
   */
  updateItemQuantity(itemId: string, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }

    const itemIndex = this.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    const item = this.items[itemIndex] as CartItem;
    this.items[itemIndex] = {
      ...item,
      quantity,
      subtotal: item.unitPrice * quantity,
    };

    this.recalculateTotal();
  }

  recalculateTotal(): void {
    this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
}
