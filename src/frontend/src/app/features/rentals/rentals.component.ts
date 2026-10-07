import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Property, PropertyService } from '../../core/services/property.service';

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="rentals-page">
      <div class="page-header">
        <div>
          <p class="eyebrow">URBANRENT</p>
          <h1>Alquila tu próximo hogar</h1>
          <p class="subtitle">Encuentra casas y apartamentos disponibles para alquilar.</p>
        </div>
        <a routerLink="/portal" class="portal-link">Portal del alquiler →</a>
      </div>

      <div class="filters">
        <input type="text" placeholder="Buscar por ciudad, inmueble..." [(ngModel)]="search" (input)="filterProperties()">
        <select [(ngModel)]="type" (change)="filterProperties()">
          <option value="">Todos los tipos</option>
          <option value="HOUSE">Casas</option>
          <option value="APARTMENT">Apartamentos</option>
        </select>
      </div>

      @if (loading) {
        <div class="loading">Cargando inmuebles...</div>
      } @else if (filteredProperties.length === 0) {
        <div class="empty"><h2>No hay inmuebles disponibles</h2><p>Prueba con otra ciudad o tipo de inmueble.</p></div>
      } @else {
        <div class="property-grid">
          @for (property of filteredProperties; track property.id) {
            <article class="property-card">
              <div class="property-image"><span class="property-type">{{ getTypeName(property.propertyType) }}</span></div>
              <div class="property-content">
                <h2>{{ property.title }}</h2>
                <p class="location">📍 {{ property.city }}, {{ property.countryName }}</p>
                <p class="address">{{ property.address }}</p>
                <p class="description">{{ property.description }}</p>
                <div class="property-footer">
                  <div><small>Precio mensual</small><strong>{{ property.monthlyRent | number:'1.0-0' }} {{ property.currencyCode }}</strong></div>
                  @if (property.id) {
                    <a class="view-button" [routerLink]="['/properties', property.id]">Ver inmueble</a>
                  }
                </div>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    :host { display:block; }
    .rentals-page { max-width:1200px; margin:0 auto; padding:35px 25px; }
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:25px; }
    .eyebrow { color:#2b7a53; font-size:11px; font-weight:700; letter-spacing:1px; margin:0; }
    h1 { margin:6px 0; font-size:32px; color:#14231c; }
    .subtitle, .address, .description { color:#68766f; font-size:14px; }
    .portal-link { color:#2b7a53; text-decoration:none; font-weight:600; font-size:13px; }
    .filters { display:flex; gap:12px; margin-bottom:25px; }
    .filters input, .filters select { padding:12px; border:1px solid #dce3de; border-radius:8px; background:white; }
    .filters input { flex:1; }
    .property-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    .property-card { background:white; border:1px solid #e1e7e3; border-radius:12px; overflow:hidden; }
    .property-image { height:150px; background:linear-gradient(135deg,#d9e8df,#b8d1c2); position:relative; }
    .property-type { position:absolute; top:12px; left:12px; padding:5px 9px; border-radius:6px; background:white; color:#2b7a53; font-size:11px; font-weight:700; }
    .property-content { padding:18px; }
    .property-content h2 { font-size:17px; margin:0 0 8px; color:#14231c; }
    .location { color:#2b7a53; font-size:13px; font-weight:600; }
    .description { min-height:35px; }
    .property-footer { display:flex; justify-content:space-between; align-items:flex-end; gap:10px; margin-top:18px; }
    .property-footer small { display:block; color:#78857f; font-size:10px; }
    .property-footer strong { display:block; color:#14231c; font-size:18px; margin-top:3px; }
    .view-button { padding:9px 12px; border-radius:7px; background:#2b7a53; color:white; text-decoration:none; font-size:12px; font-weight:600; }
    .loading, .empty { padding:40px; text-align:center; background:white; border-radius:12px; }
    @media (max-width:900px) { .property-grid { grid-template-columns:repeat(2,1fr); } }
    @media (max-width:600px) { .page-header, .filters { flex-direction:column; } .property-grid { grid-template-columns:1fr; } }
  `]
})
export class RentalsComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  search = '';
  type = '';
  loading = true;

  ngOnInit(): void {
    this.propertyService.getRentals().subscribe({
      next: properties => {
        this.properties = properties;
        this.filteredProperties = properties;
        this.loading = false;
      },
      error: () => {
        this.properties = [];
        this.filteredProperties = [];
        this.loading = false;
      }
    });
  }

  filterProperties(): void {
    const text = this.search.trim().toLowerCase();
    this.filteredProperties = this.properties.filter(property => {
      const matchesText = !text || [property.title, property.city, property.address]
        .some(value => String(value || '').toLowerCase().includes(text));
      return matchesText && (!this.type || property.propertyType === this.type);
    });
  }

  getTypeName(type?: string): string {
    return type === 'HOUSE' ? 'Casa' : type === 'APARTMENT' ? 'Apartamento' : type || '';
  }
}
