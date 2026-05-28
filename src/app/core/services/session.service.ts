import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Session, Goal, TechnicalAction, ActionCategory, ACTION_COLORS
} from '../models/session.model';

const SESSIONS_KEY = 'bfv_sessions';
const GOALS_KEY    = 'bfv_goals';

const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    date: '2024-05-12T10:15:00',
    type: 'training',
    duration: 105,
    physicalState: 'good',
    moodState: 'regular',
    generalRating: 4,
    notes: 'Buena sesión de saque y remate.',
    actions: [
      { category: 'saque',     totalActions: 23, effectiveActions: 20, entryType: 'count' },
      { category: 'recepcion', totalActions: 50, effectiveActions: 38, entryType: 'count' },
      { category: 'bloqueo',   totalActions: 55, effectiveActions: 52, entryType: 'count' },
      { category: 'ataque',    totalActions: 25, effectiveActions: 22, entryType: 'count' },
      { category: 'defensa',   totalActions: 40, effectiveActions: 35, entryType: 'count' },
      { category: 'colocada',  totalActions: 35, effectiveActions: 12, entryType: 'count' },
    ],
  },
  {
    id: 's2',
    date: '2024-05-10T15:30:00',
    type: 'match',
    duration: 90,
    physicalState: 'excellent',
    moodState: 'excellent',
    generalRating: 5,
    notes: 'Gran partido, ganamos 3-1.',
    actions: [
      { category: 'saque',     totalActions: 18, effectiveActions: 15, entryType: 'count' },
      { category: 'recepcion', totalActions: 30, effectiveActions: 25, entryType: 'count' },
      { category: 'bloqueo',   totalActions: 20, effectiveActions: 18, entryType: 'count' },
      { category: 'ataque',    totalActions: 30, effectiveActions: 22, entryType: 'count' },
      { category: 'defensa',   totalActions: 25, effectiveActions: 20, entryType: 'count' },
      { category: 'colocada',  totalActions: 10, effectiveActions:  8, entryType: 'count' },
    ],
  },
  {
    id: 's3',
    date: '2024-05-11T15:30:00',
    type: 'match',
    duration: 100,
    physicalState: 'good',
    moodState: 'good',
    generalRating: 3,
    notes: 'Perdimos 2-3, mejorar recepción.',
    actions: [
      { category: 'saque',     totalActions: 20, effectiveActions: 14, entryType: 'count' },
      { category: 'recepcion', totalActions: 35, effectiveActions: 20, entryType: 'count' },
      { category: 'bloqueo',   totalActions: 18, effectiveActions: 14, entryType: 'count' },
      { category: 'ataque',    totalActions: 28, effectiveActions: 18, entryType: 'count' },
      { category: 'defensa',   totalActions: 30, effectiveActions: 22, entryType: 'count' },
      { category: 'colocada',  totalActions:  8, effectiveActions:  5, entryType: 'count' },
    ],
  },
  {
    id: 's4',
    date: '2024-05-08T10:00:00',
    type: 'training',
    duration: 90,
    physicalState: 'regular',
    moodState: 'good',
    generalRating: 3,
    actions: [
      { category: 'saque',     totalActions: 25, effectiveActions: 15, entryType: 'count' },
      { category: 'recepcion', totalActions: 40, effectiveActions: 24, entryType: 'count' },
      { category: 'bloqueo',   totalActions: 22, effectiveActions: 16, entryType: 'count' },
      { category: 'ataque',    totalActions: 20, effectiveActions: 14, entryType: 'count' },
      { category: 'defensa',   totalActions: 35, effectiveActions: 25, entryType: 'count' },
      { category: 'colocada',  totalActions: 12, effectiveActions:  7, entryType: 'count' },
    ],
  },
  {
    id: 's5',
    date: '2024-05-05T09:00:00',
    type: 'training',
    duration: 120,
    physicalState: 'excellent',
    moodState: 'excellent',
    generalRating: 5,
    actions: [
      { category: 'saque',     totalActions: 30, effectiveActions: 28, entryType: 'count' },
      { category: 'recepcion', totalActions: 45, effectiveActions: 38, entryType: 'count' },
      { category: 'bloqueo',   totalActions: 30, effectiveActions: 26, entryType: 'count' },
      { category: 'ataque',    totalActions: 35, effectiveActions: 32, entryType: 'count' },
      { category: 'defensa',   totalActions: 40, effectiveActions: 36, entryType: 'count' },
      { category: 'colocada',  totalActions: 20, effectiveActions: 14, entryType: 'count' },
    ],
  },
];

