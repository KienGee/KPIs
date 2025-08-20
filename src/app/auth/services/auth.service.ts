import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user_info: {
    id: string;
    username: string;
    email: string;
    full_name: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    const userInfo = localStorage.getItem('user_info');
    
    if (token && userInfo) {
      this.currentUserSubject.next(JSON.parse(userInfo));
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    // Mock login - không cần API
    const mockResponse: LoginResponse = {
      access_token: 'mock_token_' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'mock_refresh_token',
      user_info: {
        id: '1',
        username: credentials.username,
        email: credentials.username + '@huce.edu.vn',
        full_name: 'Người dùng ' + credentials.username,
        roles: ['user']
      }
    };

    // Store tokens and user info
    localStorage.setItem('access_token', mockResponse.access_token);
    localStorage.setItem('refresh_token', mockResponse.refresh_token);
    localStorage.setItem('user_info', JSON.stringify(mockResponse.user_info));
    
    // Update current user
    this.currentUserSubject.next(mockResponse.user_info);

    // Return as observable để giống như API call thật
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 1000); // Giả lập delay 1 giây
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}