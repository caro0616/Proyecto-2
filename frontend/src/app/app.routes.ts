import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: '', pathMatch: 'full', redirectTo: 'products' },
];
