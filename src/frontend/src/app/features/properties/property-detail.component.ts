import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Property, PropertyService } from '../../core/services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css',
})
export class PropertyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly propertyService = inject(PropertyService);

  property: Property | null = null;
  loading = true;
  errorMessage = '';

  get userName(): string {
    return this.authService.getStoredUser()?.fullName || 'Usuario';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.loading = false;
      this.errorMessage = 'El inmueble solicitado no es válido.';
      return;
    }

    this.propertyService.getById(id).subscribe({
      next: (property) => {
        this.property = property;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No se pudo cargar el inmueble.';
        this.loading = false;
      },
    });
  }
}
