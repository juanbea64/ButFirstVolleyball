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
          <app-logo [size]="72"></app-logo>
          <div class="login-brand__text">
            <h1 class="login-brand__top">But First,</h1>
            <h2 class="login-brand__name">Volleyball</h2>
          </div>
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
    .login-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #415A80 0%, #2a3d5a 60%, #1a2b3f 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
      overflow: hidden;
    }
    .login-blobs {
      position: absolute; inset: 0; pointer-events: none;
    }
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: .18;
    }
    .blob-1 { width:380px;height:380px; background:#FEE589; top:-80px; right:-80px; }
    .blob-2 { width:300px;height:300px; background:#B1E4D3; bottom:-80px; left:-60px; }
    .blob-3 { width:200px;height:200px; background:#6A7FA7; top:40%; left:30%; opacity:.08; }

    .login-wrapper {
      position: relative;
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .login-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .login-brand__text { display:flex; flex-direction:column; }
    .login-brand__top  { font-family:'Montserrat',sans-serif; font-weight:900; font-size:1rem; letter-spacing:.2em; text-transform:uppercase; color:#FEE589; line-height:1; margin:0; }
    .login-brand__name { font-family:'Montserrat',sans-serif; font-weight:900; font-size:1.65rem; letter-spacing:.12em; text-transform:uppercase; color:#fff; line-height:1.1; margin:0; }
    .login-tagline { font-size:.8rem; color:rgba(255,255,255,.5); font-style:italic; margin:0; }

    .login-card {
      width: 100%;
      background: var(--surface);
      border-radius: 1.5rem;
      box-shadow: 0 20px 60px rgba(0,0,0,.35);
      overflow: hidden;
    }
    .login-tabs {
      display: flex;
    }
    .login-tab {
      flex: 1;
      padding: 1rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: .78rem;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--text-muted);
      background: var(--surface-2);
      border: none;
      cursor: pointer;
      transition: all 200ms;
      &.active {
        background: var(--primary);
        color: #fff;
      }
    }
    .login-form-body { padding: 1.75rem; }
    .login-form { display:flex; flex-direction:column; gap:1.1rem; }

    .login-footer {
      font-size: .72rem;
      color: rgba(255,255,255,.3);
      text-align: center;
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
