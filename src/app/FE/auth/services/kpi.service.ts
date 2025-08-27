import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KpiService {
  private apiUrl = '/api/kpis'; // Proxy qua Nginx nếu cần

  constructor(private http: HttpClient) {}

  getAssignedKpis(userId: number, periodId?: number): Observable<any[]> {
    let params = periodId ? `?periodId=${periodId}` : '';
    return this.http.get<any[]>(`${this.apiUrl}/assigned/${userId}${params}`);
  }
}