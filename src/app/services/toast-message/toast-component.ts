// toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageSubject = new BehaviorSubject<string>('');
  private typeSubject = new BehaviorSubject<'success' | 'error'>('success');

  message$ = this.messageSubject.asObservable();
  type$ = this.typeSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    this.messageSubject.next(message);
    this.typeSubject.next(type);

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear() {
    this.messageSubject.next('');
  }
}
