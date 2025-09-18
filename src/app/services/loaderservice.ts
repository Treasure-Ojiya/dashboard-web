import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Loaderservice {
  private loadBehavior = new BehaviorSubject<boolean>(false);
  loadBehavior$ = this.loadBehavior.asObservable();

  load() {
    this.loadBehavior.next(true);
  }

  loadStop() {
    this.loadBehavior.next(false);
  }
}
