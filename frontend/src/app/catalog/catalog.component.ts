import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  technicalSpecs?: Record<string, string>;
  invimaRegistry: string;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  loading = false;
  error: string | null = null;

  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = products;
        this.categories = [...new Set(products.map((p) => p.category))];
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el catálogo';
        this.loading = false;
      },
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.products;
    if (this.selectedCategory) {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }
    if (this.searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }
    this.filteredProducts = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();

    this.http
      .post(`${this.apiUrl}/cart/items`, {
        productId: product.id,
        quantity: 1,
      })
      .subscribe({
        next: () => {
          sessionStorage.setItem('cartUpdated', 'true');
          alert('Producto agregado al carrito');
        },
        error: () => alert('Error al agregar al carrito'),
      });
  }
}
