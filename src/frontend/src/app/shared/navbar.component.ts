import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <div class="navbar-content">
      <div><strong>UrbanRent</strong><span> · Plataforma de gestión inmobiliaria</span></div>
      <div class="user-area">
        <span>{{ userName }}</span>
        <button type="button" (click)="logout()">Cerrar sesión</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; width:100%; }
    .navbar-content { width:100%; height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 22px; box-sizing:border-box; color:#17362a; }
    .navbar-content > div:first-child span { color:#6b7872; font-size:12px; }
    .user-area { display:flex; align-items:center; gap:12px; font-size:13px; }
    button { border:1px solid #e4e8e5; background:#fff; color:#b33a2b; border-radius:7px; padding:7px 10px; cursor:pointer; font:inherit; font-size:12px; }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get userName(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).fullName || 'Usuario' : 'Usuario';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
