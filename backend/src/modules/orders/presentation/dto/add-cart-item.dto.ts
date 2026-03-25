import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

/** US-07: DTO para agregar un producto al carrito */
export class AddCartItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
