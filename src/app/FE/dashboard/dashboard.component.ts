import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sidebarCollapsed = false;
  currentPage = 'Tổng quan';
  showUserDropdown = false;
  currentUser: any = null;
  
  pieChartData = { 
    labels: ['Chức năng', 'Mục tiêu', 'Tuân thủ'], 
    datasets: [{ data: [0.5, 0.3, 0.2] }] 
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Lấy thông tin người dùng từ AuthService
    this.currentUser = this.authService.getCurrentUser();
    console.log('Dashboard loaded with user:', this.currentUser);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userInfo = target.closest('.user-info');
    if (!userInfo) {
      this.showUserDropdown = false;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown() {
    this.showUserDropdown = false;
  }

  getUserDisplayName(): string {
    return this.currentUser?.fullName || this.currentUser?.username || 'Người dùng';
  }

  isPhoHieuTruong(): boolean {
    console.log('Current user in isPhoHieuTruong:', this.currentUser);
    console.log('Current user roles:', this.currentUser?.roles);
    
    
    const result = true; 
    console.log('isPhoHieuTruong result:', result);
    
    return result;
  }

  navigateToMyKpis(): void {
    this.currentPage = 'KPI được giao';
    console.log('Navigating to KPI được giao within dashboard');
  }

  navigateTo(page: string) {
    this.currentPage = page;
    console.log('Navigating to:', page);
    
    // Thêm logic chuyển hướng tùy theo page
    switch(page) {
      case 'Tổng quan':
        // Đã ở trang hiện tại
        break;
      case 'KPI Đơn vị':
        // Tạo route mới hoặc hiển thị component khác
        console.log('Chuyển đến trang KPI Đơn vị');
        break;
      case 'Tạo KPIs':
        console.log('Chuyển đến trang Tạo KPIs');
        break;
      case 'Báo cáo':
        console.log('Chuyển đến trang Báo cáo');
        break;
      case 'Cài đặt':
        console.log('Chuyển đến trang Cài đặt');
        break;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}