// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast-message/toast-component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if(message){
    <div
      class="fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white transition-opacity duration-500"
      [ngClass]="{
        'bg-green-600': type === 'success',
        'bg-red-600': type === 'error'
      }"
    >
      {{ message }}
    </div>
    }
  `,
})
export class ToastComponent implements OnInit {
  message: string = '';
  type: 'success' | 'error' = 'success';

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.message$.subscribe((msg) => (this.message = msg));
    this.toastService.type$.subscribe((tp) => (this.type = tp));
  }
}
