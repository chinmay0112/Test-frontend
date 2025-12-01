import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() primaryActionLabel = 'OK';
  @Input() showCloseButton = true;

  @Output() primaryAction = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onPrimaryAction() {
    this.primaryAction.emit();
  }

  onClose() {
    this.close.emit();
  }
}
