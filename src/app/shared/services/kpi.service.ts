import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KpiResponseDto, UpdateKpiDto } from '../../../app/FE/auth/models/kpi.model';

export interface Kpi {
  kpiId: number;
  kpiName: string;
  description?: string;
  kpiType?: string;
  measurementUnit?: string;
  createdByUserId?: number;
  createdDate?: string;
  updatedDate?: string;
}

export interface AssignedKpi {
  assignedKpiId: number;
  kpiId: number;
  periodId: number;
  assigneeUserId?: number;
  assigneeDepartmentId?: number;
  targetValue?: number;
  weightPercent?: number;
  kpi?: Kpi;
  period?: any;
  assigneeUser?: any;
  assigneeDepartment?: any;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  parentDepartmentId?: number;
  parentDepartment?: Department;
  childDepartments?: Department[];
  users?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private apiUrl = 'http://localhost:5197/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // KPI Methods
  getAllKpis(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.apiUrl}/kpi`, {
      headers: this.getAuthHeaders()
    });
  }

  getKpiById(id: number): Observable<Kpi> {
    return this.http.get<Kpi>(`${this.apiUrl}/kpi/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createKpi(kpi: Kpi): Observable<Kpi> {
    return this.http.post<Kpi>(`${this.apiUrl}/kpi`, kpi, {
      headers: this.getAuthHeaders()
    });
  }

  updateKpi(id: number, updateKpiDto: UpdateKpiDto): Observable<KpiResponseDto> {
    return this.http.put<KpiResponseDto>(`${this.apiUrl}/kpi/${id}`, updateKpiDto, {
      headers: this.getAuthHeaders()
    });
  }

  deleteKpi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/kpi/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // AssignedKpi Methods
  getAssignedKpis(): Observable<AssignedKpi[]> {
    return this.http.get<AssignedKpi[]>(`${this.apiUrl}/kpi/assigned`, {
      headers: this.getAuthHeaders()
    });
  }

  getAssignedKpisByUser(userId: number): Observable<AssignedKpi[]> {
    return this.http.get<AssignedKpi[]>(`${this.apiUrl}/kpi/assigned/user/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getKpisByCreatedUser(userId: number): Observable<Kpi[]> {
    console.log('API Call: getKpisByCreatedUser, userId:', userId);
    console.log('API URL:', `${this.apiUrl}/kpi/created-by/${userId}`);
    return this.http.get<Kpi[]>(`${this.apiUrl}/kpi/created-by/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  createAssignedKpi(assignedKpi: AssignedKpi): Observable<AssignedKpi> {
    return this.http.post<AssignedKpi>(`${this.apiUrl}/kpi/assigned`, assignedKpi, {
      headers: this.getAuthHeaders()
    });
  }

  // Department Methods
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/department`, {
      headers: this.getAuthHeaders()
    });
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/department/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/department`, department, {
      headers: this.getAuthHeaders()
    });
  }

  updateDepartment(id: number, department: Department): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/department/${id}`, department, {
      headers: this.getAuthHeaders()
    });
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/department/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
