import { Component, OnInit } from '@angular/core';
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
  
  pieChartData = { 
    labels: ['Chức năng', 'Mục tiêu', 'Tuân thủ'], 
    datasets: [{ data: [0.5, 0.3, 0.2] }] 
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Mock data - không cần API call
    console.log('Dashboard loaded with mock data');
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  navigateTo(page: string) {
    this.currentPage = page;
    console.log('Navigati ng to:', page);
    
    // Thêm logic chuyển hướng tùy theo page
    switch(page) {
      case 'Tổng quan':
        // Đã ở trang hiện tại
        break;
      case 'KPI Đơn vị':
        // Tạo route mới hoặc hiển thị component khác
        console.log('Chuyển đến trang KPI Đơn vị');
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