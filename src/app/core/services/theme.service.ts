import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const KEY = 'bfv_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _dark$ = new BehaviorSubject<boolean>(this.init());

  readonly dark$ = this._dark$.asObservable();
  get isDark() { return this._dark$.value; }

  toggle(): void {
    const next = !this._dark$.value;
    this._dark$.next(next);
    localStorage.setItem(KEY, next ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  }

  private init(): boolean {
    const stored = localStorage.getItem(KEY);
    const isDark = stored === 'dark'
      || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    return isDark;
  }
}
