import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PlayerService } from '../../../core/services/player.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LogoComponent } from '../logo/logo.component';

interface NavItem { path: string; label: string; icon: string; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LogoComponent],
  template: `
    <!-- ── Desktop Sidebar ───────────────────────────────────── -->
    <aside class="sidebar">

      <div class="sidebar__logo">
        <app-logo [size]="190"></app-logo>
      </div>

      <div class="sidebar__player">
        <div class="avatar-sm">{{ initials }}</div>
        <div class="player-info">
          <p class="player-name">{{ player.name }}</p>
          <p class="player-sub">{{ positionLabel }} · {{ player.experienceYears }} años</p>
        </div>
      </div>

      <nav class="sidebar__nav">
        @for (item of navItems; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="active"
             [routerLinkActiveOptions]="{exact:false}"
             class="nav-link">
            <i class="fa-solid {{ item.icon }}"></i>
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="sidebar__footer">
        <!-- Dark mode toggle -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem .75rem 1rem;gap:.75rem;">
          <span style="font-size:.75rem;color:rgba(255,255,255,.45);font-weight:600;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.08em;">
            <i class="fa-solid {{ themeService.isDark ? 'fa-moon' : 'fa-sun' }}" style="margin-right:.4rem;"></i>
            Modo {{ themeService.isDark ? 'Oscuro' : 'Claro' }}
          </span>
          <label class="toggle-wrap" style="cursor:pointer;">
            <input type="checkbox" [checked]="themeService.isDark" (change)="themeService.toggle()">
            <div class="toggle-track"></div>
          </label>
        </div>
        <button (click)="logout()" class="nav-logout">
          <i class="fa-solid fa-right-from-bracket"></i>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- ── Mobile Top Bar ────────────────────────────────────── -->
    <header class="mobile-header">
      <div class="header-brand">
        <app-logo [h]="36"></app-logo>
      </div>
      <div class="header-actions">
        <button class="icon-btn" (click)="themeService.toggle()" title="Toggle dark mode">
          <i class="fa-solid {{ themeService.isDark ? 'fa-sun' : 'fa-moon' }}" style="font-size:1rem;"></i>
        </button>
        <div class="avatar-badge">{{ initials }}</div>
        <button class="icon-btn" (click)="logout()">
          <i class="fa-solid fa-right-from-bracket" style="font-size:.9rem;"></i>
        </button>
      </div>
    </header>

    <!-- ── Mobile Bottom Nav ─────────────────────────────────── -->
    <nav class="bottom-nav">
      @for (item of navItems; track item.path) {
        <a [routerLink]="item.path" routerLinkActive="active"
           [routerLinkActiveOptions]="{exact:false}"
           class="bottom-nav-item">
          <i class="fa-solid {{ item.icon }}"></i>
          <span>{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
})
export class NavbarComponent {
  readonly themeService = inject(ThemeService);
  private auth      = inject(AuthService);
  private playerSvc = inject(PlayerService);

  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard',    icon: 'fa-gauge-high' },
    { path: '/sessions',  label: 'Sesiones',     icon: 'fa-calendar-days' },
    { path: '/stats',     label: 'Estadísticas', icon: 'fa-chart-bar' },
    { path: '/profile',   label: 'Perfil',       icon: 'fa-user' },
  ];

  get player() { return this.playerSvc.player; }

  get initials(): string {
    return this.player.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
  }

  get positionLabel(): string {
    const map: Record<string,string> = {
      setter:'Armador','outside-hitter':'Punta',
      opposite:'Opuesto','middle-blocker':'Central',libero:'Líbero',
    };
    return map[this.player.position] ?? 'Jugador';
  }

  logout() { this.auth.logout(); }
}
