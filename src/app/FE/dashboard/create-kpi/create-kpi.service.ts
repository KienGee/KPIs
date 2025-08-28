import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateKpiDto {
  kpiName: string;
  description: string;
  kpiType: string;
  measurementUnit: string;
}

export interface KpiResponseDto {
  kpiId: number;
  kpiName: string;
  description: string;
  kpiType: string;
  measurementUnit: string;
}

@Injectable({
  providedIn: 'root',
})
export class CreateKpiService {
  private baseUrl = 'http://localhost:5158/api/kpi';
  http: HttpClient = inject(HttpClient);

  createKpi(data: CreateKpiDto): Observable<KpiResponseDto> {
    return this.http.post<KpiResponseDto>(`${this.baseUrl}/create-with-dto`, data);
  }
}
