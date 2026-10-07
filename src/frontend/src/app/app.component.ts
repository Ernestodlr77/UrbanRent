import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavbarComponent } from './shared/navbar.component';
import { SidebarComponent } from './shared/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  protected showApplicationShell = signal(false);

  constructor() {
    this.updateShellVisibility(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => this.updateShellVisibility(event.urlAfterRedirects));
  }

  private updateShellVisibility(url: string): void {
    const route = url.split(/[?#]/, 1)[0];
    const publicRoute = route === '/login' || route === '/register';
    this.showApplicationShell.set(!publicRoute);
  }
}