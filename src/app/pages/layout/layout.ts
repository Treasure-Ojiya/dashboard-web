import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event,
} from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Spinner } from '../../spinner/spinner';
import { Loaderservice } from '../../services/loaderservice';
import { Subscription } from 'rxjs';
import { ToastComponent } from '../../toast-message/toast-message';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    // MatMenuTrigger,
    Spinner,
    ToastComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit, OnDestroy {
  private router = inject(Router);
  private loaderService = inject(Loaderservice);

  loader: boolean = false;
  private subscription = new Subscription();

  ngOnInit() {
    // subscribe to loader state from service
    this.subscription.add(
      this.loaderService.loadBehavior$.subscribe((val) => (this.loader = val))
    );

    // show loader automatically on route change
    this.subscription.add(
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          this.loaderService.load();
        }
        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          setTimeout(() => this.loaderService.loadStop(), 500); // fade delay
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logoutFn() {
    localStorage.removeItem('leaveUser');
    this.router.navigateByUrl('/login');
  }
}
