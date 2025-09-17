import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AbstractControl,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { LoginModel } from '../../model/Employee.model';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // loginObj: LoginModel = new LoginModel();
  loginFormObj: FormGroup;

  formBuilder = inject(FormBuilder);
  employeeService = inject(EmployeeService);
  router = inject(Router);

  // login messages
  loginSuccess: string = '';
  loginError: string = '';

  // Reactive Form
  constructor() {
    this.loginFormObj = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(8),
          this.passwordInputValidator,
        ],
      ],
    });
  }

  passwordInputValidator(control: AbstractControl): ValidationErrors | null {
    const passwordInput = control.value || '';
    return /^[0-9]+$/.test(passwordInput) ? null : { beNumbersOnly: true };
  }

  onLogin() {
    if (this.loginFormObj.invalid) {
      this.loginError = 'Please enter correct details';
      this.loginSuccess = '';
    }

    this.employeeService.onLogin(this.loginFormObj.value).subscribe({
      next: (result: any) => {
        if (result.result) {
          this.loginSuccess = 'Login Successful';
          this.loginError = '';
          localStorage.setItem('leaveUser', JSON.stringify(result.data));
          setTimeout(() => {
            this.router.navigateByUrl('/dashboard');
          }, 3000);
        } else {
          this.loginError = 'Login failed';
          this.loginSuccess = '';
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        // this.loginError = 'An error occurred during login. Please try again.';
        // this.loginSuccess = '';
      },
    });
  }

  // ngModel Login logic
  // onLogin() {
  //   if (!this.loginObj.emailId || !this.loginObj.password) {
  //     this.loginError = 'Please enter both email and password.';
  //     this.loginSuccess = '';
  //     return;
  //   }
  //   // if(!/\S+@\S+\.\S+/.test(this.loginObj.emailId)){
  //   if (
  //     !this.loginObj.emailId ||
  //     !this.loginObj.emailId.includes('@') ||
  //     !this.loginObj.emailId.includes('.')
  //   ) {
  //     this.loginError = 'Please enter a valid email';
  //     this.loginSuccess = '';
  //     return;
  //   }
  //   if (
  //     !this.loginObj.password ||
  //     this.loginObj.password.length < 6 ||
  //     this.loginObj.password.length > 8
  //   ) {
  //     this.loginError = 'Password must be between 6 and 8 characters.';
  //     this.loginSuccess = '';
  //     return;
  //   }
  //   if (/[a-zA-Z]/.test(this.loginObj.password)) {
  //     this.loginError = 'Password must be only numbers.';
  //     this.loginSuccess = '';
  //     return;
  //   }

  //   this.employeeService.onLogin(this.loginObj).subscribe({
  //     next: (result: any) => {
  //       if (result.result) {
  //         this.loginSuccess = 'Login successful!';
  //         this.loginError = '';
  //         localStorage.setItem('leaveUser', JSON.stringify(result.data));
  //         this.router.navigateByUrl('/dashboard');
  //       } else {
  //         this.loginError = 'Login failed';
  //       }
  //     },
  //     error: (error) => {
  //       console.error('API Error:', error);
  //       // this.loginError = 'An error occurred during login. Please try again.';
  //       // this.loginSuccess='';
  //     },
  //   });
  // }
}
