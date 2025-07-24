import { Component, inject } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toaster',
  imports: [ToastComponent],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
})
export class ToasterComponent {
  toastService = inject(ToastService);
  readonly toasts = this.toastService.getToasts();

  onDismiss(id: string) {
    this.toastService.dismiss(id);
  }
}
