import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/user/order.service';
import { BdtPipe } from "../../../pipes/bdt.pipe";
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { Auth } from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { UserOrderDetailsComponent } from "../../../components/Shared/user-order-details/user-order-details.component";

@Component({
  selector: 'app-user-order-history',
  standalone: true,
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.css'],
  providers: [DatePipe],
  imports: [
    CommonModule,
    BdtPipe,
    FontAwesomeModule,
    UserOrderDetailsComponent
  ]
})
export class UserOrderHistoryComponent implements OnInit {
  faEye = faEye;
  private orderService = inject(OrderService);
  private auth = inject(Auth);
  private toastService = inject(ToastService);
  private datePipe = inject(DatePipe);

  userId: string | null = null;
  orders = signal<any[]>([]);
  selectedOrder = signal<any>(null);
  showModal = false;
  isLoading = false;
  error = '';

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.userId = user?.uid ?? null;
      if (this.userId) {
        this.loadOrders();
      }
    });
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = '';
    if (!this.userId) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.orderService.getOrdersByUser(this.userId).subscribe({
      next: (response: any) => {
        // Transform the response to handle $values and status
        const orders = (response.$values || []).map((order: any) => ({
          ...order,
          orderItems: order.OrderItems?.$values || [],
          orderStatus: this.getStatusText(order.OrderStatus),
          shippingAddress: order.ShippingAddress
        }));

        this.orders.set(orders);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
        console.error('Error loading orders:', err);
        this.toastService.showMessage('error', 'Error', 'Failed to load orders');
      }
    });
  }

  private getStatusText(statusCode: number): string {
    const statusMap: Record<number, string> = {
      0: 'Pending',
      1: 'Processing',
      2: 'Shipped',
      3: 'Delivered',
      4: 'Cancelled'
    };
    return statusMap[statusCode] || 'Unknown';
  }

  viewOrderDetails(order: any) {
    // Transform the order data to match what OrderDetailsComponent expects
    const transformedOrder = {
      id: order.Id,
      userId: order.UserId,
      userEmail: order.UserEmail,
      userName: order.UserName,
      userPhone: order.UserPhone,
      subtotal: order.Subtotal,
      deliveryCharge: order.DeliveryCharge,
      totalAmount: order.TotalAmount,
      paymentMethod: order.PaymentMethod,
      orderStatus: order.orderStatus, // Already transformed to text
      orderDate: order.OrderDate,
      deliveredDate: order.DeliveredDate,
      orderItems: order.orderItems, // Already transformed
      shippingAddress: {
        district: order.ShippingAddress?.District,
        city: order.ShippingAddress?.City,
        street: order.ShippingAddress?.Street,
        contact: order.ShippingAddress?.Contact,
        type: order.ShippingAddress?.Type
      }
    };

    this.selectedOrder.set(transformedOrder);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedOrder.set(null);
  }
}