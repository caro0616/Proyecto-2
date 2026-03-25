import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  ps = inject(ProductService);
  featured = signal<Product[]>([]);
  loading = signal(true);

  categoryCards = [
    { name: 'instrumental',  label: 'Instrumental Clínico',       icon: '🔬' },
    { name: 'materiales',    label: 'Materiales de Restauración', icon: '🧪' },
    { name: 'consumibles',   label: 'Endodoncia y Consumibles',   icon: '🦷' },
    { name: 'proteccion',    label: 'Protección y Bioseguridad',  icon: '🧤' },
    { name: 'equipos',       label: 'Equipos Dentales',           icon: '⚙️' },
    { name: 'otros',         label: 'Ortodoncia y Otros',         icon: '✨' },
  ];

  async ngOnInit() {
    try {
      const products = await this.ps.loadCatalog();
      this.featured.set(products.slice(0, 4));
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      this.loading.set(false);
    }
  }
}
