import { Component, inject } from '@angular/core';
import { CreateKpiService } from './create-kpi.service';

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

  createKpiService: CreateKpiService = inject(CreateKpiService);

  OnSubmit() {
    this.createKpiService
      .createKpi({
        KpiName: this.kpiName,
        Description: this.description,
        KpiType: this.kpiType,
        MeasurementUnit: this.measurementUnit,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
