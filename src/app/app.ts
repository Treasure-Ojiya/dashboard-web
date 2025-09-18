import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  RouterOutlet,
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  // templateUrl: './app.html',
  template: `
    <div
      [ngClass]="fade ? 'opacity-100' : 'opacity-0'"
      class="transition-opacity duration-700 ease-in-out"
    >
      <router-outlet />
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Employee-Dashboard');

  fade = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.fade = false; // start fade-out
      }
      if (event instanceof NavigationEnd) {
        setTimeout(() => (this.fade = true), 50); // trigger fade-in
      }
    });
  }
}
