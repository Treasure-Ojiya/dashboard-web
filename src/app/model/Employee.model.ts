export class LoginModel {
  emailId: string;
  password: string;

  constructor() {
    this.emailId = '';
    this.password = '';
  }
}

export interface APIResponseModel {
  message: string;
  result: boolean;
  data: any;
}

export interface EmployeeList {
  employeeId: number;
  employeeName: string;
  deptId: number;
  deptName: string;
  contactNo: string;
  emailId: string;
  role: string;
  password: string;
  gender: string;
}

export class EmployeeModel {
  employeeId: number;
  employeeName: string;
  contactNo: string;
  emailId: string;
  deptId: string; // Changed from string to number
  password?: string;
  gender?: string;
  role: string;

  constructor() {
    this.contactNo = '';
    this.deptId = '';
    this.emailId = '';
    this.employeeId = 0;
    this.employeeName = '';
    this.gender = '';
    this.password = '';
    this.role = '';
  }
}
