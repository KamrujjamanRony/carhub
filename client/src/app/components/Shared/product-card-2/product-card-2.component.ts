import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { WishListService } from '../../../services/user/wish-list.service';
import { CartService } from '../../../services/user/cart.service';
import { ToastService } from '../../primeng/toast/toast.service';
import { BdtPipe } from "../../../pipes/bdt.pipe";

@Component({
  selector: 'app-product-card-2',
  imports: [RouterLink, BdtPipe],
  templateUrl: './product-card-2.component.html',
  styleUrl: './product-card-2.component.css'
})
export class ProductCard2Component {
  authCookieService = inject(AuthCookieService);
  wishListService = inject(WishListService);
  cartService = inject(CartService);
  private toastService = inject(ToastService);
  router = inject(Router);
  @Input() product: any;
  user = this.authCookieService.getUserData();

  // Function to generate an array of stars based on average rating
  getStarsArray(averageRating: number): boolean[] {
    const roundedRating = Math.round(averageRating * 2) / 2;
    return Array.from({ length: 5 }, (_, index) => index < roundedRating);
  }

  getViewLink(id: any) {
    return `/view/${id}`;
  }

  addToCart(product: any) {
    console.log(product)
    const cartProduct = {
      id: crypto.randomUUID(),
      productId: product?.id,
      quantity: 1
    };

    if (this.user?.uid) {
      this.cartService.getCart(this.user.uid).subscribe({
        next: (cart) => {
          if (cart.length > 0) {
            // Get the first cart (assuming one cart per user)
            let userCart = { ...cart[0] };

            // Check if product exists in cart
            const existingProductIndex = userCart.products.findIndex(
              (p: any) => p.productId === cartProduct.productId
            );

            if (existingProductIndex !== -1) {
              // Product exists - increment quantity
              userCart.products[existingProductIndex].quantity += 1;
            } else {
              // Product doesn't exist - add new product
              userCart.products.push(cartProduct);
            }

            // Update the cart
            this.cartService.updateCart(userCart.id, userCart).subscribe({
              next: () => {
                // console.log('Cart updated successfully');
                // Optionally: this.router.navigateByUrl('user/shopping-cart');
              },
              error: (error) => {
                console.error('Error updating cart:', error);
              }
            });
          } else {
            // No cart exists - create new cart
            const newCart = {
              userId: this.user.uid,
              products: [cartProduct]
            };

            this.cartService.addCart(newCart).subscribe({
              next: () => {
                // console.log('New cart created successfully');
              },
              error: (error) => {
                console.error('Error creating cart:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error creating cart:', error);
        }
      });
    } else {
      console.error('User not logged in');
      // Optionally redirect to login
    }
  }

}
