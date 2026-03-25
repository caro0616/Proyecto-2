import { Product } from '../domain/product.entity';

/**
 * Injection token for the product repository.
 */
export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findActive(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  countByCategories(): Promise<Record<string, number>>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  decreaseStockAtomic(id: string, quantity: number): Promise<boolean>;
}

// ─── In-memory implementation (kept for unit tests / local dev without DB) ────

export class InMemoryProductRepository implements IProductRepository {
  private readonly products = new Map<string, Product>();

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findActive(): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.active);
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.active && p.category === category);
  }

  async countByCategories(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    const products = Array.from(this.products.values()).filter((p) => p.active);
    for (const product of products) {
      const cat = product.category as string;
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }

  async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }

  async decreaseStockAtomic(id: string, quantity: number): Promise<boolean> {
    const product = this.products.get(id);
    if (!product || product.stock < quantity) return false;
    product.stock -= quantity;
    return true;
  }
}

/**
 * @deprecated Use PRODUCT_REPOSITORY injection token instead.
 * Kept as abstract class so existing service constructors compile without changes.
 */
export abstract class ProductRepository implements IProductRepository {
  abstract findAll(): Promise<Product[]>;
  abstract findActive(): Promise<Product[]>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findByCategory(category: string): Promise<Product[]>;
  abstract countByCategories(): Promise<Record<string, number>>;
  abstract save(product: Product): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract decreaseStockAtomic(id: string, quantity: number): Promise<boolean>;
}
