import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateKpiDto, KpiResponseDto, Kpi } from '../models/kpi.model';

@Injectable({
  providedIn: 'root',
})
export class CreateKpiService {
  private baseUrl = 'http://localhost:5158/api/kpi';
  http: HttpClient = inject(HttpClient);

  // New method using DTO pattern
  createKpiWithDto(data: CreateKpiDto): Observable<KpiResponseDto> {
    return this.http.post<KpiResponseDto>(`${this.baseUrl}/create-with-dto`, data);
  }

  // Legacy method for backward compatibility
  createKpi(data: Kpi): Observable<Kpi> {
    // Convert PascalCase to camelCase for new API
    const dtoData: CreateKpiDto = {
      kpiName: data.KpiName,
      description: data.Description,
      kpiType: data.KpiType,
      measurementUnit: data.MeasurementUnit
    };
    
    return this.http.post<Kpi>(`${this.baseUrl}/create-with-dto`, dtoData);
  }
}