import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import { Category, DENTAL_CATEGORIES } from '../domain/categories';
import { PRODUCT_REPOSITORY, IProductRepository } from '../infrastructure/product.repository';

export interface CategoryWithCount extends Category {
  productCount: number;
}

@Injectable()
export class CatalogService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async getPublicCatalog(): Promise<Product[]> {
    return this.productRepo.findActive();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product || !product.active) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async getByCategory(category: string): Promise<Product[]> {
    return this.productRepo.findByCategory(category);
  }

  /**
   * Obtiene todas las categorías con el conteo de productos activos.
   * @returns Lista de categorías con productCount
   */
  async getCategoriesWithCount(): Promise<CategoryWithCount[]> {
    const categories = DENTAL_CATEGORIES;
    const counts = await this.productRepo.countByCategories();

    return categories.map((cat) => ({
      ...cat,
      productCount: counts[cat.slug] || 0,
    }));
  }
}
