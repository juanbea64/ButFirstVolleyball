import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SessionService } from '../../core/services/session.service';
import {
  Session, TechnicalAction, ActionCategory,
  ACTION_LABELS, ACTION_ICONS, ACTION_COLORS, STATE_LABELS
} from '../../core/models/session.model';

interface ActionForm {
  category: ActionCategory;
  totalActions: number;
  effectiveActions: number;
  enabled: boolean;
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <div class="layout-app">
      <app-navbar></app-navbar>

      <main class="layout-main">
        <div class="page-container route-container">

          <!-- Header -->
          <div class="page-header">
            <div>
              <p class="page-label">Sesiones</p>
              <h1 class="page-title">Registro de Sesiones</h1>
            </div>
            <button (click)="showForm=!showForm" class="btn-primary" style="align-self:flex-start;">
              <i class="fa-solid" [class.fa-plus]="!showForm" [class.fa-minus]="showForm"></i>
              {{ showForm ? 'Ocultar formulario' : 'Nueva sesión' }}
            </button>
          </div>

          <!-- ── Registration Form ── -->
          @if (showForm) {
            <div class="card mb-6 animate-slide-up">
              <p class="section-title">
                <i class="fa-solid fa-clipboard-list" style="color:var(--accent-dark);"></i>
                Registro de Sesión Técnica
              </p>

              <form (ngSubmit)="saveSession()">

                <!-- General fields -->
                <div class="grid grid-1 gap-4 mb-5" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));">
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-calendar" style="color:var(--primary);margin-right:.3rem;"></i>Fecha</label>
                    <input type="date" [(ngModel)]="form.date" name="date" required class="input-field">
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-clock" style="color:var(--primary);margin-right:.3rem;"></i>Hora</label>
                    <input type="time" [(ngModel)]="form.time" name="time" class="input-field">
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-volleyball" style="color:var(--primary);margin-right:.3rem;"></i>Tipo</label>
                    <select [(ngModel)]="form.type" name="type" class="input-field">
                      <option value="training">Entrenamiento</option>
                      <option value="match">Partido</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-stopwatch" style="color:var(--primary);margin-right:.3rem;"></i>Duración (min)</label>
                    <input type="number" [(ngModel)]="form.duration" name="duration" min="10" max="300" class="input-field" placeholder="90">
                  </div>
                </div>

                <!-- State & rating -->
                <div class="grid grid-1 gap-4 mb-5" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));">
                  <div class="form-group">
                    <label class="form-label">Estado Físico</label>
                    <select [(ngModel)]="form.physicalState" name="physicalState" class="input-field">
                      <option value="excellent">Excelente</option>
                      <option value="good">Bueno</option>
                      <option value="regular">Regular</option>
                      <option value="poor">Malo</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Estado Anímico</label>
                    <select [(ngModel)]="form.moodState" name="moodState" class="input-field">
                      <option value="excellent">Excelente</option>
                      <option value="good">Bueno</option>
                      <option value="regular">Regular</option>
                      <option value="poor">Malo</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Valoración General</label>
                    <div style="display:flex;gap:.25rem;margin-top:.5rem;">
                      @for (star of [1,2,3,4,5]; track star) {
                        <button type="button" (click)="form.generalRating=star"
                                class="star-btn"
                                [class.active]="star<=form.generalRating"
                                [class.inactive]="star>form.generalRating">★</button>
                      }
                    </div>
                  </div>
                </div>

                <!-- Technical actions -->
                <div class="mb-5">
                  <p class="section-title">
                    <i class="fa-solid fa-hand-fist" style="color:var(--accent-dark);"></i>
                    Acciones Técnicas
                  </p>
                  <div class="grid grid-1 gap-3" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">
                    @for (action of formActions; track action.category) {
                      <div class="action-toggle-card" [class.enabled]="action.enabled">

                        <div class="action-toggle-header">
                          <div style="display:flex;align-items:center;gap:.5rem;">
                            <div class="action-icon-sm" [style.background]="getColor(action.category)">
                              <i class="fa-solid {{ getIcon(action.category) }}"></i>
                            </div>
                            <span style="font-family:Montserrat,sans-serif;font-weight:700;font-size:.8rem;color:var(--text);">
                              {{ getLabel(action.category) }}
                            </span>
                          </div>
                          <!-- Toggle -->
                          <label class="toggle-wrap">
                            <input type="checkbox" [(ngModel)]="action.enabled" [name]="'en_'+action.category">
                            <div class="toggle-track"></div>
                          </label>
                        </div>

                        @if (action.enabled) {
                          <div class="action-toggle-body">
                            <div class="grid grid-2 gap-2">
                              <div>
                                <label class="form-label">Total</label>
                                <input type="number" [(ngModel)]="action.totalActions" [name]="'tot_'+action.category"
                                       min="0" max="500" class="input-field" style="font-size:.85rem;padding:.5rem .75rem;">
                              </div>
                              <div>
                                <label class="form-label">Efectivas</label>
                                <input type="number" [(ngModel)]="action.effectiveActions" [name]="'eff_'+action.category"
                                       min="0" [max]="action.totalActions" class="input-field" style="font-size:.85rem;padding:.5rem .75rem;">
                              </div>
                            </div>
                            <div style="margin-top:.5rem;">
                              <div style="display:flex;justify-content:space-between;font-size:.65rem;color:var(--text-muted);margin-bottom:.2rem;">
                                <span>Efectividad</span>
                                <span style="font-weight:800;" [style.color]="getColor(action.category)">
                                  {{ calcEff(action.effectiveActions, action.totalActions) }}%
                                </span>
                              </div>
                              <div class="progress-bar-track">
                                <div class="progress-bar-fill"
                                     [style.width.%]="calcEff(action.effectiveActions, action.totalActions)"
                                     [style.background]="getColor(action.category)"></div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>

                <!-- Notes -->
                <div class="form-group mb-5">
                  <label class="form-label">
                    <i class="fa-solid fa-note-sticky" style="color:var(--primary);margin-right:.3rem;"></i>
                    Observaciones
                  </label>
                  <textarea [(ngModel)]="form.notes" name="notes" rows="3"
                            placeholder="Notas sobre la sesión…"
                            class="input-field resize-none"></textarea>
                </div>

                <!-- Actions -->
                <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
                  <button type="submit" class="btn-primary">
                    <i class="fa-solid fa-floppy-disk"></i>
                    Guardar Sesión
                  </button>
                  <button type="button" (click)="resetForm()" class="btn-outline">
                    <i class="fa-solid fa-rotate-left"></i> Limpiar
                  </button>
                </div>

                @if (savedMsg) {
                  <div class="alert alert-success" style="margin-top:1rem;">
                    <i class="fa-solid fa-circle-check"></i>{{ savedMsg }}
                  </div>
                }
              </form>
            </div>
          }

          <!-- ── Session History ── -->
          <div class="card">
            <p class="section-title">
              <i class="fa-solid fa-list" style="color:var(--accent-dark);"></i>
              Historial de Sesiones ({{ sessions.length }})
            </p>

            @if (sessions.length === 0) {
              <div style="text-align:center;padding:3rem 0;color:var(--text-muted);">
                <div style="font-size:3.5rem;margin-bottom:1rem;">📋</div>
                <p style="font-family:Montserrat,sans-serif;font-weight:700;">No hay sesiones registradas aún.</p>
              </div>
            }

            <div class="space-y-3">
              @for (session of sessions; track session.id) {
                <div class="session-item">
                  <div class="session-item__top">
                    <div style="display:flex;align-items:center;gap:.75rem;">
                      <div class="session-type-icon" [class.training]="session.type==='training'" [class.match]="session.type==='match'">
                        {{ session.type === 'training' ? '🏋️' : '🏆' }}
                      </div>
                      <div>
                        <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
                          <span style="font-family:Montserrat,sans-serif;font-weight:700;font-size:.85rem;color:var(--text);">
                            {{ fmtDate(session.date) }}
                          </span>
                          <span [class]="session.type==='training' ? 'badge-primary' : 'badge-accent'">
                            {{ session.type === 'training' ? 'Entrenamiento' : 'Partido' }}
                          </span>
                        </div>
                        <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.2rem;">
                          <span style="font-size:.72rem;color:var(--text-muted);">
                            <i class="fa-solid fa-clock" style="margin-right:.2rem;"></i>{{ session.duration }} min
                          </span>
                          <span style="font-size:.72rem;color:var(--text-muted);">
                            <i class="fa-solid fa-heart" style="margin-right:.2rem;"></i>{{ stateLabel(session.physicalState) }}
                          </span>
                          <span style="font-size:.72rem;color:var(--accent-dark);">{{ '★'.repeat(session.generalRating) }}</span>
                        </div>
                      </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:.75rem;">
                      <div style="text-align:right;">
                        <p style="font-size:.65rem;color:var(--text-muted);font-family:Montserrat,sans-serif;">Efectividad</p>
                        <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.4rem;"
                           [style.color]="effColor(sessionEff(session))">
                          {{ sessionEff(session) }}%
                        </p>
                      </div>
                      <button (click)="deleteSession(session.id)"
                              style="color:var(--text-light);padding:.4rem;border-radius:.5rem;transition:all 200ms;"
                              onmouseenter="this.style.color='var(--danger)'"
                              onmouseleave="this.style.color='var(--text-light)'">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  @if (session.actions.length > 0) {
                    <div class="session-item__pills">
                      @for (action of session.actions; track action.category) {
                        <span class="action-pill" [style.background]="getColor(action.category)">
                          <i class="fa-solid {{ getIcon(action.category) }}"></i>
                          {{ getLabel(action.category) }}: {{ action.effectiveActions }}/{{ action.totalActions }}
                        </span>
                      }
                    </div>
                  }

                  @if (session.notes) {
                    <p style="font-size:.75rem;color:var(--text-muted);font-style:italic;margin-top:.5rem;padding-top:.5rem;border-top:1px solid var(--border);">
                      {{ session.notes }}
                    </p>
                  }
                </div>
              }
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .action-toggle-card {
      border: 1.5px solid var(--border);
      border-radius: var(--r-xl);
      padding: 1rem;
      background: var(--surface-2);
      opacity: .6;
      transition: all 200ms;
      &.enabled {
        opacity: 1;
        border-color: var(--primary);
        background: var(--surface);
      }
    }
    .action-toggle-header {
      display: flex; align-items: center; justify-content: space-between;
    }
    .action-toggle-body { margin-top: .75rem; }

    .action-icon-sm {
      width: 2rem; height: 2rem;
      border-radius: .5rem;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: .8rem;
    }

    .session-item {
      border: 1.5px solid var(--border);
      border-radius: var(--r-xl);
      padding: 1rem;
      background: var(--surface);
      transition: border-color 200ms, background 200ms;
      &:hover { border-color: var(--primary-light); background: var(--surface-2); }
    }
    .session-item__top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: .75rem;
      flex-wrap: wrap;
    }
    .session-type-icon {
      width: 3rem; height: 3rem;
      border-radius: .75rem;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem;
      flex-shrink: 0;
      &.training { background: rgba(65,90,128,.12); }
      &.match    { background: rgba(212,184,67,.15); }
    }
    .session-item__pills {
      display: flex; flex-wrap: wrap; gap: .4rem;
      margin-top: .75rem; padding-top: .75rem;
      border-top: 1px solid var(--border);
    }
    .action-pill {
      display: inline-flex; align-items: center; gap: .35rem;
      padding: .2rem .6rem;
      border-radius: 999px;
      font-size: .68rem;
      font-weight: 700;
      font-family: 'Montserrat', sans-serif;
      color: #fff;
      i { font-size: .62rem; }
    }
  `],
})
export class SessionsComponent {
  private sessionSvc = inject(SessionService);

  showForm = false;
  savedMsg = '';
  form  = this.defaultForm();
  formActions: ActionForm[] = this.defaultActions();

  get sessions() { return this.sessionSvc.sessions; }

  saveSession(): void {
    const actions: TechnicalAction[] = this.formActions
      .filter(a => a.enabled && a.totalActions > 0)
      .map(a => ({
        category: a.category,
        totalActions: a.totalActions,
        effectiveActions: Math.min(a.effectiveActions, a.totalActions),
        entryType: 'count' as const,
      }));

    const dateTime = this.form.date + 'T' + (this.form.time || '10:00') + ':00';
    this.sessionSvc.addSession({
      date: dateTime, type: this.form.type as 'training'|'match',
      duration: Number(this.form.duration)||90,
      physicalState: this.form.physicalState as Session['physicalState'],
      moodState:     this.form.moodState     as Session['moodState'],
      generalRating: this.form.generalRating,
      actions, notes: this.form.notes,
    });

    this.savedMsg = '¡Sesión guardada exitosamente! ✓';
    setTimeout(() => { this.savedMsg = ''; this.showForm = false; }, 2500);
    this.resetForm();
  }

  deleteSession(id: string): void {
    if (confirm('¿Eliminar esta sesión?')) this.sessionSvc.deleteSession(id);
  }

  resetForm(): void { this.form = this.defaultForm(); this.formActions = this.defaultActions(); }

  calcEff(e: number, t: number): number { return t>0 ? Math.round((e/t)*100) : 0; }
  sessionEff(s: Session): number {
    const t = s.actions.reduce((acc,a)=>acc+a.totalActions,0);
    const e = s.actions.reduce((acc,a)=>acc+a.effectiveActions,0);
    return t>0 ? Math.round((e/t)*100) : 0;
  }
  effColor(e: number): string {
    if (e>=80) return 'var(--success)'; if (e>=60) return 'var(--accent-dark)'; return 'var(--danger)';
  }
  getLabel(c: ActionCategory): string { return ACTION_LABELS[c]; }
  getIcon(c: ActionCategory): string  { return ACTION_ICONS[c]; }
  getColor(c: ActionCategory): string { return ACTION_COLORS[c]; }
  stateLabel(s: string): string       { return STATE_LABELS[s] ?? s; }
  fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  }

  private defaultForm() {
    return { date: new Date().toISOString().split('T')[0], time:'', type:'training', duration:90, physicalState:'good', moodState:'good', generalRating:4, notes:'' };
  }
  private defaultActions(): ActionForm[] {
    const cats: ActionCategory[] = ['saque','recepcion','bloqueo','ataque','defensa','colocada'];
    return cats.map(c => ({ category:c, totalActions:0, effectiveActions:0, enabled:true }));
  }
}
