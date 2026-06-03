import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-modal',
    imports: [CommonModule],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnChanges {
  @Input() heading = '';
  @Input() description = '';
  @Input() isModalOpen = true;

  @Output() closeEvent = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['description'] && this.description) {
      this.openModal();
    }
  }

  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Disable scroll on body
  }

  closeModal(event: Event): void {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto'; // Enable scroll on body
    this.closeEvent.emit(); // Emit the close event
  }
}
