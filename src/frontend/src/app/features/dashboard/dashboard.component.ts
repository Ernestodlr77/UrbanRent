import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { PropertyService } from '../../core/services/property.service';
import { UN_MEMBER_CODES, UN_MEMBER_COUNTRIES, WorldCountry } from '../../core/data/world-countries';

type PropertyTypeFilter = 'Todos' | 'APARTMENT' | 'HOUSE' | 'WAREHOUSE' | 'COMMERCIAL';

interface Property {
  id?: number;
  title: string;
  propertyType: string;
  city: string;
  countryCode: string;
  countryName: string;
  monthlyRent: number;
  currencyCode: string;
  latitude: number;
  longitude: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('propertyMap') propertyMap?: ElementRef<HTMLDivElement>;
  @ViewChild('worldMap') worldMap?: ElementRef<HTMLDivElement>;

  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);

  protected activeView: 'panel' | 'mundo' = 'panel';
  protected globalSearch = '';
  protected propertyType: PropertyTypeFilter = 'Todos';
  protected worldType: 'Todos' | 'APARTMENT' | 'HOUSE' | 'WAREHOUSE' = 'Todos';
  protected selectedCountry = '';
  protected properties: Property[] = [];
  protected readonly countries: WorldCountry[] = UN_MEMBER_COUNTRIES;

  private propertyLeaflet?: L.Map;
  private worldLeaflet?: L.Map;
  private propertyMarkers = L.layerGroup();
  private worldMarkers = L.layerGroup();
  private countryLayer?: L.GeoJSON;

  constructor() {
    const fragment = window.location.hash.replace('#', '');
    this.activeView = fragment === 'mundo' ? 'mundo' : 'panel';
    this.loadProperties();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.activeView === 'mundo' ? this.initWorldMap() : this.initPropertyMap());
  }

  ngOnDestroy(): void {
    this.propertyLeaflet?.remove();
    this.worldLeaflet?.remove();
  }

  protected loadProperties(): void {
    this.propertyService.getAll().subscribe({
      next: data => {
        this.properties = data.data as Property[];
        this.drawPropertyMarkers();
        this.drawWorldMarkers();
      },
      error: () => {
        this.properties = [];
        this.drawPropertyMarkers();
        this.drawWorldMarkers();
      }
    });
  }

  protected openWorld(): void {
    this.activeView = 'mundo';
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}#mundo`);
    setTimeout(() => this.initWorldMap());
  }

  protected closeWorld(): void {
    this.activeView = 'panel';
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
    setTimeout(() => this.initPropertyMap());
  }

  protected search(): void {
    const query = this.globalSearch.trim();
    if (query) this.router.navigate(['/properties'], { queryParams: { search: query } });
  }

  protected setPropertyType(type: PropertyTypeFilter): void {
    this.propertyType = type;
    this.drawPropertyMarkers();
  }

  protected setWorldType(type: 'Todos' | 'APARTMENT' | 'HOUSE' | 'WAREHOUSE'): void {
    this.worldType = type;
    this.drawWorldMarkers();
  }

  protected selectCountry(code: string): void {
    this.selectedCountry = this.selectedCountry === code ? '' : code;
    this.drawWorldMarkers();
    const country = this.countries.find(item => item.code === code);
    if (country && this.worldLeaflet) this.worldLeaflet.flyTo([country.latitude, country.longitude], 4, { duration: 0.8 });
  }

  protected worldCountries(): WorldCountry[] { return this.countries; }

  protected countryCount(code: string): number {
    return this.properties.filter(item => item.countryCode === code).length;
  }

  protected filteredWorldListings(): Property[] {
    return this.properties.filter(item =>
      UN_MEMBER_CODES.has(item.countryCode) &&
      (!this.selectedCountry || item.countryCode === this.selectedCountry) &&
      (this.worldType === 'Todos' || item.propertyType === this.worldType) &&
      item.status === 'AVAILABLE'
    );
  }

  protected formatRent(value: number, currency = 'USD'): string {
    return `${currency} ${Number(value).toLocaleString('es-GT')}`;
  }

  protected get availableCount(): number { return this.properties.filter(property => property.status === 'AVAILABLE').length; }
  protected get rentedCount(): number { return this.properties.filter(property => property.status === 'RENTED').length; }

  protected typeRatio(type: string): number {
    return Math.max(6, Math.round(this.properties.filter(property => property.propertyType === type).length / Math.max(this.properties.length, 1) * 100));
  }

  protected typeLabel(type: string): string {
    return ({ APARTMENT: 'Apartamento', HOUSE: 'Casa', WAREHOUSE: 'Bodega', COMMERCIAL: 'Local' } as Record<string,string>)[type] ?? type;
  }

  protected exportPdf(): void {
    window.print();
  }

  protected exportExcel(): void {
    const rows = [['Inmueble','Tipo','Ciudad','País','Renta','Moneda','Estado'], ...this.properties.map(p => [p.title,this.typeLabel(p.propertyType),p.city,p.countryName,String(p.monthlyRent),p.currencyCode,p.status])];
    const csv = rows.map(row => row.map(value => `"${value.replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'urbanrent-inmuebles.csv'; link.click();
    URL.revokeObjectURL(url);
  }

  private initPropertyMap(): void {
    if (!this.propertyMap) return;
    if (!this.propertyLeaflet) {
      this.propertyLeaflet = L.map(this.propertyMap.nativeElement, { scrollWheelZoom: false }).setView([14.6, -90.5], 5);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(this.propertyLeaflet);
      this.propertyMarkers.addTo(this.propertyLeaflet);
    }
    this.drawPropertyMarkers();
    setTimeout(() => this.propertyLeaflet?.invalidateSize());
  }

  private initWorldMap(): void {
    if (!this.worldMap) return;
    if (!this.worldLeaflet) {
      this.worldLeaflet = L.map(this.worldMap.nativeElement, { minZoom: 2, maxZoom: 8 }).setView([18, -20], 2);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(this.worldLeaflet);
      this.worldMarkers.addTo(this.worldLeaflet);
      this.loadCountryBoundaries();
    }
    this.drawWorldMarkers();
    setTimeout(() => this.worldLeaflet?.invalidateSize());
  }

  private loadCountryBoundaries(): void {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/main/data/countries.geojson')
      .then(response => response.json())
      .then((geojson: GeoJSON.FeatureCollection) => {
        const filtered = {
          ...geojson,
          features: geojson.features.filter(feature => UN_MEMBER_CODES.has(String((feature.properties as any)?.['ISO3166-1-Alpha-3'] ?? (feature.properties as any)?.ISO_A3)))
        };
        this.countryLayer?.remove();
        this.countryLayer = L.geoJSON(filtered as any, {
          style: () => ({ color: '#6f8d7d', weight: 1, fillColor: '#d9e8df', fillOpacity: 0.35 }),
          onEachFeature: (feature, layer) => {
            const code = String((feature.properties as any)?.['ISO3166-1-Alpha-3'] ?? (feature.properties as any)?.ISO_A3 ?? '');
            const country = this.countries.find(item => item.code === code);
            if (country) {
              layer.bindTooltip(`${country.name} · ${this.countryCount(code)} alquileres`);
              layer.on('click', () => this.selectCountry(code));
              layer.on('mouseover', () => (layer as L.Path).setStyle({ fillOpacity: 0.65, weight: 2 }));
              layer.on('mouseout', () => (layer as L.Path).setStyle({ fillOpacity: 0.35, weight: 1 }));
            }
          }
        }).addTo(this.worldLeaflet!);
        this.countryLayer.bringToBack();
      })
      .catch(() => undefined);
  }

  private drawPropertyMarkers(): void {
    if (!this.propertyLeaflet) return;
    this.propertyMarkers.clearLayers();
    const visible = this.properties.filter(property =>
      (this.propertyType === 'Todos' || property.propertyType === this.propertyType) &&
      property.countryCode === 'GTM'
    );
    visible.forEach(property => L.marker([property.latitude, property.longitude])
      .bindPopup(`<b>${property.title}</b><br>${this.typeLabel(property.propertyType)} · ${property.city}<br><b>${this.formatRent(property.monthlyRent, property.currencyCode)}</b> / mes`)
      .addTo(this.propertyMarkers));
  }

  private drawWorldMarkers(): void {
    if (!this.worldLeaflet) return;
    this.worldMarkers.clearLayers();
    this.filteredWorldListings().forEach(property => L.marker([property.latitude, property.longitude])
      .bindPopup(`<b>${property.title}</b><br>${this.typeLabel(property.propertyType)} · ${property.city}, ${property.countryName}<br><b>${this.formatRent(property.monthlyRent, property.currencyCode)}</b> / mes`)
      .addTo(this.worldMarkers));
  }
}
