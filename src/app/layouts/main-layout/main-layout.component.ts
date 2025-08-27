import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  sidebarCollapsed = false;
  constructor(private router: Router, private authService: AuthService) {}
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
