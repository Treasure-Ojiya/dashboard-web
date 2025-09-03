import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APIResponseModel } from '../model/Employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  onLogin(obj: any) {
    return this.http.post(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/Login',
      obj
    );
  }

  getAllEmployees(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetEmployees'
    );
  }

  getAllLeaves(): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetAllLeaves'
    );
  }

  getDepartment() {
    return this.http
      .get(
        'https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetDepartments'
      )
      .pipe(map((response: any) => response.data));
  }

  getAllRoles() {
    return this.http
      .get('https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetAllRoles')
      .pipe(map((response: any) => response.data));
  }

  onAddEmployee(obj: any) {
    return this.http.post(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/CreateEmployee',
      obj
    );
  }

  onUpdateEmployee(obj: any): Observable<any> {
    return this.http.put(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/UpdateEmployee',
      obj
    );
  }

  onDeleteEmployee(employeeId: number) {
    return this.http.delete(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/DeleteEmployee/' +
        employeeId
    );
  }

  toAddLeave(obj: any) {
    return this.http.post(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/AddLeave',
      obj
    );
  }

  getAllLeavesByEmpId(empId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetAllLeavesByEmployeeId?id=' +
        empId
    );
  }

  getLeavesForApprovalBySuperviserId(
    supervisorId: number
  ): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/GetLeavesForApprovalBySuperwiserId?id' +
        supervisorId
    );
  }

  approveLeave(leaveId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/ApproveLeave?id=' +
        leaveId
    );
  }

  rejectLeave(leaveId: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(
      'https://freeapi.miniprojectideas.com/api/EmployeeLeave/RejectLeave?id=' +
        leaveId
    );
  }
}
