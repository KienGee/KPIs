import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-unit-kpi-view',
  templateUrl: './unit-kpi-view.component.html',
  styleUrls: ['./unit-kpi-view.component.css']
})
export class UnitKpiViewComponent {
  selectedUnit: number = 1;
  kpis: any = true;

  // Mock data
  units = [
    { id: 1, name: 'Phòng Đào tạo' },
    { id: 2, name: 'Phòng Tài chính' },
    { id: 3, name: 'Khoa Xây dựng' },
    { id: 4, name: 'Khoa Cơ khí' }
  ];

  aiInsights: string = '';

  // Table data sources
  functionDataSource = new MatTableDataSource([
    { stt: 1, indicator: 'Số sinh viên tốt nghiệp', target: '1000', weight: '20%', formula: 'Số lượng/năm', actual: '950', score: 95 },
    { stt: 2, indicator: 'Tỷ lệ sinh viên có việc làm', target: '85%', weight: '15%', formula: '(Có việc/Tổng SV)*100', actual: '88%', score: 103 },
    { stt: 3, indicator: 'Số đề tài nghiên cứu', target: '5', weight: '10%', formula: 'Số lượng/năm', actual: '6', score: 120 }
  ]);

  targetDataSource = new MatTableDataSource([
    { stt: 1, indicator: 'Tăng trưởng sinh viên', target: '10%', weight: '25%', formula: '(Năm nay-Năm trước)/Năm trước*100', actual: '12%', score: 120 },
    { stt: 2, indicator: 'Cải thiện chất lượng giảng dạy', target: '4.0/5', weight: '20%', formula: 'Điểm đánh giá TB', actual: '4.2/5', score: 105 }
  ]);

  complianceDataSource = new MatTableDataSource([
    { stt: 1, indicator: 'Tuân thủ quy chế tài chính', target: '100%', weight: '30%', formula: 'Báo cáo kiểm toán', actual: '98%', score: 98 },
    { stt: 2, indicator: 'Thực hiện đúng quy trình ISO', target: '100%', weight: '25%', formula: 'Audit nội bộ', actual: '100%', score: 100 }
  ]);

  // Column definitions for each table
  functionColumns = ['stt', 'indicator', 'target', 'weight', 'formula', 'actual', 'score'];
  targetColumns = ['stt', 'indicator', 'target', 'weight', 'formula', 'actual', 'score'];
  complianceColumns = ['stt', 'indicator', 'target', 'weight', 'formula', 'actual', 'score'];

  // Calculated totals
  get totalFunction(): number {
    return this.functionDataSource.data.reduce((sum: number, item: any) => sum + item.score, 0) / this.functionDataSource.data.length;
  }

  get totalTarget(): number {
    return this.targetDataSource.data.reduce((sum: number, item: any) => sum + item.score, 0) / this.targetDataSource.data.length;
  }

  get totalCompliance(): number {
    return this.complianceDataSource.data.reduce((sum: number, item: any) => sum + item.score, 0) / this.complianceDataSource.data.length;
  }

  loadKpis() {
    console.log('Loading KPIs for unit:', this.selectedUnit);
    // Here you would typically call a service to load data
    this.kpis = true;
  }

  exportToExcel() {
    console.log('Exporting to Excel...');
    alert('Tính năng xuất Excel đang được phát triển!');
  }

  generateReport() {
    console.log('Generating report...');
    alert('Tính năng tạo báo cáo đang được phát triển!');
  }

  analyzeWithAI() {
    console.log('Analyzing with AI...');
    this.aiInsights = `Phân tích AI cho đơn vị ${this.units.find(u => u.id === this.selectedUnit)?.name}:

• Chức năng: Điểm trung bình ${this.totalFunction.toFixed(1)} - Tốt
• Mục tiêu: Điểm trung bình ${this.totalTarget.toFixed(1)} - Xuất sắc  
• Tuân thủ: Điểm trung bình ${this.totalCompliance.toFixed(1)} - Tốt

Khuyến nghị: Tập trung cải thiện các chỉ số chức năng để đạt mức xuất sắc.`;
  }
}
