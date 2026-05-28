export type ActionCategory = 'saque' | 'recepcion' | 'bloqueo' | 'ataque' | 'defensa' | 'colocada';

export const ACTION_LABELS: Record<ActionCategory, string> = {
  saque:    'Saque',
  recepcion:'Recepción',
  bloqueo:  'Bloqueo',
  ataque:   'Ataque',
  defensa:  'Defensa',
  colocada: 'Colocada',
};

export const ACTION_ICONS: Record<ActionCategory, string> = {
  saque:    'fa-hand-fist',
  recepcion:'fa-hands',
  bloqueo:  'fa-shield-halved',
  ataque:   'fa-bolt',
  defensa:  'fa-person-running',
  colocada: 'fa-arrow-up',
};

export const ACTION_COLORS: Record<ActionCategory, string> = {
  saque:    '#f97316',
  recepcion:'#2563eb',
  bloqueo:  '#16a34a',
  ataque:   '#dc2626',
  defensa:  '#7c3aed',
  colocada: '#0891b2',
};

export interface TechnicalAction {
  category: ActionCategory;
  totalActions: number;
  effectiveActions: number;
  entryType: 'perception' | 'count';
}

export interface Session {
  id: string;
  date: string;
  type: 'training' | 'match';
  duration: number;
  physicalState: 'excellent' | 'good' | 'regular' | 'poor';
  moodState: 'excellent' | 'good' | 'regular' | 'poor';
  generalRating: number;
  actions: TechnicalAction[];
  notes?: string;
}

export interface Goal {
  id: string;
  name: string;
  category: ActionCategory;
  targetEffectiveness: number;
  currentEffectiveness: number;
  startDate: string;
  targetDate: string;
  type: 'technical';
}

export const STATE_LABELS: Record<string, string> = {
  excellent: 'Excelente',
  good:      'Bueno',
  regular:   'Regular',
  poor:      'Malo',
};
