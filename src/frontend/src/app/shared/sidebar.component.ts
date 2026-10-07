import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <a routerLink="/dashboard" class="brand"><span class="brand-mark"></span><span>UrbanRent</span></a>
      <p class="section-label">GESTIÓN</p>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Dashboard</a>
        <a routerLink="/properties" routerLinkActive="active">Inmuebles</a>
        <a routerLink="/contracts" routerLinkActive="active">Contratos</a>
        <a routerLink="/payments" routerLinkActive="active">Pagos y cobranza</a>
        <a routerLink="/currencies" routerLinkActive="active">Monedas</a>
        <a routerLink="/dashboard" fragment="mundo">Mundo</a>
      </nav>
      <p class="section-label">VISTAS</p>
      <nav>
        <a routerLink="/portal" routerLinkActive="active">Portal del inquilino</a>
        <a routerLink="/profile" routerLinkActive="active">Mi perfil</a>
      </nav>
      <div class="sidebar-footer"><small>UrbanRent · Gestión inmobiliaria</small></div>
    </aside>
  `,
  styles: [`
    :host { display:block; }
    .sidebar { width:240px; min-height:100vh; padding:20px 14px; background:#17362a; color:#d7e7de; display:flex; flex-direction:column; gap:8px; }
    .brand { display:flex; align-items:center; gap:10px; padding:8px 10px 20px; color:#fff; text-decoration:none; font-size:20px; font-weight:700; }
    .brand-mark { width:28px; height:28px; border-radius:8px; background:#3e9668; display:inline-block; }
    .section-label { margin:12px 8px 3px; font-size:10px; letter-spacing:1px; color:#8fb4a2; font-weight:700; }
    nav { display:grid; gap:4px; }
    nav a { padding:10px 11px; border-radius:8px; color:#cfe2d8; text-decoration:none; font-size:13px; }
    nav a:hover, nav a.active { background:#fff; color:#17362a; }
    .sidebar-footer { margin-top:auto; padding:12px 8px; color:#8fb4a2; font-size:11px; }
    @media (max-width: 900px) { .sidebar { display:none; } }
  `]
})
export class SidebarComponent {}
