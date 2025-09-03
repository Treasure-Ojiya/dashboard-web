import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-leave',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './leave.html',
  styleUrl: './leave.css',
})
export class Leave implements OnInit {
  @ViewChild('newModal') newModal!: ElementRef;
  employeeService = inject(EmployeeService);

  leaveForm: FormGroup = new FormGroup({
    leaveId: new FormControl(0),
    employeeId: new FormControl(0),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    noOfDays: new FormControl(''),
    leaveType: new FormControl(''),
    details: new FormControl(''),
    isApproved: new FormControl(false),
    approvedDate: new FormControl(null),
  });

  leaveList: any[] = [];
  isSubmitting: boolean | undefined;
  constructor() {
    const loggedData = localStorage.getItem('leaveUser');
    if (loggedData != null) {
      const loggedParseData = JSON.parse(loggedData);
      this.leaveForm.controls['employeeId'].setValue(
        loggedParseData.employeeId
      );
    }
  }

  ngOnInit(): void {
    this.loadLeaves();
    this.GetAllLeaves();
  }

  openModal() {
    if (this.newModal) {
      this.newModal.nativeElement.style.display = 'block';
    }
  }

  closeModal() {
    if (this.newModal) {
      this.newModal.nativeElement.style.display = 'none';
    }
  }

  loadLeaves() {
    const empId = this.leaveForm.controls['employeeId'].value;
    if (!empId) return;

    this.employeeService.getAllLeavesByEmpId(empId).subscribe({
      next: (result: any) => {
        this.leaveList = result.data || [];
      },
    });
  }

  onSave() {
    const formValue = this.leaveForm.value;

    if (formValue.fromDate && formValue.toDate) {
      const from = new Date(formValue.fromDate);
      const to = new Date(formValue.toDate);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      formValue.noOfDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    this.employeeService.toAddLeave(formValue).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.loadLeaves();
          this.leaveForm.reset();
          this.closeModal();
          alert('Leave added successfully!');
        } else {
          alert(res.message || 'Unable to add leave.');
        }
      },
      error: () => {
        alert('Something went wrong. Please try again.');
      },
    });
  }

  approvalLeaveList: any[] = [];
  currentTab: string = 'allLeaves';
  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  GetAllLeaves() {
    this.employeeService.getAllLeaves().subscribe({
      next: (result: any) => {
        this.approvalLeaveList =
          result.data.filter((m: any) => m.isApproved == null) || [];
      },
    });
  }

  approveLeave(leaveId: number) {
    this.employeeService.approveLeave(leaveId).subscribe({
      next: () => {
        this.GetAllLeaves();
      },
    });
  }

  rejectLeave(leaveId: number) {
    this.employeeService.rejectLeave(leaveId).subscribe({
      next: () => {
        this.GetAllLeaves();
      },
    });
  }
}
