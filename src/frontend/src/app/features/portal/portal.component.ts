import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="tenant-portal">
      <header class="portal-header">
        <div class="portal-logo"><i></i>UrbanRent <small>Portal del inquilino</small></div>
        <a routerLink="/dashboard" class="portal-link">← Vista de administrador</a>
      </header>
      <main class="portal-main">
        <section class="portal-welcome">
          <div><p class="eyebrow">MI ESPACIO</p><h1>Hola, {{ userName }}.</h1><p>Todo lo importante de tu renta, en un solo lugar.</p></div>
          <span class="tenant-status">Contrato vigente</span>
        </section>
        <section class="portal-grid">
          <article class="portal-card rent-card"><span>Próximo pago</span><strong>$12.500</strong><small>Vence el 05 de octubre de 2026</small><button type="button" class="portal-button" (click)="notify('Redirigiendo al pago seguro')">Pagar renta</button></article>
          <article class="portal-card"><span>Mi inmueble</span><h2>Álamos · Depto. 204</h2><p>Roma Norte · Ciudad de México</p><div class="portal-details"><span>Contrato hasta<b>30 mar 2027</b></span><span>Superficie<b>68 m²</b></span></div></article>
          <article class="portal-card"><span>Estado de cuenta</span><h2>$0.00</h2><p>Saldo pendiente</p><a routerLink="/payments" class="portal-text-link">Ver movimientos →</a></article>
        </section>
        <section class="portal-columns">
          <article class="portal-card"><div class="portal-card-head"><h2>Mis solicitudes</h2><a routerLink="/requests" class="portal-button ghost">Nueva solicitud</a></div><div class="request"><span class="request-dot open"></span><div><b>Fuga en baño principal</b><small>En proceso · Actualizado hoy</small></div></div><div class="request"><span class="request-dot done"></span><div><b>Cambio de foco en pasillo</b><small>Resuelto · 28 sep 2026</small></div></div></article>
          <article class="portal-card"><h2>Documentos</h2><a class="document" href="#documentos" (click)="notify('Descarga preparada')">Contrato de arrendamiento <span>PDF</span></a><a class="document" href="#documentos" (click)="notify('Descarga preparada')">Recibo de septiembre <span>PDF</span></a></article>
        </section>
      </main>
      @if (message) { <div class="portal-toast">{{ message }}</div> }
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .tenant-portal { min-height: 100vh; background: #f2f4f2; color: #14231c; }
    .portal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 34px; background: #1a3328; color: #fff; }
    .portal-logo { display: flex; gap: 9px; align-items: center; font-size: 19px; font-weight: 600; } .portal-logo i { width: 24px; height: 24px; border-radius: 6px; background: #2b7a53; } .portal-logo small { color: #b9d9c4; font-size: 11px; font-weight: 400; }
    .portal-link { color: #d8e9df; font-size: 13px; text-decoration: none; }
    .portal-main { max-width: 1080px; margin: auto; padding: 34px 20px; }
    .portal-welcome, .portal-card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; } .eyebrow { margin: 0; color: #2b7a53; font-size: 11px; font-weight: 700; letter-spacing: 1px; } h1 { margin: 4px 0; font-size: 30px; } h2 { margin: 5px 0; font-size: 17px; } p, .portal-card small { color: #6b7872; font-size: 13px; } .tenant-status { padding: 5px 10px; color: #2b7a53; background: #e0f0e6; border-radius: 99px; font-size: 12px; }
    .portal-grid, .portal-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 24px; } .portal-columns { grid-template-columns: 1.3fr 1fr; }
    .portal-card { padding: 18px; background: #fff; border: 1px solid #e4e8e5; border-radius: 12px; } .portal-card > span { color: #6b7872; font-size: 12px; } .rent-card { background: #1a3328; color: #fff; } .rent-card span, .rent-card small { color: #cfe3d7; } .rent-card strong { display: block; margin: 8px 0 2px; font-size: 31px; }
    .portal-button { margin-top: 16px; padding: 8px 12px; border: 1px solid #2b7a53; border-radius: 7px; background: #2b7a53; color: #fff; cursor: pointer; font: inherit; font-weight: 600; } .portal-button.ghost { margin: 0; background: #fff; color: #2b7a53; }
    .portal-details { display: flex; gap: 30px; margin-top: 18px; } .portal-details span { color: #6b7872; font-size: 11px; } .portal-details b { display: block; color: #14231c; font-size: 13px; }
    .portal-text-link { display: block; margin-top: 22px; color: #2b7a53; font-size: 12px; font-weight: 600; text-decoration: none; }
    .request, .document { display: flex; gap: 10px; align-items: center; padding: 13px 0; border-bottom: 1px solid #e4e8e5; text-decoration: none; color: #14231c; } .request:last-child, .document:last-child { border-bottom: 0; } .request small { display: block; margin-top: 3px; } .request-dot { width: 9px; height: 9px; border-radius: 50%; } .request-dot.open { background: #a8650f; } .request-dot.done { background: #2b7a53; } .document { justify-content: space-between; color: #2b7a53; font-size: 13px; } .document span { padding: 2px 6px; background: #f0f2f0; border-radius: 4px; color: #6b7872; font-size: 10px; }
    .portal-toast { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); padding: 10px 16px; border-radius: 8px; background: #1a3328; color: #fff; font-size: 13px; }
    @media (max-width: 700px) { .portal-header { padding: 16px 18px; } .portal-logo small { display: none; } .portal-grid, .portal-columns { grid-template-columns: 1fr; } .portal-welcome { flex-direction: column; } }
  `],
})
export class PortalComponent {
  private readonly auth = inject(AuthService);
  protected message = '';
  protected get userName(): string {
    return this.auth.getStoredUser()?.fullName?.split(' ')[0] || 'Usuario';
  }

  protected notify(message: string): void {
    this.message = message;
    setTimeout(() => this.message = '', 2400);
  }
}
