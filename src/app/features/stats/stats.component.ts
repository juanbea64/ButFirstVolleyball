import {
  Component, AfterViewInit, OnDestroy, ViewChildren, QueryList, ElementRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SessionService } from '../../core/services/session.service';
import { ThemeService } from '../../core/services/theme.service';
import { ACTION_LABELS, ACTION_COLORS, ActionCategory } from '../../core/models/session.model';

Chart.register(...registerables);

// Brand-palette chart colours (replaces old vb-* colours)
const CHART_COLORS = ['#415A80','#6A7FA7','#7DCFB8','#D4B843','#B1E4D3','#2a3d5a'];

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="layout-app">
      <app-navbar></app-navbar>

      <main class="layout-main">
        <div class="page-container route-container">

          <!-- Header -->
          <div class="page-header">
            <div>
              <p class="page-label">Estadísticas</p>
              <h1 class="page-title">Métricas y Rendimiento</h1>
            </div>
          </div>

          <!-- KPI summary -->
          <div class="grid gap-4 mb-6" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));">
            <div class="card" style="text-align:center;">
              <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:2.5rem;color:var(--accent-dark);line-height:1;">{{ globalEff }}%</p>
              <p style="font-size:.65rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.09em;color:var(--text-muted);margin-top:.3rem;">Efectividad Global</p>
            </div>
            <div class="card" style="text-align:center;">
              <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:2.5rem;color:var(--primary);line-height:1;">{{ stats.totalSessions }}</p>
              <p style="font-size:.65rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.09em;color:var(--text-muted);margin-top:.3rem;">Sesiones</p>
            </div>
            <div class="card" style="text-align:center;">
              <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:2.5rem;color:var(--mint-dark);line-height:1;">{{ stats.totalActions }}</p>
              <p style="font-size:.65rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.09em;color:var(--text-muted);margin-top:.3rem;">Total Acciones</p>
            </div>
            <div class="card" style="text-align:center;">
              <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:2.5rem;color:var(--danger);line-height:1;">{{ stats.totalErrors }}</p>
              <p style="font-size:.65rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.09em;color:var(--text-muted);margin-top:.3rem;">Total Errores</p>
            </div>
          </div>

          <!-- Comparison bar chart -->
          <div class="card mb-6">
            <p class="section-title">
              <i class="fa-solid fa-chart-bar" style="color:var(--accent-dark);"></i>
              Comparativo de Efectividad por Categoría (%)
            </p>
            <div class="chart-lg"><canvas #compChart></canvas></div>
          </div>

          <!-- Doughnuts per category -->
          <div class="mb-6">
            <p class="section-title">
              <i class="fa-solid fa-chart-pie" style="color:var(--accent-dark);"></i>
              Efectividad por Acción Técnica
            </p>
            <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));">
              @for (cat of categories; track cat; let i = $index) {
                <div class="card" style="text-align:center;padding:1rem .75rem;">
                  <div class="action-icon-md mx-auto mb-2" [style.background]="getColor(cat)">
                    <i class="fa-solid {{ getIcon(cat) }}"></i>
                  </div>
                  <p style="font-family:Montserrat,sans-serif;font-weight:800;font-size:.72rem;color:var(--text);margin-bottom:.5rem;">
                    {{ getLabel(cat) }}
                  </p>
                  <div style="height:5.5rem;display:flex;align-items:center;justify-content:center;">
                    <canvas #doughnutCharts></canvas>
                  </div>
                  <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.4rem;margin-top:.4rem;"
                     [style.color]="getColor(cat)">{{ getCatStat(cat).effectiveness }}%</p>
                  <p style="font-size:.65rem;color:var(--text-muted);">
                    {{ getCatStat(cat).effectiveActions }}/{{ getCatStat(cat).totalActions }}
                  </p>
                </div>
              }
            </div>
          </div>

          <!-- Goals + trend -->
          <div class="grid grid-1 gap-6 mb-6 lg:grid-2">

            <div class="card">
              <p class="section-title">
                <i class="fa-solid fa-bullseye" style="color:var(--accent-dark);"></i>
                Progreso de Metas
              </p>
              <div class="space-y-5">
                @for (goal of goals; track goal.id) {
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.4rem;gap:.5rem;">
                      <div style="overflow:hidden;">
                        <p style="font-family:Montserrat,sans-serif;font-weight:700;font-size:.82rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                          {{ goal.name }}
                        </p>
                        <p style="font-size:.68rem;color:var(--text-muted);">Meta: {{ goal.targetEffectiveness }}% · Vence: {{ fmtDate(goal.targetDate) }}</p>
                      </div>
                      <div style="text-align:right;flex-shrink:0;">
                        <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.3rem;"
                           [style.color]="goalColor(goal.currentEffectiveness, goal.targetEffectiveness)">
                          {{ goal.currentEffectiveness }}%
                        </p>
                        <span style="font-size:.65rem;font-weight:700;padding:.1rem .5rem;border-radius:999px;"
                              [style.background]="goal.currentEffectiveness>=goal.targetEffectiveness ? 'var(--success-bg)' : 'var(--warning-bg)'"
                              [style.color]="goal.currentEffectiveness>=goal.targetEffectiveness ? 'var(--success)' : 'var(--warning)'">
                          {{ goal.currentEffectiveness>=goal.targetEffectiveness ? '✓ Cumplida' : 'En progreso' }}
                        </span>
                      </div>
                    </div>
                    <div class="progress-bar-track">
                      <div class="progress-bar-fill"
                           [style.width.%]="(goal.currentEffectiveness/goal.targetEffectiveness)*100"
                           [style.background]="goalColor(goal.currentEffectiveness,goal.targetEffectiveness)">
                      </div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:.65rem;color:var(--text-muted);margin-top:.2rem;">
                      <span>{{ goal.startDate | date:'dd MMM' }}</span>
                      <span>{{ goal.targetDate | date:'dd MMM' }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="card">
              <p class="section-title">
                <i class="fa-solid fa-chart-line" style="color:var(--accent-dark);"></i>
                Tendencia Mensual
              </p>
              <div class="chart-lg"><canvas #trendChart></canvas></div>
            </div>
          </div>

          <!-- Detail table -->
          <div class="card">
            <p class="section-title">
              <i class="fa-solid fa-table" style="color:var(--accent-dark);"></i>
              Detalle de Acciones Técnicas
            </p>
            <div class="overflow-x-auto">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th style="text-align:right;">Total</th>
                    <th style="text-align:right;">Efectivas</th>
                    <th style="text-align:right;">Errores</th>
                    <th style="text-align:right;">Efectividad</th>
                    <th class="hidden-sm">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cat of categories; track cat) {
                    <tr>
                      <td>
                        <div style="display:flex;align-items:center;gap:.5rem;">
                          <div class="action-icon-sm" [style.background]="getColor(cat)">
                            <i class="fa-solid {{ getIcon(cat) }}" style="font-size:.7rem;color:#fff;"></i>
                          </div>
                          <span style="font-family:Montserrat,sans-serif;font-weight:700;font-size:.82rem;">{{ getLabel(cat) }}</span>
                        </div>
                      </td>
                      <td style="text-align:right;font-weight:600;">{{ getCatStat(cat).totalActions }}</td>
                      <td style="text-align:right;font-weight:600;color:var(--success);">{{ getCatStat(cat).effectiveActions }}</td>
                      <td style="text-align:right;font-weight:600;color:var(--danger);">{{ getCatStat(cat).totalActions - getCatStat(cat).effectiveActions }}</td>
                      <td style="text-align:right;">
                        <span style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1rem;"
                              [style.color]="getColor(cat)">{{ getCatStat(cat).effectiveness }}%</span>
                      </td>
                      <td class="hidden-sm">
                        <div class="progress-bar-track" style="width:6rem;">
                          <div class="progress-bar-fill"
                               [style.width.%]="getCatStat(cat).effectiveness"
                               [style.background]="getColor(cat)"></div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .action-icon-sm {
      width:1.75rem;height:1.75rem;border-radius:.45rem;
      display:flex;align-items:center;justify-content:center;
      font-size:.75rem;color:#fff;flex-shrink:0;
    }
    .action-icon-md {
      width:2.25rem;height:2.25rem;border-radius:.6rem;
      display:flex;align-items:center;justify-content:center;
      font-size:.9rem;color:#fff;
    }
    .mx-auto { margin-left:auto;margin-right:auto; }
    .mb-2 { margin-bottom:.5rem; }
  `],
})
export class StatsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('doughnutCharts') doughnutRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChildren('compChart')      compRef!:       QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChildren('trendChart')     trendRef!:      QueryList<ElementRef<HTMLCanvasElement>>;

  private sessionSvc = inject(SessionService);
  private themeSvc   = inject(ThemeService);
  private charts: Chart[] = [];

  readonly categories: ActionCategory[] = ['saque','recepcion','bloqueo','ataque','defensa','colocada'];

  get stats()     { return this.sessionSvc.getDashboardStats(); }
  get goals()     { return this.sessionSvc.goals; }
  get globalEff() { return this.stats.globalEffectiveness; }

  getCatStat(cat: ActionCategory) {
    return this.stats.categoryStats.find(c=>c.category===cat)
      ?? { category:cat, totalActions:0, effectiveActions:0, effectiveness:0, color:'#ccc' };
  }

  getLabel(c: ActionCategory): string { return ACTION_LABELS[c]; }
  getColor(c: ActionCategory): string { return ACTION_COLORS[c]; }
  getIcon(c: ActionCategory): string {
    const m: Record<ActionCategory,string> = {
      saque:'fa-hand-fist',recepcion:'fa-hands',bloqueo:'fa-shield-halved',
      ataque:'fa-bolt',defensa:'fa-person-running',colocada:'fa-arrow-up'
    };
    return m[c];
  }

  goalColor(c: number, t: number): string {
    const r=c/t;
    if(r>=1) return 'var(--success)'; if(r>=.7) return 'var(--accent-dark)'; return 'var(--danger)';
  }
  fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'});
  }

  private get isDark()    { return this.themeSvc.isDark; }
  private get gridColor() { return this.isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; }
  private get tickColor() { return this.isDark ? '#7B90B0' : '#5D6B84'; }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildDoughnuts();
      this.buildComp();
      this.buildTrend();
    }, 50);
  }
  ngOnDestroy(): void { this.charts.forEach(c => c.destroy()); }

  private buildDoughnuts(): void {
    this.doughnutRefs.forEach((ref, i) => {
      const cat   = this.categories[i];
      const stat  = this.getCatStat(cat);
      const color = ACTION_COLORS[cat];
      this.charts.push(new Chart(ref.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [stat.effectiveActions, stat.totalActions-stat.effectiveActions],
            backgroundColor: [color, this.isDark ? 'rgba(255,255,255,.08)' : '#E4E6EC'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive:true, maintainAspectRatio:true,
          cutout:'75%',
          plugins:{ legend:{display:false}, tooltip:{enabled:false} },
        },
      }));
    });
  }

  private buildComp(): void {
    const ref = this.compRef.first;
    if (!ref) return;
    const s = this.stats;
    this.charts.push(new Chart(ref.nativeElement, {
      type: 'bar',
      data: {
        labels: s.categoryStats.map(c=>ACTION_LABELS[c.category]),
        datasets: [{
          label:'Efectividad %',
          data: s.categoryStats.map(c=>c.effectiveness),
          backgroundColor: CHART_COLORS,
          borderRadius: 8,
        }],
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins: { legend:{display:false} },
        scales: {
          y: { min:0, max:100, grid:{color:this.gridColor}, ticks:{callback:v=>v+'%', color:this.tickColor} },
          x: { grid:{display:false}, ticks:{color:this.tickColor} },
        },
      },
    }));
  }

  private buildTrend(): void {
    const ref = this.trendRef.first;
    if (!ref) return;
    this.charts.push(new Chart(ref.nativeElement, {
      type: 'line',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun'],
        datasets: [{
          label:'Efectividad %',
          data: [62,67,70,72,75,this.globalEff],
          borderColor: '#415A80',
          backgroundColor: 'rgba(65,90,128,.1)',
          borderWidth: 3, tension: .4, fill: true,
          pointBackgroundColor: '#FEE589',
          pointBorderColor: '#415A80',
          pointRadius: 5,
        }],
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false} },
        scales: {
          y: { min:50, max:100, grid:{color:this.gridColor}, ticks:{callback:v=>v+'%', color:this.tickColor} },
          x: { grid:{display:false}, ticks:{color:this.tickColor} },
        },
      },
    }));
  }
}
