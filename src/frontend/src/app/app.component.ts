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
  template: `
    @if (showApplicationShell()) {
      <div class="flex min-h-screen bg-slate-100">
        <app-sidebar></app-sidebar>
        <div class="flex-1 flex flex-col">
          <app-navbar></app-navbar>
          <main class="flex-1">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `
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
    const publicRoute = route === '/login' || route === '/register' || route === '/dashboard' || route === '/portal';
    this.showApplicationShell.set(!publicRoute);
  }
}