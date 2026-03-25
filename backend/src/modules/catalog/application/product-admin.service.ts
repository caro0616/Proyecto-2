import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import { PRODUCT_REPOSITORY, IProductRepository } from '../infrastructure/product.repository';
import { CreateProductDto } from '../presentation/dto/create-product.dto';
import { UpdateProductDto } from '../presentation/dto/update-product.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductAdminService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  /** US-22: crear producto */
  async create(dto: CreateProductDto): Promise<Product> {
    const product = new Product(
      randomUUID(),
      dto.name,
      dto.description,
      dto.price,
      dto.imageUrl,
      dto.category,
      dto.stock,
      dto.active ?? true,
      dto.sku ?? '',
      dto.brand ?? '',
      dto.invima ?? '',
      dto.materials ?? '',
      dto.dimensions ?? '',
    );
    await this.productRepo.save(product);
    return product;
  }

  /** US-22: listar todos los productos (admin — incluye inactivos) */
  async listAll(): Promise<Product[]> {
    return this.productRepo.findAll();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productRepo.findById(id);
  }

  /** US-22: editar producto */
  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.imageUrl !== undefined) product.imageUrl = dto.imageUrl;
    if (dto.category !== undefined) product.category = dto.category;
    if (dto.brand !== undefined) product.brand = dto.brand;
    if (dto.invima !== undefined) product.invima = dto.invima;
    if (dto.materials !== undefined) product.materials = dto.materials;
    if (dto.dimensions !== undefined) product.dimensions = dto.dimensions;
    if (dto.stock !== undefined) product.updateStock(dto.stock);
    if (dto.active !== undefined) {
      if (dto.active) {
        product.activate();
      } else {
        product.deactivate();
      }
    }

    await this.productRepo.save(product);
    return product;
  }

  /** US-22: eliminar producto */
  async delete(id: string): Promise<void> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    await this.productRepo.delete(id);
  }

  /**
   * US-23: actualización directa de stock.
   * Endpoint dedicado para que el admin controle inventario sin cambiar otros campos.
   */
  async updateStock(id: string, newStock: number): Promise<Product> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    product.updateStock(newStock);
    await this.productRepo.save(product);
    return product;
  }
}
