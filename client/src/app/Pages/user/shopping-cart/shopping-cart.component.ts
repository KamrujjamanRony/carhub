import { Component, inject } from '@angular/core';
import { SingleCartComponent } from '../../../components/Shared/single-cart/single-cart.component';
import { CartService } from '../../../services/user/cart.service';
import { Auth } from '@angular/fire/auth';
import { ProductService } from '../../../services/product.service';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BdtPipe } from "../../../pipes/bdt.pipe";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [SingleCartComponent, CommonModule, BdtPipe],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  cartService = inject(CartService);
  productService = inject(ProductService);
  authCookieService = inject(AuthCookieService);
  router = inject(Router);
  private auth = inject(Auth);

  carts: any[] = [];
  userCarts: any[] = [];
  products: any[] = [];
  user: any;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  // totalPriceWithDelivery: number = 0;

  ngOnInit() {
    this.loadCart();

    // Subscribe to cart updates
    this.cartService.cartUpdated$.subscribe(() => {
      this.loadCart(); // Refresh cart whenever it updates
    });
  }

  sortedCarts(carts: any[]): any[] {
    // Replace this with your actual sorting logic
    return carts?.slice().sort((a, b) => a.productId - b.productId) || [];
  }


  loadCart() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;

      this.productService.getProducts().subscribe((productData) => {
        this.products = productData;

        this.cartService.getCart(this.user?.uid).subscribe((cartData) => {
          if (!cartData) {
            return;
          }
          this.userCarts = cartData[0];
          this.carts = this.mergeCartAndProducts(cartData[0]?.products || []);
          this.calculateTotals();
        });
      });
    });
  }

  // Merge cart items with product data
  mergeCartAndProducts(cartItems: any[]) {
    return cartItems.map((cartItem) => {
      const product = this.products.find((p) => p.id == cartItem.productId);

      return {
        id: cartItem.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        selectColor: cartItem.selectColor,
        selectSize: cartItem.selectSize,
        date: cartItem.date,
        productName: product?.name || 'Unknown',
        price: product?.offerPrice || product?.regularPrice || 0,
        image: product?.image || '',
        category: product?.category || 'Unknown',
        brand: product?.brand || 'Unknown',
      };
    });
  }

  // calculateTotals() {
  //   this.totalPrice = this.carts.reduce((total, item) => {
  //     return total + item.price * item.quantity;
  //   }, 0);

  //   this.totalPrice = Math.round(this.totalPrice * 100) / 100; // Round to 2 decimal places

  //   this.totalQuantity = this.carts.reduce((total, item) => {
  //     return total + item.quantity;
  //   }, 0);
  // }

  updateCartAfterChange(updatedCarts: any) {
    this.carts = this.mergeCartAndProducts(updatedCarts);
    this.calculateTotals();
  }
  calculateTotals() {
    this.totalPrice = this.carts.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    this.totalPrice = Math.round(this.totalPrice * 100) / 100;
    // this.totalPriceWithDelivery = this.totalPrice + this.deliveryCharge;
    // this.totalPriceWithDelivery = Math.round(this.totalPriceWithDelivery * 100) / 100;

    this.totalQuantity = this.carts.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  // proceedToCheckout() {
  //   // Navigate to checkout page with cart data
  //   const orderData = {
  //     products: this.carts,
  //     subtotal: this.totalPrice,
  //     deliveryCharge: this.deliveryCharge,
  //     total: this.totalPriceWithDelivery,
  //     quantity: this.totalQuantity
  //   };
  //   // You can use a service or router to pass this data to the order page
  //   this.router.navigate(['/checkout'], { state: { orderData } });
  // }

  proceedToCheckout() {
    if (this.carts.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const orderData = {
      products: this.carts,
      subtotal: this.totalPrice,
      // deliveryCharge: this.deliveryCharge,
      // total: this.totalPriceWithDelivery,
      quantity: this.totalQuantity
    };

    // Navigate with state
    this.router.navigate(['/checkout'], {
      state: { orderData }
    });
  }
}
