import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { KpiService, Kpi } from '../../../shared/services/kpi.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-unit-kpi-view',
  templateUrl: './unit-kpi-view.component.html',
  styleUrls: ['./unit-kpi-view.component.css']
})
export class UnitKpiViewComponent implements OnInit {
  @Output() navigateToCreate = new EventEmitter<void>();
  
  selectedUnit: number = 1;
  kpis: Kpi[] = [];
  isLoading: boolean = false;
  currentUserId: number | null = null;



  aiInsights: string = '';

  // Table data sources
  functionDataSource = new MatTableDataSource<any>([]);
  targetDataSource = new MatTableDataSource<any>([]);
  complianceDataSource = new MatTableDataSource<any>([]);

  // Column definitions for each table - bỏ cột STT, thêm measurement_unit
  functionColumns = ['indicator', 'formula', 'measurementUnit', 'createdDate'];
  targetColumns = ['indicator', 'formula', 'measurementUnit', 'createdDate'];
  complianceColumns = ['indicator', 'formula', 'measurementUnit', 'createdDate'];

  constructor(
    private kpiService: KpiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('=== UnitKpiViewComponent ngOnInit ===');
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Is user data complete:', this.authService.isUserDataComplete());
    
    this.currentUserId = this.authService.getCurrentUserId();
    console.log('Current User ID:', this.currentUserId);
    console.log('Current User:', this.authService.getCurrentUser());
    console.log('localStorage user_info:', localStorage.getItem('user_info'));
    
    this.loadKpis();
  }

  // Calculated totals
  get totalFunction(): number {
    return this.functionDataSource.data.length > 0 
      ? this.functionDataSource.data.reduce((sum: number, item: any) => sum + item.score, 0) / this.functionDataSource.data.length
      : 0;
  }

  get totalTarget(): number {
    return this.targetDataSource.data.length > 0
      ? this.targetDataSource.data.reduce((sum: number, item: any) => sum + item.score, 0) / this.targetDataSource.data.length
      : 0;
  }

  get totalCompliance(): number {
    return this.complianceDataSource.data.length > 0
      ? this.complianceDataSource.data.reduce((sum: number, item: any) => sum + item.score, 0) / this.complianceDataSource.data.length
      : 0;
  }

  loadKpis() {
    if (!this.currentUserId) {
      console.error('User not logged in or userId not available');
      console.log('User info from localStorage:', localStorage.getItem('user_info'));
      
      // Try to get user info from localStorage directly
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        console.log('Parsed user info:', user);
        if (user.userId) {
          this.currentUserId = user.userId;
        } else {
          // User info doesn't have userId, need to re-login
          console.warn('User info missing userId, please re-login');
          return;
        }
      } else {
        console.warn('No user info found, please login');
        return;
      }
    }

    this.isLoading = true;
    console.log('Loading KPIs for user:', this.currentUserId);
    
    this.kpiService.getKpisByCreatedUser(this.currentUserId!).subscribe({
      next: (kpis) => {
        this.kpis = kpis;
        this.organizeKpisByType();
        this.isLoading = false;
        console.log('Loaded KPIs:', kpis);
      },
      error: (error) => {
        console.error('Error loading KPIs:', error);
        this.isLoading = false;
        // Fall back to empty arrays
        this.functionDataSource.data = [];
        this.targetDataSource.data = [];
        this.complianceDataSource.data = [];
      }
    });
  }

  organizeKpisByType() {
    // Organize KPIs by type into table data
    const functionKpis: any[] = [];
    const targetKpis: any[] = [];
    const complianceKpis: any[] = [];

    console.log('=== Organizing KPIs by Type ===');
    console.log('Total KPIs to process:', this.kpis.length);

    this.kpis.forEach((kpi, index) => {
      console.log(`KPI ${index + 1}: ${kpi.kpiName} - Type: "${kpi.kpiType}"`);
      
      const tableRow = {
        indicator: kpi.kpiName,
        formula: kpi.description || 'Chưa có mô tả', // Use description as formula/method
        measurementUnit: kpi.measurementUnit || 'Chưa xác định',
        createdDate: kpi.createdDate ? new Date(kpi.createdDate).toLocaleDateString('vi-VN') : 'N/A'
      };

      switch (kpi.kpiType?.toLowerCase()) {
        case 'functional':
        case 'chuc nang':
        case 'chức năng':
          console.log(`-> Adding to Function KPIs`);
          functionKpis.push(tableRow);
          break;
        case 'objective':
        case 'muc tieu':
        case 'mục tiêu':
          console.log(`-> Adding to Target KPIs`);
          targetKpis.push(tableRow);
          break;
        case 'discipline':
        case 'tuan thu':
        case 'tuân thủ':
          console.log(`-> Adding to Compliance KPIs`);
          complianceKpis.push(tableRow);
          break;
        default:
          console.log('Unknown KPI type:', kpi.kpiType, '-> Adding to Function KPIs');
          // If no type specified, add to functional
          functionKpis.push(tableRow);
      }
    });

    console.log('Final counts:');
    console.log('Function KPIs:', functionKpis.length);
    console.log('Target KPIs:', targetKpis.length);
    console.log('Compliance KPIs:', complianceKpis.length);

    this.functionDataSource.data = functionKpis;
    this.targetDataSource.data = targetKpis;
    this.complianceDataSource.data = complianceKpis;
  }

  navigateToCreateKpi(): void {
    this.navigateToCreate.emit();
  }
}
