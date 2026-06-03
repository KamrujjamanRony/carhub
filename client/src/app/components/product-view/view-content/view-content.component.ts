import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-content',
  imports: [],
  templateUrl: './view-content.component.html',
  styleUrl: './view-content.component.css'
})
export class ViewContentComponent {
  @Input() product: any;

}
