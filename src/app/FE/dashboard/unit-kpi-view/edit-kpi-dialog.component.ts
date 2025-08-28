import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KpiService } from '../../../shared/services/kpi.service';
import { UpdateKpiDto, KpiResponseDto } from '../../auth/models/kpi.model';

export interface EditKpiDialogData {
  kpi: any;
}

@Component({
  selector: 'app-edit-kpi-dialog',
  template: `
    <h2 mat-dialog-title>Chỉnh sửa KPI</h2>
    
    <mat-dialog-content>
      <form [formGroup]="editForm" class="edit-kpi-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tên KPI *</mat-label>
          <input matInput formControlName="kpiName" placeholder="Nhập tên KPI">
          <mat-error *ngIf="editForm.get('kpiName')?.hasError('required')">
            Tên KPI là bắt buộc
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mô tả</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Nhập mô tả KPI"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Loại KPI *</mat-label>
          <mat-select formControlName="kpiType">
            <mat-option value="">Chọn loại KPI</mat-option>
            <mat-option value="functional">Chức năng</mat-option>
            <mat-option value="objective">Mục tiêu</mat-option>
            <mat-option value="discipline">Tuân thủ</mat-option>
          </mat-select>
          <mat-error *ngIf="editForm.get('kpiType')?.hasError('required')">
            Loại KPI là bắt buộc
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Đơn vị đo</mat-label>
          <input matInput formControlName="measurementUnit" placeholder="Nhập đơn vị đo">
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Hủy</button>
      <button mat-raised-button 
              color="primary" 
              [disabled]="!editForm.valid || isLoading"
              (click)="onSave()">
        <mat-spinner *ngIf="isLoading" diameter="16" class="inline-spinner"></mat-spinner>
        {{ isLoading ? 'Đang lưu...' : 'Lưu' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .edit-kpi-form {
      display: flex;
      flex-direction: column;
      min-width: 400px;
      max-width: 500px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      max-height: 400px;
      overflow-y: auto;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }

    .mat-mdc-raised-button:disabled {
      opacity: 0.6;
    }

    .inline-spinner {
      margin-right: 8px;
    }
  `]
})
export class EditKpiDialogComponent {
  editForm: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<EditKpiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditKpiDialogData,
    private fb: FormBuilder,
    private kpiService: KpiService
  ) {
    this.editForm = this.fb.group({
      kpiName: [data.kpi.kpiName || '', [Validators.required]],
      description: [data.kpi.description || ''],
      kpiType: [data.kpi.kpiType || '', [Validators.required]],
      measurementUnit: [data.kpi.measurementUnit || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const updateDto: UpdateKpiDto = {
        kpiName: this.editForm.value.kpiName,
        description: this.editForm.value.description,
        kpiType: this.editForm.value.kpiType,
        measurementUnit: this.editForm.value.measurementUnit
      };

      this.kpiService.updateKpi(this.data.kpi.kpiId, updateDto).subscribe({
        next: (response: KpiResponseDto) => {
          this.isLoading = false;
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating KPI:', error);
          // Show error message but keep dialog open
          alert('Có lỗi xảy ra khi cập nhật KPI. Vui lòng thử lại.');
        }
      });
    }
  }
}
