import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent],
  template: `
    <div class="login-page">

      <!-- Background decoration blobs -->
      <div class="login-blobs" aria-hidden="true">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>

      <div class="login-wrapper animate-fade-in">

        <!-- Logo + Brand -->
        <div class="login-brand">
          <app-logo [size]="260"></app-logo>
        </div>
        <p class="login-tagline">Eleva tu mente, eleva tu juego</p>

        <!-- Card -->
        <div class="login-card">

          <!-- Tabs -->
          <div class="login-tabs">
            <button class="login-tab" [class.active]="mode==='login'"
                    (click)="mode='login'">Iniciar Sesión</button>
            <button class="login-tab" [class.active]="mode==='register'"
                    (click)="mode='register'">Registrarse</button>
          </div>

          <div class="login-form-body">

            <!-- ── Login form ── -->
            @if (mode === 'login') {
              <form (ngSubmit)="onLogin()" class="login-form">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-envelope" style="color:var(--primary);margin-right:.35rem;"></i>
                    Correo electrónico
                  </label>
                  <input type="email" name="email" [(ngModel)]="email" required
                         placeholder="jugador@voley.com" class="input-field">
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-lock" style="color:var(--primary);margin-right:.35rem;"></i>
                    Contraseña
                  </label>
                  <div style="position:relative;">
                    <input [type]="showPass ? 'text' : 'password'"
                           name="password" [(ngModel)]="password" required
                           placeholder="••••••" class="input-field" style="padding-right:3rem;">
                    <button type="button" (click)="showPass=!showPass"
                            style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);
                                   color:var(--text-muted);background:none;border:none;cursor:pointer;font-size:.95rem;">
                      <i class="fa-solid" [class.fa-eye]="!showPass" [class.fa-eye-slash]="showPass"></i>
                    </button>
                  </div>
                </div>

                @if (errorMsg) {
                  <div class="alert alert-error">
                    <i class="fa-solid fa-circle-exclamation"></i>{{ errorMsg }}
                  </div>
                }

                <button type="submit" [disabled]="loading" class="btn-primary" style="width:100%;">
                  <i class="fa-solid" [class.fa-spinner]="loading" [class.fa-right-to-bracket]="!loading"
                     [class.animate-spin]="loading"></i>
                  {{ loading ? 'Iniciando…' : 'Iniciar Sesión' }}
                </button>

                <!-- Demo hint -->
                <div class="alert alert-info" style="flex-direction:column;align-items:flex-start;gap:.2rem;">
                  <p style="font-weight:700;font-family:Montserrat,sans-serif;font-size:.75rem;">
                    <i class="fa-solid fa-circle-info" style="margin-right:.3rem;"></i>
                    Credenciales de prueba:
                  </p>
                  <p style="font-size:.8rem;">📧 jugador&#64;voley.com</p>
                  <p style="font-size:.8rem;">🔑 123456</p>
                </div>
              </form>
            }

            <!-- ── Register form ── -->
            @if (mode === 'register') {
              <form (ngSubmit)="onRegister()" class="login-form">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-user" style="color:var(--primary);margin-right:.35rem;"></i>
                    Nombre completo
                  </label>
                  <input type="text" name="regName" [(ngModel)]="regName" required
                         placeholder="Tu nombre" class="input-field">
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-envelope" style="color:var(--primary);margin-right:.35rem;"></i>
                    Correo electrónico
                  </label>
                  <input type="email" name="regEmail" [(ngModel)]="regEmail" required
                         placeholder="tu@correo.com" class="input-field">
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-lock" style="color:var(--primary);margin-right:.35rem;"></i>
                    Contraseña
                  </label>
                  <input type="password" name="regPass" [(ngModel)]="regPass" required
                         placeholder="Mínimo 6 caracteres" class="input-field">
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <i class="fa-solid fa-volleyball" style="color:var(--primary);margin-right:.35rem;"></i>
                    Posición principal
                  </label>
                  <select name="regPos" [(ngModel)]="regPos" class="input-field">
                    <option value="outside-hitter">Punta</option>
                    <option value="setter">Armador</option>
                    <option value="opposite">Opuesto</option>
                    <option value="middle-blocker">Central</option>
                    <option value="libero">Líbero</option>
                  </select>
                </div>

                @if (errorMsg) {
                  <div class="alert alert-error">
                    <i class="fa-solid fa-circle-exclamation"></i>{{ errorMsg }}
                  </div>
                }

                <button type="submit" [disabled]="loading" class="btn-primary" style="width:100%;">
                  <i class="fa-solid fa-user-plus"></i>
                  Crear cuenta
                </button>
                <p style="font-size:.75rem;color:var(--text-muted);text-align:center;">
                  Demo: se usarán datos de ejemplo.
                </p>
              </form>
            }
          </div>
        </div>

        <p class="login-footer">© 2024 But First, Volleyball · Bogotá, Colombia</p>
      </div>
    </div>
  `,
  styles: [`
    /* ── Fondo claro ────────────────────────────────────────────── */
    .login-page {
      min-height: 100vh;
      background: linear-gradient(150deg, #EEF1F8 0%, #F4F6FB 50%, #EEEFF2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      position: relative;
      overflow: hidden;
    }

    /* ── Blobs decorativos (suaves sobre fondo claro) ───────────── */
    .login-blobs { position:absolute; inset:0; pointer-events:none; }
    .blob        { position:absolute; border-radius:50%; filter:blur(80px); }
    .blob-1 { width:500px; height:500px; background:#415A80; opacity:.07; top:-150px; right:-120px; }
    .blob-2 { width:380px; height:380px; background:#B1E4D3; opacity:.35; bottom:-120px; left:-100px; }
    .blob-3 { width:260px; height:260px; background:#FEE589; opacity:.30; top:30%; left:60%; }

    /* ── Wrapper central ────────────────────────────────────────── */
    .login-wrapper {
      position: relative;
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .75rem;
    }

    /* ── Área del logo — sin filtros, el PNG se ve limpio en fondo claro ── */
    .login-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Tagline — oscuro y legible sobre fondo claro ───────────── */
    .login-tagline {
      font-size: .82rem;
      font-style: italic;
      font-family: 'Montserrat', sans-serif;
      color: #6A7FA7;
      letter-spacing: .04em;
      margin: 0 0 .5rem;
    }

    /* ── Tarjeta oscura (contraste con fondo claro) ────────────── */
    .login-card {
      width: 100%;
      background: #1E2B3A;
      border-radius: 1.5rem;
      box-shadow:
        0 20px 60px rgba(30,43,58,.30),
        0 4px 16px  rgba(30,43,58,.20);
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.06);
    }

    /* ── Tabs ───────────────────────────────────────────────────── */
    .login-tabs { display:flex; }
    .login-tab {
      flex: 1;
      padding: 1rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: .76rem;
      text-transform: uppercase;
      letter-spacing: .09em;
      color: rgba(255,255,255,.4);
      background: rgba(255,255,255,.04);
      border: none;
      cursor: pointer;
      transition: background 200ms, color 200ms;
      &.active {
        background: #FEE589;
        color: #1E2B3A;
      }
    }

    /* ── Cuerpo del formulario ──────────────────────────────────── */
    .login-form-body { padding: 1.75rem; }
    .login-form      { display:flex; flex-direction:column; gap:1.1rem; }

    /* ── Pie de página ──────────────────────────────────────────── */
    .login-footer {
      font-size: .7rem;
      color: #8fa0b8;
      text-align: center;
      margin-top: .25rem;
    }

    /* ── Inputs sobre fondo oscuro ──────────────────────────────── */
    .login-card .input-field {
      background: rgba(255,255,255,.07) !important;
      border: 1.5px solid rgba(255,255,255,.12) !important;
      color: #fff !important;
    }
    .login-card .input-field::placeholder { color: rgba(255,255,255,.3) !important; }
    .login-card .input-field:focus {
      background: rgba(255,255,255,.11) !important;
      border-color: #FEE589 !important;
      outline: none;
      box-shadow: 0 0 0 3px rgba(254,229,137,.15) !important;
    }
    .login-card .form-label {
      color: rgba(255,255,255,.65) !important;
      font-weight: 700;
    }
    /* icono de candado/sobre en los labels */
    .login-card .form-label i { color: #FEE589 !important; }
    .login-card select.input-field {
      color: #fff !important;
      option { background: #1E2B3A; color: #fff; }
    }

    /* Botón toggle mostrar/ocultar contraseña */
    .login-card button[type="button"] { color: rgba(255,255,255,.45) !important; }

    /* Alert credenciales de prueba */
    .login-card .alert-info {
      background: rgba(254,229,137,.08) !important;
      border: 1px solid rgba(254,229,137,.2) !important;
      color: #FEE589 !important;
      border-radius: .75rem;
    }
    .login-card .alert-info p { color: rgba(255,255,255,.75) !important; }
    .login-card .alert-info p:first-child { color: #FEE589 !important; }

    .login-card .alert-error {
      background: rgba(248,113,113,.1) !important;
      border: 1px solid rgba(248,113,113,.25) !important;
      color: #fca5a5 !important;
      border-radius: .75rem;
    }
  `],
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  mode: 'login' | 'register' = 'login';
  email = ''; password = ''; showPass = false; errorMsg = ''; loading = false;
  regName = ''; regEmail = ''; regPass = ''; regPos = 'outside-hitter';

  onLogin(): void {
    this.errorMsg = '';
    if (!this.email || !this.password) { this.errorMsg = 'Por favor completa todos los campos.'; return; }
    this.loading = true;
    setTimeout(() => {
      const r = this.auth.login(this.email, this.password);
      this.loading = false;
      if (r.success) this.router.navigate(['/dashboard']);
      else this.errorMsg = r.error ?? 'Error al iniciar sesión.';
    }, 800);
  }

  onRegister(): void {
    if (!this.regName || !this.regEmail || !this.regPass) { this.errorMsg = 'Completa todos los campos.'; return; }
    this.loading = true;
    setTimeout(() => {
      this.auth.login('jugador@voley.com', '123456');
      this.loading = false;
      this.router.navigate(['/dashboard']);
    }, 800);
  }
}
