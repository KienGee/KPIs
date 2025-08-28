import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KpiService, Kpi } from '../../../shared/services/kpi.service';
import { AuthService } from '../../auth/services/auth.service';
import { UpdateKpiDto, KpiResponseDto } from '../../auth/models/kpi.model';
import { EditKpiDialogComponent } from './edit-kpi-dialog.component';

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

  // Column definitions for each table 
  functionColumns = ['indicator', 'formula', 'measurementUnit', 'createdDate', 'updatedDate', 'actions'];
  targetColumns = ['indicator', 'formula', 'measurementUnit', 'createdDate', 'updatedDate', 'actions'];
  complianceColumns = ['indicator', 'formula', 'measurementUnit', 'createdDate', 'updatedDate', 'actions'];

  constructor(
    private kpiService: KpiService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
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
        kpiId: kpi.kpiId,
        indicator: kpi.kpiName,
        formula: kpi.description || 'Chưa có mô tả', 
        measurementUnit: kpi.measurementUnit || 'Chưa xác định',
        createdDate: kpi.createdDate ? new Date(kpi.createdDate).toLocaleDateString('vi-VN') : 'N/A',
        updatedDate: kpi.updatedDate ? new Date(kpi.updatedDate).toLocaleDateString('vi-VN') : null,
        originalKpi: kpi // Store original KPI data for editing
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

  // Edit KPI functionality
  editKpi(rowData: any): void {
    const kpi = rowData.originalKpi;
    
    const dialogRef = this.dialog.open(EditKpiDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { kpi: kpi }
    });

    dialogRef.afterClosed().subscribe((result: KpiResponseDto | undefined) => {
      if (result) {
        // Update was successful, update the KPI in local array
        const index = this.kpis.findIndex(k => k.kpiId === kpi.kpiId);
        if (index !== -1) {
          this.kpis[index] = {
            ...this.kpis[index],
            kpiName: result.kpiName,
            description: result.description,
            kpiType: result.kpiType,
            measurementUnit: result.measurementUnit,
            updatedDate: result.updatedDate
          };
        }
        
        // Reorganize the data
        this.organizeKpisByType();
        
        // Show success message
        alert('Cập nhật KPI thành công!');
      }
    });
  }

  // Delete KPI functionality
  deleteKpi(rowData: any): void {
    const kpi = rowData.originalKpi;
    if (confirm(`Bạn có chắc chắn muốn xóa KPI "${kpi.kpiName}"? Hành động này không thể hoàn tác.`)) {
      this.kpiService.deleteKpi(kpi.kpiId).subscribe({
        next: () => {
          // Remove from local array
          this.kpis = this.kpis.filter(k => k.kpiId !== kpi.kpiId);
          
          // Reorganize the data
          this.organizeKpisByType();
          
          alert('Xóa KPI thành công!');
        },
        error: (error) => {
          console.error('Error deleting KPI:', error);
          alert('Có lỗi xảy ra khi xóa KPI. Vui lòng thử lại.');
        }
      });
    }
  }
}
