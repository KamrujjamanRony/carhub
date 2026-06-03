import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ProductCardComponent } from "../../Shared/product-card/product-card.component";
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-wrapper',
  imports: [ProductCardComponent],
  templateUrl: './product-wrapper.component.html',
  styleUrl: './product-wrapper.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductWrapperComponent {
  productService = inject(ProductService);

  products: any;
  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
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
