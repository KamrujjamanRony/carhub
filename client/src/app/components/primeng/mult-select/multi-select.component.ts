import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [FormsModule, MultiSelectModule],
  template: `
      <p-multiselect 
        [options]="options" 
        [(ngModel)]="selectedOptions" 
        optionLabel="name" 
        placeholder="Select Options" 
        [maxSelectedLabels]="4" >
      </p-multiselect>
  `,
})
export class MultiSelectComponent {
  @Input() options: any[] = [];  // Receive options dynamically from parent
  selectedOptions: any[] = [];
}
