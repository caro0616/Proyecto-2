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

  /** US-01: catálogo público de productos activos con stock disponible */
  async getPublicCatalog(): Promise<Product[]> {
    return this.productRepo.findActive();
  }

  /** US-05 / US-06: ficha técnica completa de un producto */
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product || !product.active) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    return product;
  }

  /** US-02: filtrado por categoría */
  async getByCategory(category: string): Promise<Product[]> {
    return this.productRepo.findByCategory(category);
  }

  /** US-03: búsqueda por nombre o referencia (búsquedas parciales incluidas) */
  async search(query: string): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return this.productRepo.findActive();
    }
    return this.productRepo.search(query.trim());
  }

  /** US-04: filtros combinados — categoría y/o disponibilidad */
  async filter(params: {
    category?: string;
    available?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    let products: Product[];

    if (params.category) {
      products = await this.productRepo.findByCategory(params.category);
    } else {
      products = await this.productRepo.findActive();
    }

    if (params.available === true) {
      products = products.filter((p) => p.isAvailable());
    }

    if (params.minPrice !== undefined) {
      products = products.filter((p) => p.price >= (params.minPrice as number));
    }

    if (params.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= (params.maxPrice as number));
    }

    return products;
  }

  /** US-02: categorías con conteo de productos activos */
  async getCategoriesWithCount(): Promise<CategoryWithCount[]> {
    const counts = await this.productRepo.countByCategories();
    return DENTAL_CATEGORIES.map((cat) => ({
      ...cat,
      productCount: counts[cat.slug] ?? 0,
    }));
  }
}
