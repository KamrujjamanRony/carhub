import { Routes } from '@angular/router';
import { MainComponent } from './Layouts/main/main.component';
import { HomeComponent } from './Pages/main/home/home.component';
import { ShopComponent } from './Pages/main/shop/shop.component';
import { AboutUsComponent } from './Pages/main/about-us/about-us.component';
import { CheckoutComponent } from './Pages/user/checkout/checkout.component';
import { ContactUsComponent } from './Pages/main/contact-us/contact-us.component';
import { LoginComponent } from './Pages/main/login/login.component';
import { ProfileInfoComponent } from './Pages/user/profile-info/profile-info.component';
import { WishlistComponent } from './Pages/user/wishlist/wishlist.component';
import { ShoppingCartComponent } from './Pages/user/shopping-cart/shopping-cart.component';
import { UserDashboardComponent } from './Layouts/user-dashboard/user-dashboard.component';
import { ProductViewComponent } from './Pages/main/product-view/product-view.component';
import { UserCheckoutComponent } from './Pages/user/user-checkout/user-checkout.component';
import { RegisterComponent } from './Pages/main/register/register.component';
import { userGuard } from './services/user/user.guard';
import { UserAddressComponent } from './Pages/user/user-address/user-address.component';
import { PasswordResetComponent } from './Pages/user/password-reset/password-reset.component';
import { OrderConfirmationComponent } from './Pages/user/order-confirmation/order-confirmation.component';
import { UserOrderHistoryComponent } from './Pages/user/user-order-history/user-order-history.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'shop',
        component: ShopComponent
      },
      {
        path: 'shop/:category',
        component: ShopComponent
      },
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      {
        path: 'view/:id',
        component: ProductViewComponent
      },
      {
        path: 'user-checkout',
        component: UserCheckoutComponent
      },
      {
        path: 'order-confirmation',
        component: OrderConfirmationComponent,
        title: 'Order Confirmation'
      },
    ]
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [userGuard],
    children: [
      { path: '', redirectTo: 'profile-info', pathMatch: 'full' },
      {
        path: 'profile-info',
        component: ProfileInfoComponent, canActivate: [userGuard]
      },
      {
        path: 'user-address',
        component: UserAddressComponent, canActivate: [userGuard]
      },
      {
        path: 'my-orders',
        component: UserOrderHistoryComponent, canActivate: [userGuard]
      },
      {
        path: 'wishlist',
        component: WishlistComponent, canActivate: [userGuard]
      },
      {
        path: 'shopping-cart',
        component: ShoppingCartComponent, canActivate: [userGuard]
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'change-password',
    component: PasswordResetComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];
