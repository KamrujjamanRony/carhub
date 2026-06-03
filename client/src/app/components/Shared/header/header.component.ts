import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/user/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartService = inject(CartService);

  carts: any;

  ngOnInit() {
    this.cartService.getAllCarts().subscribe(data => {
      this.carts = data;
    });
  }

}
