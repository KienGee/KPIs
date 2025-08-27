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
  registerForm: FormGroup;
  submitting = false;
  registerSubmitting = false;
  errorMessage = '';
  registerErrorMessage = '';
  registerSuccessMessage = '';
  showRegister = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]] // Email bắt buộc và phải đúng format
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      // For now, just stay on login page since dashboard doesn't exist yet
      console.log('User already authenticated');
    }

    // Clear error message when user starts typing
    this.loginForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
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
          console.error('Login error:', error);
          
          // Handle specific error messages
          if (error.status === 401) {
            this.errorMessage = error.error?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.';
          } else if (error.status === 500) {
            this.errorMessage = error.error?.message || 'Lỗi hệ thống. Vui lòng thử lại sau.';
          } else if (error.status === 0) {
            this.errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
          } else {
            this.errorMessage = error.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
          }
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

  showRegisterForm(): void {
    this.showRegister = true;
    this.registerErrorMessage = '';
    this.registerSuccessMessage = '';
    this.registerForm.reset();
  }

  hideRegisterForm(): void {
    this.showRegister = false;
    this.registerErrorMessage = '';
    this.registerSuccessMessage = '';
    this.registerForm.reset();
  }

  onRegister(): void {
    if (this.registerForm.valid && !this.registerSubmitting) {
      this.registerSubmitting = true;
      this.registerErrorMessage = '';
      this.registerSuccessMessage = '';

      const userData = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email || null,
        departmentId: 1, // Ban Giám hiệu
        jobTitle: 'Phó Hiệu trưởng'
      };

      console.log('Registering user:', userData);

      this.authService.register(userData).subscribe({
        next: (response: any) => {
          this.registerSubmitting = false;
          console.log('Registration successful:', response);
          this.registerSuccessMessage = 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.';
          
          // Auto fill login form with new user credentials
          this.loginForm.patchValue({
            username: userData.username,
            password: userData.password
          });

          // Hide register form after 2 seconds
          setTimeout(() => {
            this.hideRegisterForm();
          }, 2000);
        },
        error: (error: any) => {
          this.registerSubmitting = false;
          console.error('Registration error:', error);
          this.registerErrorMessage = error.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        }
      });
    }
  }
}