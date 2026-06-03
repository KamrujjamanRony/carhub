import { Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { Auth } from '@angular/fire/auth';
import { SingleWishlistComponent } from "../../../components/Shared/single-wishlist/single-wishlist.component";
import { ToastComponent } from "../../../components/primeng/toast/toast.component";
import { WishListService } from '../../../services/user/wish-list.service';

@Component({
  selector: 'app-wishlist',
  imports: [SingleWishlistComponent, ToastComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  wishListService = inject(WishListService);
  productService = inject(ProductService);
  authCookieService = inject(AuthCookieService);
  private auth = inject(Auth);
  wishlist: any[] = [];
  userWishlist: any[] = [];
  products: any[] = [];
  user: any;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  ngOnInit() {
    this.loadWishlist();

    // Subscribe to Wishlist updates
    this.wishListService.wishlistUpdated$.subscribe(() => {
      this.loadWishlist(); // Refresh Wishlist whenever it updates
    });
  }
  loadWishlist() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;

      this.productService.getProducts().subscribe((productData) => {
        this.products = productData;

        this.wishListService.getWishlist(this.user?.uid).subscribe((cartData) => {
          if (!cartData) {
            return;
          }
          this.userWishlist = cartData[0];
          this.wishlist = this.mergeWishlistAndProducts(cartData[0]?.products || []);
          this.calculateTotals();
        });
      });
    });
  }
  // Merge cart items with product data
  mergeWishlistAndProducts(items: any[]) {
    return items.map((item) => {
      const product = this.products.find((p) => p.id == item.productId);

      return {
        id: item.id,
        productId: item.productId,
        productName: product?.name || 'Unknown',
        price: product?.offerPrice || product?.regularPrice || 0,
        image: product?.image || '',
        availability: product?.availability || 'Unknown'
      };
    });
  }
  calculateTotals() {
    this.totalPrice = this.wishlist.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    this.totalPrice = Math.round(this.totalPrice * 100) / 100; // Round to 2 decimal places

    this.totalQuantity = this.wishlist.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
  updateCartAfterChange(data: any) {
    this.wishlist = this.mergeWishlistAndProducts(data);
    this.calculateTotals();
  }
}
