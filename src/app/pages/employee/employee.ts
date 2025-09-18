import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { EmployeeService } from '../../services/employee';
import {
  APIResponseModel,
  EmployeeList,
  EmployeeModel,
} from '../../model/Employee.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Spinner } from '../../spinner/spinner';
import { ToastService } from '../../services/toast-message/toast-component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule, Spinner],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
  encapsulation: ViewEncapsulation.None,
})
export class Employee implements OnInit {
  employeeService = inject(EmployeeService);
  toastService = inject(ToastService);

  employeeList: EmployeeList[] = [];

  deptList$: Observable<any[]> = new Observable<any[]>();

  roleList$: Observable<any[]> = new Observable<any[]>();

  @ViewChild('newModal') newModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;

  employeeObj: EmployeeModel = new EmployeeModel();
  Math: any;
  addSuccess: string = '';
  addError: string = '';
  loader = false;

  openModal() {
    if (this.newModal) {
      this.newModal.nativeElement.style.display = 'block';
    }
  }

  closeModal(modalType: 'add' | 'edit' = 'add') {
    const modal = modalType === 'add' ? this.newModal : this.editModal;
    modal.nativeElement.style.display = 'none';

    // Reset form if closing edit modal
    if (modalType === 'edit') {
      this.isEditMode = false;
      this.employeeObj = new EmployeeModel();
    }
  }

  ngOnInit(): void {
    this.getEmployees();
    this.deptList$ = this.employeeService.getDepartment();
    this.roleList$ = this.employeeService.getAllRoles();
  }

  getEmployees() {
    this.loader = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (response: APIResponseModel) => {
        this.employeeList = [...response.data];
        this.loader = false;
      },
      error: (error) => {
        console.error('Fetch employees error:', error.message);
        this.loader = false;
      },
    });
  }

  addEmployee() {
    this.loader = true; // show spinner if desired
    this.addSuccess = '';
    this.addError = '';

    this.employeeService.onAddEmployee(this.employeeObj).subscribe({
      next: (res: any) => {
        this.loader = false;

        if (res.result) {
          this.getEmployees();
          this.toastService.show('Empployee added successfully!', 'success');
          this.closeModal();

          // auto-hide success message after 3 seconds
          setTimeout(() => {
            this.addSuccess = '';
          }, 3000);
        } else {
          this.addError = res.message || 'Failed to create employee';
        }
      },
      error: (err) => {
        this.loader = false;
        this.addError = err.error?.message || 'Failed to create employee';
      },
    });
  }

  isEditMode: boolean = false;

  openEditModal(employeeEdit: EmployeeList) {
    this.isEditMode = true;

    this.employeeObj = {
      employeeId: employeeEdit.employeeId,
      employeeName: employeeEdit.employeeName,
      contactNo: employeeEdit.contactNo,
      emailId: employeeEdit.emailId,
      deptId: employeeEdit.deptId.toString(), // Explicit conversion to string
      role: employeeEdit.role,
      // Add other fields as needed
      gender: '', // Default value or get from API if available
      password: '', // Typically you wouldn't pre-fill passwords in edit forms
    };

    this.showModal(this.editModal);
  }

  deleteEmployee(employeeId: number) {
    this.employeeService.onDeleteEmployee(employeeId).subscribe({
      next: () => {
        // ✅ Remove locally so UI updates instantly
        this.employeeList = this.employeeList.filter(
          (emp) => emp.employeeId !== employeeId
        );

        // ✅ Refresh from API to stay in sync
        // this.getEmployees();

        // ✅ Adjust pagination in case the page became empty
        if (this.startPage > this.totalPages) {
          this.startPage = this.totalPages || 1;
        }

        this.toastService.show('Employee Deleted Successfully', 'success');
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.toastService.show(
          `Error: ${err.error?.message || 'Failed to delete employee'}`,
          'error'
        );
      },
    });
  }

  private showModal(modal: ElementRef) {
    modal.nativeElement.classList.remove('hidden');
    modal.nativeElement.classList.add('flex');
  }

  updateEmployee() {
    // Convert string deptId back to number for the API payload
    const payload = {
      ...this.employeeObj,
      deptId: Number(this.employeeObj.deptId), // Convert to number
      employeeId: Number(this.employeeObj.employeeId),
    };

    this.employeeService.onUpdateEmployee(payload).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.getEmployees();
          this.closeModal('edit');
          alert('Employee Updated Successfully');
        } else {
          alert(res.message || 'Update failed');
        }
      },
      error: (err) => {
        console.error('Update error:', err);
        alert(`Error: ${err.error?.message || 'Failed to update employee'}`);
      },
    });
  }

  pageBreak = 10;
  startPage = 1;

  get paginatedEmployees() {
    const begin = (this.startPage - 1) * this.pageBreak;
    return this.employeeList.slice(begin, begin + this.pageBreak);
  }

  get totalPages() {
    return Math.ceil(this.employeeList.length / this.pageBreak);
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
}
