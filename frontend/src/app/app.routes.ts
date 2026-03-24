import { Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';

export const routes: Routes = [
  { path: 'catalog', component: CatalogComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: '', pathMatch: 'full', redirectTo: 'catalog' },
];
