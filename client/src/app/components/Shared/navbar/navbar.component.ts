import { Auth } from '@angular/fire/auth';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../../services/user/cart.service';
import { WishListService } from '../../../services/user/wish-list.service';
import { AuthService } from '../../../services/user/auth.service';
import { CategoryService } from '../../../services/admin/category.service';
import { ProductService } from '../../../services/product.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  wishListService = inject(WishListService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  private CategoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private router = inject(Router);

  categories: any[] = [];
  productList = signal<any[]>([]);
  searchControl = new FormControl();
  searchResults = signal<any[]>([]);
  showSearchResults = signal(false);

  totalCarts = signal<number>(0);
  totalWishlists = signal<number>(0);
  user: any;
  category: string = 'all';

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
      if (this.user?.uid) {
        this.fetchUserCart();
        this.fetchWishList();
      }
    });

    // Listen for cart updates
    this.cartService.cartUpdated$.subscribe(() => {
      this.fetchUserCart();
    });

    // Listen for wishlist updates
    this.wishListService.wishlistUpdated$.subscribe(() => {
      this.fetchWishList();
    });

    // Fetch categories
    this.CategoryService.getCategory().subscribe(data => {
      this.categories = data;
    });

    // Fetch product list
    this.productService.getProducts().subscribe(data => {
      this.productList.set(data);
      this.cdr.detectChanges();
    });

    // Setup search functionality
    this.setupSearch();
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          if (!term || term.length < 2) {
            this.showSearchResults.set(false);
            return of([]);
          }
          return of(this.filterProducts(term));
        })
      )
      .subscribe(results => {
        this.searchResults.set(results);
        this.showSearchResults.set(results.length > 0);
      });
  }

  filterProducts(term: string): any[] {
    const lowerTerm = term.toLowerCase();
    return this.productList().filter(product =>
      product.name.toLowerCase().includes(lowerTerm) ||
      product.category.toLowerCase().includes(lowerTerm) ||
      product.brand.toLowerCase().includes(lowerTerm)
    );
  }

  onSearchFocus() {
    if (this.searchControl.value && this.searchControl.value.length >= 2) {
      this.showSearchResults.set(true);
    }
  }

  onSearchBlur() {
    setTimeout(() => {
      this.showSearchResults.set(false);
    }, 200);
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/view', productId]);
    this.searchControl.reset();
    this.showSearchResults.set(false);
  }

  performSearch() {
    const term = this.searchControl.value;
    if (term && term.length >= 2) {
      this.router.navigate(['/shop'], { queryParams: { search: term } });
      this.searchControl.reset();
      this.showSearchResults.set(false);
    }
  }

  fetchUserCart() {
    if (!this.user?.uid) {
      this.totalCarts.set(0);
      return;
    }
    this.cartService.getCart(this.user?.uid).subscribe(data => {
      this.totalCarts.set(data?.length > 0 ? data[0].products.reduce((sum: number, p: { quantity: any; }) => sum + p.quantity, 0) : 0);
      this.cdr.detectChanges();
    });
  }

  fetchWishList() {
    if (!this.user?.uid) {
      this.totalWishlists.set(0);
      return;
    }
    this.wishListService.getWishlist(this.user?.uid).subscribe(data => {
      this.totalWishlists.set(data?.length > 0 ? data[0].products.length : 0);
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
  }
}