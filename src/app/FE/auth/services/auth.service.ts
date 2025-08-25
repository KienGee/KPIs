import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';


export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  fullName: string;
  roles: string[];
}

export interface User {
  userId: number;
  username: string;
  fullName: string;
  email?: string;
  departmentId?: number;
  jobTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5197/api'; // Backend API URL
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user_info');
    
    if (token && userInfo) {
      this.currentUserSubject.next(JSON.parse(userInfo));
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Store token and user info
          localStorage.setItem('token', response.token);
          localStorage.setItem('user_info', JSON.stringify({
            username: response.username,
            fullName: response.fullName,
            roles: response.roles
          }));
          
          // Update current user
          this.currentUserSubject.next({
            username: response.username,
            fullName: response.fullName,
            roles: response.roles
          });
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, userData);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/user/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/user/username/${username}`, {
      headers: this.getAuthHeaders()
    });
  }
}