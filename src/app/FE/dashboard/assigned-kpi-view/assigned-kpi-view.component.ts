import { Component, OnInit } from '@angular/core';
import { AssignedKpiService, AssignedKpiDetail, EvaluationPeriod, SubmitEvaluationRequest } from '../../../shared/services/assigned-kpi.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-assigned-kpi-view',
  templateUrl: './assigned-kpi-view.component.html',
  styleUrls: ['./assigned-kpi-view.component.css']
})
export class AssignedKpiViewComponent implements OnInit {
  assignedKpis: AssignedKpiDetail[] = [];
  evaluationPeriods: EvaluationPeriod[] = [];
  selectedPeriodId: number | null = null;
  loading = false;
  error = '';
  
  // Modal for evaluation
  showEvaluationModal = false;
  selectedKpi: AssignedKpiDetail | null = null;
  evaluationForm = {
    selfAssessedScore: 0,
    selfComment: ''
  };

  constructor(
    private assignedKpiService: AssignedKpiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvaluationPeriods();
    // Don't load KPIs here - wait for periods to load first
  }

  loadEvaluationPeriods(): void {
    console.log('Loading evaluation periods...');
    this.assignedKpiService.getEvaluationPeriods().subscribe({
      next: (periods) => {
        console.log('Received periods:', periods);
        this.evaluationPeriods = periods;
        if (periods.length > 0) {
          this.selectedPeriodId = periods[0].periodId; // Select latest period by default
          console.log('Selected period ID:', this.selectedPeriodId);
          // Load KPIs only after a period is selected
          this.loadAssignedKpis();
        }
      },
      error: (error) => {
        console.error('Error loading evaluation periods:', error);
        this.error = 'Không thể tải danh sách kỳ đánh giá.';
      }
    });
  }

  loadAssignedKpis(): void {
    this.loading = true;
    this.error = '';
    
    console.log('Loading assigned KPIs for period:', this.selectedPeriodId);
    
    this.assignedKpiService.getMyAssignedKpis(this.selectedPeriodId || undefined).subscribe({
      next: (kpis) => {
        console.log('Received KPIs:', kpis);
        this.assignedKpis = kpis;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading assigned KPIs:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.error = error.error?.message || `Lỗi ${error.status}: Không thể tải danh sách KPI được giao.`;
        this.loading = false;
      }
    });
  }

  onPeriodChange(): void {
    this.loadAssignedKpis();
  }

  openEvaluationModal(kpi: AssignedKpiDetail): void {
    this.selectedKpi = kpi;
    this.evaluationForm = {
      selfAssessedScore: kpi.evaluation?.selfAssessedScore || 0,
      selfComment: kpi.evaluation?.selfComment || ''
    };
    this.showEvaluationModal = true;
  }

  closeEvaluationModal(): void {
    this.showEvaluationModal = false;
    this.selectedKpi = null;
  }

  submitEvaluation(): void {
    if (!this.selectedKpi) return;

    const request: SubmitEvaluationRequest = {
      assignedKpiId: this.selectedKpi.assignedKpiId,
      selfAssessedScore: this.evaluationForm.selfAssessedScore,
      selfComment: this.evaluationForm.selfComment
    };

    this.assignedKpiService.submitEvaluation(request).subscribe({
      next: (response) => {
        alert('Đánh giá đã được gửi thành công!');
        this.closeEvaluationModal();
        this.loadAssignedKpis(); // Reload to get updated evaluation
      },
      error: (error) => {
        console.error('Error submitting evaluation:', error);
        alert(error.error?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
      }
    });
  }

  getStatusText(status?: string): string {
    switch (status) {
      case 'Pending': return 'Chờ duyệt';
      case 'Approved': return 'Đã duyệt';
      case 'Rejected': return 'Từ chối';
      default: return 'Chưa đánh giá';
    }
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      default: return 'status-not-evaluated';
    }
  }

  formatScore(score?: number): string {
    return score !== null && score !== undefined ? (score * 100).toFixed(1) + '%' : 'Chưa có';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  getUserDisplayName(): string {
    const user = this.authService.getCurrentUser();
    if (user) {
      // Ưu tiên hiển thị fullName, nếu không có thì dùng username
      return user.fullName || user.username || 'Người dùng';
    }
    return 'Người dùng';
  }
}
