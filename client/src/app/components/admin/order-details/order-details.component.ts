import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BdtPipe } from '../../../pipes/bdt.pipe';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, DatePipe, BdtPipe],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  @Input() order: any;

}
