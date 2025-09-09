import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  // dropdown states
  // isReportsOpen = false;
  // isSettingsOpen = false;

  // // sidebar state
  // isSidebarOpen = false;

  // toggleReports() {
  //   this.isReportsOpen = !this.isReportsOpen;
  // }

  // toggleSettings() {
  //   this.isSettingsOpen = !this.isSettingsOpen;
  // }

  // toggleSidebar() {
  //   this.isSidebarOpen = !this.isSidebarOpen;
  // }

  // closeSidebar() {
  //   this.isSidebarOpen = false;
  // }

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  router = inject(Router);
  logoutFn() {
    localStorage.removeItem('leaveUser');
    this.router.navigateByUrl('/login');
  }
}
