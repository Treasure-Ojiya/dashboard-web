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
import { ToastService } from '../../services/toast-message/toast-component';

@Component({
  selector: 'app-leave',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './leave.html',
  styleUrl: './leave.css',
})
export class Leave implements OnInit {
  @ViewChild('newModal') newModal!: ElementRef;
  employeeService = inject(EmployeeService);
  toastService = inject(ToastService);
  successMessage: string = '';

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

    const loggedData = localStorage.getItem('leaveUser');
    if (loggedData != null) {
      const loggedParseData = JSON.parse(loggedData);
      formValue.employeeId = loggedParseData.employeeId;
    }

    this.employeeService.toAddLeave(formValue).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.loadLeaves();
          this.GetAllLeaves();
          this.leaveForm.reset();
          this.closeModal();

          // show toast
          this.toastService.show('Leave Applied Successfully', 'success');

          setTimeout(() => (this.successMessage = ''), 3000);
        } else {
          this.successMessage = res.message || 'Unable to add leave.';
          setTimeout(() => (this.successMessage = ''), 3000);
        }
      },
      error: () => {
        this.successMessage = 'Something went wrong. Please try again.';
        setTimeout(() => (this.successMessage = ''), 3000);
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
        this.loadLeaves();
      },
    });
  }

  rejectLeave(leaveId: number) {
    this.employeeService.rejectLeave(leaveId).subscribe({
      next: () => {
        this.GetAllLeaves();
        this.loadLeaves();
      },
    });
  }

  pageBreak = 10;
  startPage = 1;
  approvalPageBreak = 10;
  approvalStartPage = 1;

  get paginatedLeaves() {
    const begin = (this.startPage - 1) * this.pageBreak;
    return this.leaveList.slice(begin, begin + this.pageBreak);
  }

  get totalPages() {
    return Math.ceil(this.leaveList.length / this.pageBreak);
  }

  changePage(page: number) {
    this.startPage = page;
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.startPage;
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Approval pagination methods
  get paginatedApprovals() {
    const begin = (this.approvalStartPage - 1) * this.approvalPageBreak;
    return this.approvalLeaveList.slice(begin, begin + this.approvalPageBreak);
  }

  get approvalTotalPages() {
    return Math.ceil(this.approvalLeaveList.length / this.approvalPageBreak);
  }

  changeApprovalPage(page: number) {
    this.approvalStartPage = page;
  }

  get visibleApprovalPages(): number[] {
    const total = this.approvalTotalPages;
    const current = this.approvalStartPage;
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
