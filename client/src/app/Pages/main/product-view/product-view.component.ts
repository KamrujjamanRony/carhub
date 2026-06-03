import { Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/Shared/breadcrumbs/breadcrumbs.component';
import { ViewContentComponent } from '../../../components/product-view/view-content/view-content.component';
import { ViewImagesComponent } from '../../../components/product-view/view-images/view-images.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { RelatedProductsComponent } from "../../../components/Shared/related-products/related-products.component";

@Component({
  selector: 'app-product-view',
  imports: [BreadcrumbsComponent, ViewContentComponent, ViewImagesComponent, RelatedProductsComponent],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent {

  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  paramsSubscription?: Subscription;
  product: any;
  allProducts: any;

  ngOnInit() {
    // Fetch all products to use in related products component
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
    });
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params: any) => {
        const id = params.get('id');
        this.productService.getProduct(id).subscribe(data => {
          this.product = data;
        });
      },
    });
  }

}
