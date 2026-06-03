import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-related-products',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RelatedProductsComponent {
  @Input() currentProduct: any;
  @Input() allProducts: any[] = [];

  get relatedProducts() {
    if (!this.currentProduct?.relatedProducts || !this.allProducts?.length) {
      return [];
    }
    return this.allProducts.filter(product =>
      this.currentProduct.relatedProducts.includes(product.id) &&
      product.id !== this.currentProduct.id
    );
  }

  breakpoints = {
    480: { slidesPerView: 2, spaceBetween: 5 },
    768: { slidesPerView: 3, spaceBetween: 10 },
    1024: { slidesPerView: 4, spaceBetween: 15 },
    1440: { slidesPerView: 5, spaceBetween: 20 }
    // 480: { slidesPerView: 1, spaceBetween: 5 },
    // 768: { slidesPerView: 2, spaceBetween: 10 },
    // 1024: { slidesPerView: 3, spaceBetween: 20 },
    // 1440: { slidesPerView: 4, spaceBetween: 25 }
  }

}
