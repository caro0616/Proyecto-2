import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsEnum, MaxLength } from 'class-validator';
import { ProductCategory } from '../../domain/product.entity';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(['instrumental', 'materiales', 'equipos', 'consumibles', 'proteccion', 'otros'])
  category?: ProductCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  invima?: string;

  @IsOptional()
  @IsString()
  materials?: string;

  @IsOptional()
  @IsString()
  dimensions?: string;
}
