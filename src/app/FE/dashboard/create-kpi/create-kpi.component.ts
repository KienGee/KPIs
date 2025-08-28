import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

interface CreateKpiDto {
  kpiName: string;
  description: string;
  kpiType: string;
  measurementUnit: string;
}

interface KpiResponseDto {
  kpiId: number;
  kpiName: string;
  description: string;
  kpiType: string;
  measurementUnit: string;
}

@Component({
  selector: 'app-create-kpi',
  templateUrl: './create-kpi.component.html',
  styleUrls: ['./create-kpi.component.css'],
})
export class CreateKpiComponent {
  kpiName = '';
  description = '';
  kpiType = '';
  measurementUnit = '';
  isLoading = false;

  private baseUrl = 'http://localhost:5197/api/kpi';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  OnSubmit() {
    if (!this.kpiName.trim()) {
      alert('🚨 Vui lòng nhập tên KPI!');
      return;
    }

    if (!this.kpiType) {
      alert('🚨 Vui lòng chọn loại KPI!');
      return;
    }

    if (!this.measurementUnit) {
      alert('🚨 Vui lòng chọn đơn vị đo lường!');
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Debug: Check authentication
    const token = this.authService.getToken();
    console.log('Current token:', token ? 'Token exists' : 'No token');
    console.log('Is authenticated:', this.authService.isAuthenticated());

    const kpiData: CreateKpiDto = {
      kpiName: this.kpiName.trim(),
      description: this.description.trim(),
      kpiType: this.kpiType,
      measurementUnit: this.measurementUnit,
    };

    console.log('Sending KPI data:', kpiData);

    this.createKpi(kpiData).subscribe({
      next: (res: KpiResponseDto) => {
        console.log('KPI created successfully:', res);
        this.isLoading = false;
        this.resetForm();
        
        // Show success message with better formatting
        alert(`✅ Thành công!\n\nKPI "${res.kpiName}" đã được tạo thành công!\n\n📊 Loại: ${this.kpiType}\n📏 Đơn vị: ${this.measurementUnit}`);
      },
      error: (err: any) => {
        console.error('Error creating KPI:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        this.isLoading = false;
        
        if (err.status === 401) {
          alert('🔒 Phiên đăng nhập đã hết hạn.\nVui lòng đăng nhập lại!');
          this.authService.logout();
          window.location.href = '/login';
        } else if (err.status === 400) {
          alert('❌ Dữ liệu không hợp lệ.\nVui lòng kiểm tra lại thông tin!');
        } else if (err.status === 500) {
          alert('⚠️ Lỗi hệ thống.\nVui lòng thử lại sau!');
        } else {
          alert('❌ Có lỗi xảy ra khi tạo KPI!\nVui lòng thử lại.');
        }
      },
    });
  }

  private createKpi(data: CreateKpiDto): Observable<KpiResponseDto> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<KpiResponseDto>(`${this.baseUrl}/create-with-dto`, data, { headers });
  }

  private resetForm() {
    this.kpiName = '';
    this.description = '';
    this.kpiType = '';
    this.measurementUnit = '';
  }
}