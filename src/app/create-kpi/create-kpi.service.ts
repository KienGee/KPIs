import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kpi } from '../models/kpi.model';

@Injectable({
  providedIn: 'root',
})
export class CreateKpiService {
  private baseUrl = 'http://localhost:5158/api/kpis';
  http: HttpClient = inject(HttpClient);

  createKpi(data: Kpi): Observable<Kpi> {
    return this.http.post<Kpi>(`${this.baseUrl}`, data);
  }
}
