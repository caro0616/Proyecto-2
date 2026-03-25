import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  ps    = inject(ProductService);
  route = inject(ActivatedRoute);

  allProducts = signal<Product[]>([]);
  loading = signal(true);
  searchQuery = signal<string | null>(null);

  selectedCategory  = signal<string | null>(null);
  selectedBrand     = signal<string | null>(null);
  selectedMaterials = signal<string[]>([]);
  priceMax          = signal(600000);
  sortBy            = signal<string>('Más nuevo');

  products = computed<Product[]>(() => {
    let list = this.allProducts();
    if (this.selectedCategory()) list = list.filter(p => p.category === this.selectedCategory());
    if (this.selectedBrand())    list = list.filter(p => p.brand === this.selectedBrand());
    if (this.selectedMaterials().length) list = list.filter(p => this.selectedMaterials().includes(p.materials));
    list = list.filter(p => p.price <= this.priceMax());
    return list;
  });

  pageTitle = computed(() => {
    if (this.searchQuery()) return `Resultados para "${this.searchQuery()}"`;
    const cat = this.selectedCategory();
    return cat ? (this.ps.categoryLabels[cat] || cat) : 'Todos los Productos';
  });

  get categories() { return this.ps.categories; }
  get brands()     { return this.ps.brands; }
  get materials()  { return this.ps.materials; }

  async ngOnInit() {
    this.route.queryParams.subscribe(async p => {
      this.selectedCategory.set(p['cat'] ?? null);
      this.searchQuery.set(p['q'] ?? null);
      await this.loadProducts();
    });
  }

  private async loadProducts() {
    this.loading.set(true);
    try {
      let products: Product[];
      if (this.searchQuery()) {
        products = await this.ps.search(this.searchQuery()!);
      } else {
        products = await this.ps.loadCatalog();
      }
      this.allProducts.set(products);
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      this.loading.set(false);
    }
  }

  toggleMaterial(mat: string) {
    this.selectedMaterials.update(list =>
      list.includes(mat) ? list.filter(m => m !== mat) : [...list, mat]
    );
  }

  isMaterialSelected(mat: string) { return this.selectedMaterials().includes(mat); }
  isCategorySelected(cat: string) { return this.selectedCategory() === cat; }
  isBrandSelected(brand: string)  { return this.selectedBrand() === brand; }

  selectCategory(cat: string) {
    this.selectedCategory.update(v => v === cat ? null : cat);
  }
  selectBrand(brand: string) {
    this.selectedBrand.update(v => v === brand ? null : brand);
  }

  categoryLabel(slug: string): string {
    return this.ps.categoryLabels[slug] || slug;
  }

  clearFilters() {
    this.selectedCategory.set(null);
    this.selectedBrand.set(null);
    this.selectedMaterials.set([]);
    this.priceMax.set(500000);
  }

  get breadcrumbs() {
    const crumbs: { label: string; route: string }[] = [
      { label: 'Catálogo', route: '/catalogo' }
    ];
    if (this.selectedCategory()) {
      crumbs.push({ label: this.categoryLabel(this.selectedCategory()!), route: '' });
    }
    return crumbs;
  }
}
