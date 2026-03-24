import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';
import { CatalogModule } from './modules/catalog/catalog.module';

@Module({
  imports: [OrdersModule, CatalogModule],
})
export class AppModule {}
