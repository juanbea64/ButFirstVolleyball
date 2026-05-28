import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface AuthUser {
  email: string;
  name: string;
}

const MOCK_CREDENTIALS = [
  { email: 'jugador@voley.com', password: '123456', name: 'Alex García' },
  { email: 'alex@voley.com',    password: '123456', name: 'Alex García' },
  { email: 'demo@voley.com',    password: 'demo',   name: 'Demo User'  },
];

const SESSION_KEY = 'bfv_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<AuthUser | null>(this.restoreSession());

  readonly user$ = this._user$.asObservable();

  constructor(private router: Router) {}

  get isLoggedIn(): boolean {
    return this._user$.value !== null;
  }

  get currentUser(): AuthUser | null {
    return this._user$.value;
  }

  login(email: string, password: string): { success: boolean; error?: string } {
    const found = MOCK_CREDENTIALS.find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (!found) {
      return { success: false, error: 'Credenciales incorrectas. Prueba jugador@voley.com / 123456' };
    }
    const user: AuthUser = { email: found.email, name: found.name };
    this._user$.next(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { success: true };
  }

  logout(): void {
    this._user$.next(null);
    localStorage.removeItem(SESSION_KEY);
    this.router.navigate(['/login']);
  }

  private restoreSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
