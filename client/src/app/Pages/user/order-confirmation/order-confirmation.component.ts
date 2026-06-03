// order-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/user/order.service';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { BdtPipe } from "../../../pipes/bdt.pipe";

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, BdtPipe],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string | null = null;
  orderDetails: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    // Get order ID from route state or URL
    this.orderId = history.state?.orderId || this.route.snapshot.paramMap.get('id');

    if (!this.orderId) {
      this.toastService.showMessage('error', 'Error', 'No order ID provided');
      this.router.navigate(['/']);
      return;
    }

    this.loadOrderDetails();
  }

  loadOrderDetails() {
    this.orderService.getOrderById(this.orderId!).subscribe({
      next: (order) => {
        this.orderDetails = order;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showMessage('error', 'Error', 'Failed to load order details');
        console.error('Error loading order:', error);
        this.router.navigate(['/']);
      }
    });
  }

  getOrderStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Processing';
      case 2: return 'Shipped';
      case 3: return 'Delivered';
      case 4: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }
}
































// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-order-confirmation',
//   imports: [CommonModule],
//   templateUrl: './order-confirmation.component.html',
//   styleUrls: ['./order-confirmation.component.css']
// })
// export class OrderConfirmationComponent {
//   orderId: string | null = null;

//   constructor(private router: Router) {
//     const navigation = this.router.getCurrentNavigation();
//     this.orderId = navigation?.extras.state?.['orderId'];
//   }
// }