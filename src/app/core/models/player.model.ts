export type PlayerPosition = 'setter' | 'outside-hitter' | 'opposite' | 'middle-blocker' | 'libero';

export const POSITION_LABELS: Record<PlayerPosition, string> = {
  setter:          'Armador',
  'outside-hitter':'Punta',
  opposite:        'Opuesto',
  'middle-blocker':'Central',
  libero:          'Líbero',
};

export interface Player {
  id: string;
  name: string;
  email: string;
  age: number;
  position: PlayerPosition;
  dominantHand: 'right' | 'left';
  experienceYears: number;
  attackReach: number;
  blockReach: number;
}
