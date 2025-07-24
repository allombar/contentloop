import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Toast, ToastType } from '../models/toast.model';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
  @Input() toast!: Toast;
  @Output() dismissed = new EventEmitter<string>();

  show = false;

  ngOnInit(): void {
    setTimeout(() => (this.show = true), 10);
    setTimeout(() => this.close(), 5000);
  }

  close(): void {
    this.show = false;
    setTimeout(() => this.dismissed.emit(this.toast.id!), 500);
  }

  getToastClass(type: ToastType): string {
    switch (type) {
      case ToastType.Success:
        return 'bg-green-600 text-white';
      case ToastType.Info:
        return 'bg-blue-600 text-white';
      case ToastType.Error:
        return 'bg-red-600 text-white';
      case ToastType.Notification:
        return 'bg-stone-700 text-white';
      default:
        return 'bg-stone-800 text-white';
    }
  }
}
