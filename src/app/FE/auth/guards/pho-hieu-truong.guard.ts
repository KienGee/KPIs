import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PhoHieuTruongGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser();
    console.log('Guard - Current user:', currentUser);
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Allow all authenticated users to access KPI pages
    // Removed role-based restriction since all roles should see their assigned KPIs
    return true;
  }
}
