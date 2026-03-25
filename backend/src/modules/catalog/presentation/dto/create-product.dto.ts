import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsEnum, MaxLength } from 'class-validator';
import { ProductCategory } from '../../domain/product.entity';

export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  imageUrl!: string;

  @IsEnum(['instrumental', 'materiales', 'equipos', 'consumibles', 'proteccion', 'otros'])
  category!: ProductCategory;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  /** US-06: número de registro INVIMA */
  @IsOptional()
  @IsString()
  invima?: string;

  /** US-05: descripción de materiales */
  @IsOptional()
  @IsString()
  materials?: string;

  /** US-05: dimensiones del producto */
  @IsOptional()
  @IsString()
  dimensions?: string;
}
