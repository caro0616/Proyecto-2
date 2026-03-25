import { Controller, Get, Post, Put, Delete, Patch, Param, Body } from '@nestjs/common';
import { ProductAdminService } from '../application/product-admin.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('admin/products')
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) {}

  /** US-22: listar todos (admin — incluye inactivos) */
  @Get()
  async listAll() {
    return this.productAdminService.listAll();
  }

  /** US-22: crear producto */
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productAdminService.create(dto);
  }

  /** US-22: editar producto */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productAdminService.update(id, dto);
  }

  /**
   * US-23: actualizar stock directamente.
   * No requiere enviar los demás campos del producto.
   */
  @Patch(':id/stock')
  async updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.productAdminService.updateStock(id, dto.stock);
  }

  /** US-22: eliminar producto */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.productAdminService.delete(id);
    return { deleted: true };
  }
}
