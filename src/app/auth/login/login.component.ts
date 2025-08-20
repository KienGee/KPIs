import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      // For now, just stay on login page since dashboard doesn't exist yet
      console.log('User already authenticated');
    }
  }

  onSubmit(): void {
    console.log('Form submitted!');
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form value:', this.loginForm.value);
    console.log('Submitting:', this.submitting);
    
    if (this.loginForm.valid && !this.submitting) {
      this.submitting = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;
      console.log('Attempting login with:', credentials);
      
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          this.submitting = false;
          console.log('Login successful:', response);
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          this.submitting = false;
          this.errorMessage = error.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        }
      });
    }
  }

  focusPassword(): void {
    const passwordField = document.getElementById('password');
    if (passwordField) {
      passwordField.focus();
    }
  }

  testLogin(): void {
    console.log('Test login clicked!');
    this.submitting = true;
    this.errorMessage = '';

    const testCredentials = {
      username: 'test',
      password: 'test'
    };

    this.authService.login(testCredentials).subscribe({
      next: (response: any) => {
        this.submitting = false;
        console.log('Test login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.submitting = false;
        console.error('Test login error:', error);
        this.errorMessage = 'Test login failed: ' + error.message;
      }
    });
  }
}