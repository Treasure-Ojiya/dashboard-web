import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatMenuTrigger,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  router = inject(Router);
  // vertebrates: MatMenuPanel<any> | null | undefined;
  logoutFn() {
    localStorage.removeItem('leaveUser');
    this.router.navigateByUrl('/login');
  }
}
