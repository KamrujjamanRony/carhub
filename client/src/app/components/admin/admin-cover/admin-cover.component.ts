import { Component, input } from '@angular/core';

@Component({
  selector: 'app-admin-cover',
  imports: [],
  templateUrl: './admin-cover.component.html',
  styleUrl: './admin-cover.component.css'
})
export class AdminCoverComponent {
  readonly title = input<any>('');
  readonly sub1 = input<any>('');
  readonly sub2 = input<any>('');
}
