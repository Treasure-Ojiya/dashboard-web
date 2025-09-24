import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    @if(showSpinner){
    <div
      class="absolute top-1/2 left-[55%]  flex items-center justify-center z-50"
    >
      <div
        class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
    }
  `,
})
export class Spinner implements OnChanges {
  @Input() loader: boolean = false;

  showSpinner = false;
  private minTime = 700; // minimum time spinner is visible (ms)
  private startTime = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loader']) {
      if (this.loader) {
        this.startTime = Date.now();
        this.showSpinner = true;
      } else {
        const elapsed = Date.now() - this.startTime;
        const remaining = this.minTime - elapsed;
        if (remaining > 0) {
          setTimeout(() => (this.showSpinner = false), remaining);
        } else {
          this.showSpinner = false;
        }
      }
    }
  }
}
