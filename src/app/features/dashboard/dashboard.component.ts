import {
  Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { PlayerService } from '../../core/services/player.service';
import { SessionService, DashboardStats } from '../../core/services/session.service';
import { ThemeService } from '../../core/services/theme.service';
import { ACTION_LABELS } from '../../core/models/session.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, StatCardComponent],
  template: `
    <div class="layout-app">
      <app-navbar></app-navbar>

      <main class="layout-main">
        <div class="page-container route-container">

          <!-- Header -->
          <div class="page-header">
            <div>
              <p class="page-label">Dashboard</p>
              <h1 class="page-title">¡Hola, {{ firstName }}! 👋</h1>
              <p class="page-subtitle">{{ positionLabel }} · {{ player.experienceYears }} años de experiencia</p>
            </div>
            <a routerLink="/sessions" class="btn-primary" style="align-self:flex-start;">
              <i class="fa-solid fa-plus"></i>
              Registrar Sesión
            </a>
          </div>

          <!-- KPI cards -->
          <div class="grid grid-1 gap-4 mb-6" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));">
            <app-stat-card
              label="Efectividad Global"
              [value]="stats.globalEffectiveness + '%'"
              icon="fa-bullseye"
              iconBg="rgba(254,229,137,.25)"
              iconColor="var(--accent-dark)"
              valueColor="var(--accent-dark)"
              [trend]="5"
              subtitle="Promedio de todas las sesiones">
            </app-stat-card>
            <app-stat-card
              label="Total Acciones"
              [value]="stats.totalActions.toLocaleString()"
              icon="fa-hand-fist"
              iconBg="rgba(65,90,128,.12)"
              iconColor="var(--primary)"
              valueColor="var(--primary)"
              subtitle="Acciones técnicas registradas">
            </app-stat-card>
            <app-stat-card
              label="Sesiones"
              [value]="stats.totalSessions.toString()"
              icon="fa-calendar-check"
              iconBg="rgba(177,228,211,.3)"
              iconColor="var(--mint-dark)"
              valueColor="var(--mint-dark)"
              [subtitle]="stats.totalErrors + ' errores totales'">
            </app-stat-card>
          </div>

          <!-- Charts row -->
          <div class="grid grid-1 gap-6 mb-6 lg:grid-3">
            <!-- Weekly line chart -->
            <div class="card lg:col-2">
              <p class="section-title">
                <i class="fa-solid fa-chart-line" style="color:var(--accent-dark);"></i>
                Evolución Semanal (Efectividad %)
              </p>
              <div class="chart-md"><canvas #weeklyChart></canvas></div>
            </div>

            <!-- Session type donut -->
            <div class="card">
              <p class="section-title">
                <i class="fa-solid fa-chart-pie" style="color:var(--accent-dark);"></i>
                Tipo de Sesión
              </p>
              <div class="chart-sm" style="display:flex;align-items:center;justify-content:center;">
                <canvas #typeChart></canvas>
              </div>
              <div style="display:flex;justify-content:center;gap:1rem;margin-top:.5rem;">
                <span style="display:flex;align-items:center;gap:.4rem;font-size:.7rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--text-muted);">
                  <span style="width:.6rem;height:.6rem;border-radius:50%;background:var(--primary);display:inline-block;"></span>Entrenamiento
                </span>
                <span style="display:flex;align-items:center;gap:.4rem;font-size:.7rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--text-muted);">
                  <span style="width:.6rem;height:.6rem;border-radius:50%;background:var(--accent-dark);display:inline-block;"></span>Partido
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom row -->
          <div class="grid grid-1 gap-6 mb-6 lg:grid-3">
            <!-- Actions bar chart -->
            <div class="card lg:col-2">
              <p class="section-title">
                <i class="fa-solid fa-chart-bar" style="color:var(--accent-dark);"></i>
                Acciones Técnicas por Categoría
              </p>
              <div class="chart-md"><canvas #actionsChart></canvas></div>
            </div>

            <!-- Active goals -->
            <div class="card">
              <p class="section-title">
                <i class="fa-solid fa-bullseye" style="color:var(--accent-dark);"></i>
                Mis Metas Activas
              </p>
              <div class="space-y-4">
                @for (goal of goals.slice(0,3); track goal.id) {
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem;">
                      <span style="font-size:.75rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:75%;">
                        {{ goal.name }}
                      </span>
                      <span style="font-size:.8rem;font-weight:900;font-family:Montserrat,sans-serif;color:var(--primary);flex-shrink:0;margin-left:.5rem;">
                        {{ goal.currentEffectiveness }}%
                      </span>
                    </div>
                    <div class="progress-bar-track">
                      <div class="progress-bar-fill"
                           [style.width.%]="goal.currentEffectiveness"
                           [style.background]="goalColor(goal.currentEffectiveness, goal.targetEffectiveness)">
                      </div>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-top:.2rem;">
                      <span style="font-size:.65rem;color:var(--text-muted);">Meta: {{ goal.targetEffectiveness }}%</span>
                      <span style="font-size:.65rem;font-weight:700;"
                            [style.color]="goalColor(goal.currentEffectiveness, goal.targetEffectiveness)">
                        {{ goal.currentEffectiveness >= goal.targetEffectiveness ? '✓ Cumplida' : 'En progreso' }}
                      </span>
                    </div>
                  </div>
                }
              </div>
              <a routerLink="/stats"
                 style="display:block;text-align:center;margin-top:1rem;font-size:.75rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--primary-light);text-decoration:none;">
                Ver todas las metas →
              </a>
            </div>
          </div>

          <!-- Recent sessions table -->
          <div class="card">
            <p class="section-title">
              <i class="fa-solid fa-clock-rotate-left" style="color:var(--accent-dark);"></i>
              Última Actividad
            </p>
            <div class="overflow-x-auto">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th class="hidden-sm">Duración</th>
                    <th>Efectividad</th>
                    <th class="hidden-md">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  @for (session of recentSessions; track session.id) {
                    <tr>
                      <td style="font-weight:600;">{{ fmtDate(session.date) }}</td>
                      <td>
                        <span [class]="session.type === 'training' ? 'badge-primary' : 'badge-accent'">
                          {{ session.type === 'training' ? 'Entrenamiento' : 'Partido' }}
                        </span>
                      </td>
                      <td class="hidden-sm" style="color:var(--text-muted);">{{ session.duration }} min</td>
                      <td>
                        <span style="font-weight:900;font-family:Montserrat,sans-serif;"
                              [style.color]="effColor(sessionEff(session))">
                          {{ sessionEff(session) }}%
                        </span>
                      </td>
                      <td class="hidden-md">
                        <span style="color:var(--accent-dark);">{{ '★'.repeat(session.generalRating) }}</span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <a routerLink="/sessions"
               style="display:block;text-align:center;margin-top:1rem;font-size:.75rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--primary-light);text-decoration:none;">
              Ver todas las sesiones →
            </a>
          </div>

        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('weeklyChart')  weeklyRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('typeChart')    typeRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('actionsChart') actionsRef!:ElementRef<HTMLCanvasElement>;

  private playerSvc  = inject(PlayerService);
  private sessionSvc = inject(SessionService);
  private themeSvc   = inject(ThemeService);
  private charts: Chart[] = [];

  get player()        { return this.playerSvc.player; }
  get firstName()     { return this.player.name.split(' ')[0]; }
  get positionLabel() {
    const m: Record<string,string> = { setter:'Armador','outside-hitter':'Punta',opposite:'Opuesto','middle-blocker':'Central',libero:'Líbero' };
    return m[this.player.position] ?? 'Jugador';
  }
  get stats(): DashboardStats { return this.sessionSvc.getDashboardStats(); }
  get goals()         { return this.sessionSvc.goals; }
  get recentSessions(){ return this.sessionSvc.sessions.slice(0,5); }

  private get isDark() { return this.themeSvc.isDark; }
  private get gridColor() { return this.isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; }
  private get tickColor() { return this.isDark ? '#7B90B0' : '#5D6B84'; }

  ngAfterViewInit(): void {
    const s = this.stats;
    this.buildWeekly(s);
    this.buildType();
    this.buildActions(s);
  }
  ngOnDestroy(): void { this.charts.forEach(c => c.destroy()); }

  private buildWeekly(s: DashboardStats): void {
    this.charts.push(new Chart(this.weeklyRef.nativeElement, {
      type: 'line',
      data: {
        labels: s.weeklyData.map(d => d.label),
        datasets: [{
          label: 'Efectividad %',
          data: s.weeklyData.map(d => d.value),
          borderColor: '#415A80',
          backgroundColor: 'rgba(65,90,128,.12)',
          borderWidth: 3, tension: .4, fill: true,
          pointBackgroundColor: '#FEE589',
          pointBorderColor: '#415A80',
          pointRadius: 5, pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min:0, max:100, grid:{ color:this.gridColor }, ticks:{ callback:v=>v+'%', color:this.tickColor, font:{size:11} } },
          x: { grid:{ display:false }, ticks:{ color:this.tickColor, font:{size:11} } },
        },
      },
    }));
  }

  private buildType(): void {
    const training = this.sessionSvc.sessions.filter(s => s.type==='training').length;
    const match    = this.sessionSvc.sessions.filter(s => s.type==='match').length;
    this.charts.push(new Chart(this.typeRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Entrenamiento','Partido'],
        datasets: [{ data:[training,match], backgroundColor:['#415A80','#D4B843'], borderWidth:0, hoverOffset:6 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '72%',
        plugins: { legend:{ display:false }, tooltip:{ callbacks:{ label:ctx=>` ${ctx.label}: ${ctx.raw}` } } },
      },
    }));
  }

  private buildActions(s: DashboardStats): void {
    const COLORS = ['#415A80','#6A7FA7','#B1E4D3','#D4B843','#7DCFB8','#2a3d5a'];
    this.charts.push(new Chart(this.actionsRef.nativeElement, {
      type: 'bar',
      data: {
        labels: s.categoryStats.map(c => ACTION_LABELS[c.category]),
        datasets: [
          { label:'Total',     data:s.categoryStats.map(c=>c.totalActions),     backgroundColor:COLORS.map(c=>c+'55'), borderColor:COLORS, borderWidth:2, borderRadius:6 },
          { label:'Efectivas', data:s.categoryStats.map(c=>c.effectiveActions), backgroundColor:COLORS, borderRadius:6 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend:{ position:'top', labels:{ font:{size:11}, boxWidth:12, color:this.tickColor } } },
        scales: {
          y: { grid:{ color:this.gridColor }, ticks:{ color:this.tickColor, font:{size:11} } },
          x: { grid:{ display:false }, ticks:{ color:this.tickColor, font:{size:11} } },
        },
      },
    }));
  }

  goalColor(c: number, t: number): string {
    const r = c/t;
    if (r>=1)   return 'var(--success)';
    if (r>=.7)  return 'var(--accent-dark)';
    return 'var(--danger)';
  }
  effColor(e: number): string {
    if (e>=80) return 'var(--success)';
    if (e>=60) return 'var(--accent-dark)';
    return 'var(--danger)';
  }
  sessionEff(s: {actions:{totalActions:number;effectiveActions:number}[]}): number {
    const t = s.actions.reduce((acc,a)=>acc+a.totalActions,0);
    const e = s.actions.reduce((acc,a)=>acc+a.effectiveActions,0);
    return t>0 ? Math.round((e/t)*100) : 0;
  }
  fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('es-CO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
  }
}
