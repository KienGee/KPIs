import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssignedKpiDetail {
  assignedKpiId: number;
  kpiId: number;
  kpiName: string;
  description?: string;
  kpiType?: string;
  measurementUnit?: string;
  periodId: number;
  periodName: string;
  startDate: string;
  endDate: string;
  targetValue?: number;
  weightPercent?: number;
  evaluation?: KpiEvaluationDetail;
}

export interface KpiEvaluationDetail {
  evaluationId: number;
  selfAssessedScore?: number;
  selfComment?: string;
  managerAssessedScore?: number;
  managerComment?: string;
  finalScore?: number;
  status?: string;
  attachments: AttachmentDetail[];
}

export interface AttachmentDetail {
  attachmentId: number;
  fileName?: string;
  filePath?: string;
}

export interface EvaluationPeriod {
  periodId: number;
  periodName: string;
  startDate: string;
  endDate: string;
}

export interface SubmitEvaluationRequest {
  assignedKpiId: number;
  selfAssessedScore: number;
  selfComment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssignedKpiService {
  private apiUrl = 'http://localhost:5197/api/AssignedKpi';

  constructor(private http: HttpClient) {}

  getMyAssignedKpis(periodId?: number): Observable<AssignedKpiDetail[]> {
    let url = `${this.apiUrl}/my-assigned-kpis`;
    if (periodId) {
      url += `?periodId=${periodId}`;
    }
    return this.http.get<AssignedKpiDetail[]>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getEvaluationPeriods(): Observable<EvaluationPeriod[]> {
    return this.http.get<EvaluationPeriod[]>(`${this.apiUrl}/evaluation-periods`, {
      headers: this.getAuthHeaders()
    });
  }

  submitEvaluation(request: SubmitEvaluationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-evaluation`, request, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
