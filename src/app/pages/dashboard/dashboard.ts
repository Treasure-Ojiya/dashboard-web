import { Component, OnInit, inject } from '@angular/core';
import { EmployeeService } from '../../services/employee';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalEmployees: number = 0;
  totalLeaves: number = 0;
  totalDepartments: number = 0;
  totalRoles: number = 0;
  departmentList: any[] = [];
  roleList: any[] = [];

  employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.employeeSummary();
  }

  animateValue(
    start: number,
    end: number,
    duration: number,
    setter: (val: number) => void
  ) {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      setter(value);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  employeeSummary() {
    // Employees
    this.employeeService.getAllEmployees().subscribe({
      next: (response) => {
        if (response && response.result && response.data) {
          const endValue = response.data.length;
          this.animateValue(
            0,
            endValue,
            1000,
            (val) => (this.totalEmployees = val)
          );
        }
      },
      error: (error) => {
        console.log('Fetch employees error:', error.message);
      },
    });

    // Leaves
    this.employeeService.getAllLeaves().subscribe({
      next: (response) => {
        if (response && response.result && response.data) {
          const endValue = response.data.length;
          this.animateValue(
            0,
            endValue,
            1000,
            (val) => (this.totalLeaves = val)
          );
        }
      },
      error: (error) => {
        console.log('Fetch leaves error:', error.message);
      },
    });

    // Departments
    this.employeeService.getDepartment().subscribe({
      next: (response) => {
        this.totalDepartments = response.length; // service already maps .data
      },
      error: (error) => {
        console.log('Fetch departments error:', error.message);
      },
    });

    // Roles
    this.employeeService.getAllRoles().subscribe({
      next: (response) => {
        this.totalRoles = response.length; // service already maps .data
      },
      error: (error) => {
        console.log('Fetch roles error:', error.message);
      },
    });
  }
}
