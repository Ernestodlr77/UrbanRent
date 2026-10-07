import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="page">
      <div class="page-head">
        <div>
          <p class="eyebrow">ATENCIÓN AL INQUILINO</p>
          <h1>Nueva solicitud</h1>
          <p>Reporta un mantenimiento, reparación o inconveniente relacionado con tu inmueble.</p>
        </div>
        <a routerLink="/portal" class="back">← Volver al portal</a>
      </div>

      @if (sent) {
        <div class="success">
          <strong>Solicitud enviada correctamente.</strong>
          <span>Tu solicitud fue registrada para revisión.</span>
          <a routerLink="/portal">Volver al portal</a>
        </div>
      } @else {
        <div class="card">
          <div class="grid">
            <label>Tipo de solicitud*
              <select [(ngModel)]="form.type">
                <option>Mantenimiento</option>
                <option>Reparación</option>
                <option>Pago</option>
                <option>Otro</option>
              </select>
            </label>
            <label>Prioridad*
              <select [(ngModel)]="form.priority">
                <option>Normal</option>
                <option>Alta</option>
                <option>Urgente</option>
              </select>
            </label>
            <label class="wide">Asunto*
              <input [(ngModel)]="form.subject" placeholder="Ej. Fuga en baño principal">
            </label>
            <label class="wide">Descripción*
              <textarea [(ngModel)]="form.description" rows="6" placeholder="Describe el inconveniente con el mayor detalle posible."></textarea>
            </label>
          </div>

          @if (error) {
            <p class="error">{{ error }}</p>
          }

          <div class="actions">
            <a routerLink="/portal" class="secondary">Cancelar</a>
            <button type="button" class="primary" (click)="submit()">Enviar solicitud</button>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    :host { display:block; }
    .page { max-width:1080px; margin:0 auto; padding:34px 20px; color:#14231c; }
    .page-head { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:24px; }
    .eyebrow { margin:0; color:#2b7a53; font-size:11px; font-weight:700; letter-spacing:1px; }
    h1 { margin:5px 0; font-size:30px; }
    .page-head p:not(.eyebrow) { margin:0; color:#6b7872; font-size:13px; }
    .back, .success a { color:#2b7a53; text-decoration:none; font-weight:600; font-size:13px; }
    .card, .success { background:#fff; border:1px solid #e4e8e5; border-radius:12px; padding:24px; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
    label { display:flex; flex-direction:column; gap:7px; color:#4f5d56; font-size:12px; font-weight:600; }
    .wide { grid-column:1 / -1; }
    input, select, textarea { width:100%; box-sizing:border-box; border:1px solid #d9dfdb; border-radius:8px; padding:11px 12px; font:inherit; color:#14231c; background:#fff; }
    textarea { resize:vertical; }
    input:focus, select:focus, textarea:focus { outline:2px solid #cde4d5; border-color:#2b7a53; }
    .actions { display:flex; justify-content:flex-end; gap:10px; margin-top:22px; }
    .primary, .secondary { display:inline-block; border:1px solid #2b7a53; border-radius:8px; padding:10px 15px; font:inherit; font-weight:600; text-decoration:none; cursor:pointer; }
    .primary { background:#2b7a53; color:#fff; }
    .secondary { background:#fff; color:#2b7a53; }
    .error { margin:14px 0 0; color:#a33a2b; font-size:13px; }
    .success { display:flex; flex-direction:column; gap:10px; }
    .success span { color:#6b7872; font-size:13px; }
    @media (max-width:700px) { .page-head { flex-direction:column; } .grid { grid-template-columns:1fr; } .wide { grid-column:auto; } }
  `]
})
export class RequestsComponent {
  form = { type: 'Mantenimiento', priority: 'Normal', subject: '', description: '' };
  sent = false;
  error = '';

  submit(): void {
    if (!this.form.subject.trim() || !this.form.description.trim()) {
      this.error = 'Completa el asunto y la descripción.';
      return;
    }

    this.error = '';
    this.sent = true;
  }
}
