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

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
  encapsulation: ViewEncapsulation.None,
})
export class Employee implements OnInit {
  employeeService = inject(EmployeeService);

  employeeList: EmployeeList[] = [];

  deptList$: Observable<any[]> = new Observable<any[]>();

  roleList$: Observable<any[]> = new Observable<any[]>();

  @ViewChild('newModal') newModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;

  employeeObj: EmployeeModel = new EmployeeModel();

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
    this.employeeService.getAllEmployees().subscribe({
      next: (response: APIResponseModel) => {
        this.employeeList = response.data;
      },
      error: (error) => {
        error.message;
      },
    });
  }

  addEmployee() {
    this.employeeService.onAddEmployee(this.employeeObj).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.getEmployees();
          alert('Employee Created Successfully');
          this.closeModal();
        } else {
          res.message;
        }
      },
      error: () => {},
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

  private showModal(modal: ElementRef) {
    modal.nativeElement.classList.remove('hidden');
    modal.nativeElement.classList.add('flex');
  }

  // updateEmployee() {
  //   this.employeeService.onUpdateEmployee(this.employeeObj).subscribe({
  //     next: (res: any) => {
  //       if (res.result) {
  //         this.getEmployees();
  //         alert('Employee Updated Successfully');
  //       } else {
  //         res.message;
  //       }
  //     },
  //     error: () => {},
  //   });
  // }

  // updateEmployee() {
  //   const payload = {
  //     ...this.employeeObj,
  //     deptId: Number(this.employeeObj.deptId), // Ensure number type
  //   };

  //   this.employeeService.onUpdateEmployee(payload).subscribe({
  //     next: (res: any) => {
  //       if (res.result) {
  //         this.getEmployees(); // Refresh list
  //         this.closeModal('edit'); // Close edit modal specifically
  //         alert('Employee Updated Successfully');
  //       } else {
  //         alert(res.message || 'Update failed');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Update error:', err);
  //       alert(`Error: ${err.error?.message || 'Failed to update employee'}`);
  //     },
  //   });
  // }

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
}
