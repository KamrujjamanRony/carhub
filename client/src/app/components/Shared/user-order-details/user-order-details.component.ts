import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BdtPipe } from '../../../pipes/bdt.pipe';

@Component({
  selector: 'app-user-order-details',
  imports: [CommonModule, DatePipe, BdtPipe],
  templateUrl: './user-order-details.component.html',
  styleUrl: './user-order-details.component.css'
})
export class UserOrderDetailsComponent {
  @Input() order: any;

}
