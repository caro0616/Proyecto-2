import { IsInt, Min } from 'class-validator';

/** US-23: DTO para actualización de stock de inventario */
export class UpdateStockDto {
  @IsInt()
  @Min(0)
  stock!: number;
}