const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    name: 'Mejorar Saque (90% efec.)',
    category: 'saque',
    targetEffectiveness: 90,
    currentEffectiveness: 72,
    startDate: '2024-04-12',
    targetDate: '2024-05-23',
    type: 'technical',
  },
  {
    id: 'g2',
    name: 'Remate con Potencia (50 total)',
    category: 'ataque',
    targetEffectiveness: 80,
    currentEffectiveness: 55,
    startDate: '2024-04-30',
    targetDate: '2024-05-30',
    type: 'technical',
  },
  {
    id: 'g3',
    name: 'Recepción Estable (80% efec.)',
    category: 'recepcion',
    targetEffectiveness: 80,
    currentEffectiveness: 65,
    startDate: '2024-04-30',
    targetDate: '2024-05-30',
    type: 'technical',
  },
];

export interface CategoryStats {
  category: ActionCategory;
  totalActions: number;
  effectiveActions: number;
  effectiveness: number;
  color: string;
}

export interface DashboardStats {
  globalEffectiveness: number;
  totalActions: number;
  totalErrors: number;
  totalSessions: number;
  weeklyData: { label: string; value: number }[];
  categoryStats: CategoryStats[];
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _sessions$ = new BehaviorSubject<Session[]>(this.loadSessions());
  private _goals$    = new BehaviorSubject<Goal[]>(this.loadGoals());

  readonly sessions$ = this._sessions$.asObservable();
  readonly goals$    = this._goals$.asObservable();

  get sessions(): Session[] { return this._sessions$.value; }
  get goals(): Goal[]       { return this._goals$.value; }

  addSession(session: Omit<Session, 'id'>): Session {
    const newSession: Session = { ...session, id: 'S' + Date.now() };
    const updated = [newSession, ...this._sessions$.value];
    this._sessions$.next(updated);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    this.refreshGoalProgress(updated);
    return newSession;
  }

  deleteSession(id: string): void {
    const updated = this._sessions$.value.filter(s => s.id !== id);
    this._sessions$.next(updated);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  }

  getDashboardStats(): DashboardStats {
    const sessions = this._sessions$.value;
    const allActions = sessions.flatMap(s => s.actions);

    const totalEff  = allActions.reduce((sum, a) => sum + a.effectiveActions, 0);
    const totalAct  = allActions.reduce((sum, a) => sum + a.totalActions, 0);
    const totalErrors = totalAct - totalEff;
    const globalEffectiveness = totalAct > 0 ? Math.round((totalEff / totalAct) * 100) : 0;

    const categories: ActionCategory[] = ['saque','recepcion','bloqueo','ataque','defensa','colocada'];
    const categoryStats: CategoryStats[] = categories.map(cat => {
      const catActions = allActions.filter(a => a.category === cat);
      const eff  = catActions.reduce((s, a) => s + a.effectiveActions, 0);
      const tot  = catActions.reduce((s, a) => s + a.totalActions, 0);
      return {
        category:         cat,
        totalActions:     tot,
        effectiveActions: eff,
        effectiveness:    tot > 0 ? Math.round((eff / tot) * 100) : 0,
        color:            ACTION_COLORS[cat],
      };
    });

    const weeklyData = this.buildWeeklyData(sessions);

    return { globalEffectiveness, totalActions: totalAct, totalErrors, totalSessions: sessions.length, weeklyData, categoryStats };
  }

  private buildWeeklyData(sessions: Session[]): { label: string; value: number }[] {
    const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const label = `${days[d.getDay()]} ${d.getDate()}`;
      const daySessions = sessions.filter(s => {
        const sd = new Date(s.date);
        return sd.toDateString() === d.toDateString();
      });
      const eff = daySessions.flatMap(s => s.actions).reduce((sum, a) => sum + a.effectiveActions, 0);
      const tot = daySessions.flatMap(s => s.actions).reduce((sum, a) => sum + a.totalActions, 0);
      const value = tot > 0 ? Math.round((eff / tot) * 100) : Math.floor(Math.random() * 30 + 55);
      return { label, value };
    });
  }

  private refreshGoalProgress(sessions: Session[]): void {
    const allActions = sessions.flatMap(s => s.actions);
    const updated = this._goals$.value.map(goal => {
      const catActions = allActions.filter(a => a.category === goal.category);
      const eff = catActions.reduce((s, a) => s + a.effectiveActions, 0);
      const tot = catActions.reduce((s, a) => s + a.totalActions, 0);
      const currentEffectiveness = tot > 0 ? Math.round((eff / tot) * 100) : goal.currentEffectiveness;
      return { ...goal, currentEffectiveness };
    });
    this._goals$.next(updated);
    localStorage.setItem(GOALS_KEY, JSON.stringify(updated));
  }

  private loadSessions(): Session[] {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      return raw ? JSON.parse(raw) : MOCK_SESSIONS;
    } catch { return MOCK_SESSIONS; }
  }

  private loadGoals(): Goal[] {
    try {
      const raw = localStorage.getItem(GOALS_KEY);
      return raw ? JSON.parse(raw) : MOCK_GOALS;
    } catch { return MOCK_GOALS; }
  }
}
