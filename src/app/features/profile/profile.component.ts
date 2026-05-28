import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PlayerService } from '../../core/services/player.service';
import { SessionService } from '../../core/services/session.service';
import { Player, POSITION_LABELS } from '../../core/models/player.model';

@Component({
  selector: 'app-profile',
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
              <p class="page-label">Mi Cuenta</p>
              <h1 class="page-title">Perfil del Jugador</h1>
            </div>
          </div>

          <div class="grid grid-1 gap-6 lg:grid-3">

            <!-- ── Profile card (left) ── -->
            <div class="card profile-card">
              <!-- Avatar -->
              <div style="position:relative;display:inline-block;margin-bottom:1rem;">
                <div class="profile-avatar">{{ initials }}</div>
                <div style="position:absolute;bottom:0;right:0;width:2rem;height:2rem;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.9rem;box-shadow:var(--shadow-sm);">
                  🏐
                </div>
              </div>

              <h2 style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.15rem;color:var(--text);margin:0 0 .2rem;">{{ player.name }}</h2>
              <p style="font-family:Montserrat,sans-serif;font-weight:700;font-size:.8rem;color:var(--accent-dark);">{{ positionLabel }}</p>
              <p style="font-size:.75rem;color:var(--text-muted);margin-top:.25rem;">{{ player.email }}</p>

              <!-- KPIs -->
              <div class="profile-kpis">
                <div style="text-align:center;">
                  <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.6rem;color:var(--primary);">{{ globalEff }}%</p>
                  <p style="font-size:.6rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);">Efectividad</p>
                </div>
                <div style="text-align:center;">
                  <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.6rem;color:var(--accent-dark);">{{ totalSessions }}</p>
                  <p style="font-size:.6rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);">Sesiones</p>
                </div>
                <div style="text-align:center;">
                  <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.6rem;color:var(--mint-dark);">{{ goalsCompleted }}</p>
                  <p style="font-size:.6rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);">Metas</p>
                </div>
              </div>

              <!-- Reach badges -->
              <div style="width:100%;margin-top:1.25rem;display:flex;flex-direction:column;gap:.5rem;">
                <div class="reach-badge" style="background:rgba(65,90,128,.1);">
                  <span style="font-size:.75rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--primary);">⚡ Alcance Ataque</span>
                  <span style="font-family:Montserrat,sans-serif;font-weight:900;color:var(--primary);">{{ player.attackReach }} cm</span>
                </div>
                <div class="reach-badge" style="background:rgba(177,228,211,.2);">
                  <span style="font-size:.75rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--mint-dark);">🛡️ Alcance Bloqueo</span>
                  <span style="font-family:Montserrat,sans-serif;font-weight:900;color:var(--mint-dark);">{{ player.blockReach }} cm</span>
                </div>
              </div>
            </div>

            <!-- ── Edit form (right, 2 cols) ── -->
            <div class="card lg:col-2">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;">
                <p class="section-title" style="margin-bottom:0;">
                  <i class="fa-solid fa-user-pen" style="color:var(--accent-dark);"></i>
                  Datos Personales y Deportivos
                </p>
                <button (click)="editing=!editing" class="btn-ghost" style="padding:.5rem .85rem;font-size:.75rem;">
                  <i class="fa-solid" [class.fa-pen]="!editing" [class.fa-xmark]="editing"></i>
                  {{ editing ? 'Cancelar' : 'Editar' }}
                </button>
              </div>

              <form (ngSubmit)="saveProfile()" class="space-y-4">
                <div class="grid grid-1 gap-4 sm:grid-2">
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-user" style="color:var(--primary);margin-right:.3rem;"></i>Nombre Completo</label>
                    <input type="text" [(ngModel)]="draft.name" name="name" [disabled]="!editing" class="input-field">
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-envelope" style="color:var(--primary);margin-right:.3rem;"></i>Correo</label>
                    <input type="email" [(ngModel)]="draft.email" name="email" [disabled]="!editing" class="input-field">
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-cake-candles" style="color:var(--primary);margin-right:.3rem;"></i>Edad</label>
                    <input type="number" [(ngModel)]="draft.age" name="age" min="10" max="60" [disabled]="!editing" class="input-field">
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-volleyball" style="color:var(--primary);margin-right:.3rem;"></i>Posición</label>
                    <select [(ngModel)]="draft.position" name="position" [disabled]="!editing" class="input-field">
                      <option value="outside-hitter">Punta</option>
                      <option value="setter">Armador</option>
                      <option value="opposite">Opuesto</option>
                      <option value="middle-blocker">Central</option>
                      <option value="libero">Líbero</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-hand" style="color:var(--primary);margin-right:.3rem;"></i>Mano Dominante</label>
                    <select [(ngModel)]="draft.dominantHand" name="dominantHand" [disabled]="!editing" class="input-field">
                      <option value="right">Derecha</option>
                      <option value="left">Izquierda</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-star" style="color:var(--primary);margin-right:.3rem;"></i>Años de Experiencia</label>
                    <input type="number" [(ngModel)]="draft.experienceYears" name="exp" min="0" max="30" [disabled]="!editing" class="input-field">
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-ruler-vertical" style="color:var(--primary);margin-right:.3rem;"></i>Alcance Ataque (cm)</label>
                    <input type="number" [(ngModel)]="draft.attackReach" name="attackReach" min="200" max="400" [disabled]="!editing" class="input-field">
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="fa-solid fa-ruler" style="color:var(--primary);margin-right:.3rem;"></i>Alcance Bloqueo (cm)</label>
                    <input type="number" [(ngModel)]="draft.blockReach" name="blockReach" min="200" max="400" [disabled]="!editing" class="input-field">
                  </div>
                </div>

                @if (editing) {
                  <div style="display:flex;gap:.75rem;padding-top:.5rem;">
                    <button type="submit" class="btn-primary">
                      <i class="fa-solid fa-floppy-disk"></i> Guardar Cambios
                    </button>
                    <button type="button" (click)="cancelEdit()" class="btn-outline">Cancelar</button>
                  </div>
                }

                @if (savedMsg) {
                  <div class="alert alert-success">
                    <i class="fa-solid fa-circle-check"></i>{{ savedMsg }}
                  </div>
                }
              </form>
            </div>
          </div>

          <!-- ── Bottom row ── -->
          <div class="grid grid-1 gap-6 mt-6 lg:grid-2">

            <!-- Reach history -->
            <div class="card">
              <p class="section-title">
                <i class="fa-solid fa-trophy" style="color:var(--accent-dark);"></i>
                Registro de Alcances y Logros
              </p>
              <div class="space-y-3">
                @for (item of reachHistory; track item.date) {
                  <div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--border);">
                    <div>
                      <p style="font-family:Montserrat,sans-serif;font-weight:700;font-size:.82rem;color:var(--text);">{{ item.label }}</p>
                      <p style="font-size:.7rem;color:var(--text-muted);">{{ item.date }}</p>
                    </div>
                    <div style="text-align:right;">
                      <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.2rem;" [style.color]="item.color">{{ item.value }}</p>
                      <p style="font-size:.65rem;color:var(--text-muted);">Target: {{ item.target }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Activity summary -->
            <div class="card">
              <p class="section-title">
                <i class="fa-solid fa-chart-simple" style="color:var(--accent-dark);"></i>
                Resumen de Actividad
              </p>
              <div class="space-y-4">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:.75rem;">
                  <span style="font-size:.82rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--text-muted);">Entrenamientos</span>
                  <div style="display:flex;align-items:center;gap:.75rem;">
                    <div class="progress-bar-track" style="width:8rem;">
                      <div class="progress-bar-fill bg-primary"
                           [style.width.%]="(trainingSessions/totalSessions)*100||0"
                           style="background:var(--primary);"></div>
                    </div>
                    <span style="font-family:Montserrat,sans-serif;font-weight:800;color:var(--primary);width:1.5rem;text-align:right;">{{ trainingSessions }}</span>
                  </div>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:.75rem;">
                  <span style="font-size:.82rem;font-weight:700;font-family:Montserrat,sans-serif;color:var(--text-muted);">Partidos</span>
                  <div style="display:flex;align-items:center;gap:.75rem;">
                    <div class="progress-bar-track" style="width:8rem;">
                      <div class="progress-bar-fill"
                           [style.width.%]="(matchSessions/totalSessions)*100||0"
                           style="background:var(--accent-dark);"></div>
                    </div>
                    <span style="font-family:Montserrat,sans-serif;font-weight:800;color:var(--accent-dark);width:1.5rem;text-align:right;">{{ matchSessions }}</span>
                  </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding-top:.75rem;border-top:1px solid var(--border);">
                  <div style="background:rgba(65,90,128,.1);border-radius:var(--r-xl);padding:.85rem;text-align:center;">
                    <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.6rem;color:var(--primary);">{{ globalEff }}%</p>
                    <p style="font-size:.6rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--primary);">Efectividad</p>
                  </div>
                  <div style="background:rgba(212,184,67,.15);border-radius:var(--r-xl);padding:.85rem;text-align:center;">
                    <p style="font-family:Montserrat,sans-serif;font-weight:900;font-size:1.6rem;color:var(--accent-dark);">{{ goalsCompleted }}/{{ totalGoals }}</p>
                    <p style="font-size:.6rem;font-weight:700;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--accent-dark);">Metas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .profile-card { text-align:center; display:flex; flex-direction:column; align-items:center; padding:1.75rem 1.25rem; }
    .profile-avatar {
      width:5.5rem; height:5.5rem;
      border-radius:50%;
      background:linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
      color:#fff;
      display:flex; align-items:center; justify-content:center;
      font-family:'Montserrat',sans-serif;
      font-weight:900; font-size:1.75rem;
      box-shadow: var(--shadow-lg);
    }
    .profile-kpis {
      display:grid; grid-template-columns:repeat(3,1fr);
      gap:.5rem; width:100%;
      margin-top:1.25rem; padding-top:1.25rem;
      border-top:1px solid var(--border);
    }
    .reach-badge {
      display:flex; align-items:center; justify-content:space-between;
      padding:.6rem .85rem;
      border-radius:var(--r-lg);
    }
  `],
})
export class ProfileComponent {
  private playerSvc  = inject(PlayerService);
  private sessionSvc = inject(SessionService);

  editing = false; savedMsg = ''; draft!: Player;

  constructor() { this.syncDraft(); }

  get player()        { return this.playerSvc.player; }
  get positionLabel() { return POSITION_LABELS[this.player.position] ?? 'Jugador'; }
  get initials()      { return this.player.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase(); }

  get totalSessions()    { return this.sessionSvc.sessions.length; }
  get trainingSessions() { return this.sessionSvc.sessions.filter(s=>s.type==='training').length; }
  get matchSessions()    { return this.sessionSvc.sessions.filter(s=>s.type==='match').length; }
  get globalEff()        { return this.sessionSvc.getDashboardStats().globalEffectiveness; }
  get goals()            { return this.sessionSvc.goals; }
  get totalGoals()       { return this.goals.length; }
  get goalsCompleted()   { return this.goals.filter(g=>g.currentEffectiveness>=g.targetEffectiveness).length; }

  readonly reachHistory = [
    { label:'Alcance Ataque (Máx)', value:'330 cm', target:'May 2024', date:'Abr 2024', color:'var(--accent-dark)' },
    { label:'Alcance Bloqueo (Máx)', value:'315 cm', target:'May 2024', date:'Abr 2024', color:'var(--primary)' },
    { label:'Salto Vertical (cm)',   value:'85 cm',  target:'May 2024', date:'May 2024', color:'var(--mint-dark)' },
    { label:'Efectividad Prom.',     value:'78%',    target:'80%',      date:'May 2024', color:'var(--primary-light)' },
  ];

  saveProfile(): void {
    this.playerSvc.update({ ...this.draft });
    this.editing = false;
    this.savedMsg = '¡Perfil actualizado correctamente! ✓';
    setTimeout(() => { this.savedMsg = ''; }, 2500);
  }
  cancelEdit(): void { this.syncDraft(); this.editing = false; }
  private syncDraft(): void { this.draft = { ...this.playerSvc.player }; }
}
