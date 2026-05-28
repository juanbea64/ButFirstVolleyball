import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player, PlayerPosition } from '../models/player.model';

const PLAYER_KEY = 'bfv_player';

const MOCK_PLAYER: Player = {
  id: 'p1',
  name: 'Alex García',
  email: 'alex.g@email.com',
  age: 21,
  position: 'outside-hitter',
  dominantHand: 'right',
  experienceYears: 3,
  attackReach: 330,
  blockReach: 315,
};

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private _player$ = new BehaviorSubject<Player>(this.load());

  readonly player$ = this._player$.asObservable();

  get player(): Player {
    return this._player$.value;
  }

  update(partial: Partial<Player>): void {
    const updated = { ...this._player$.value, ...partial };
    this._player$.next(updated);
    localStorage.setItem(PLAYER_KEY, JSON.stringify(updated));
  }

  private load(): Player {
    try {
      const raw = localStorage.getItem(PLAYER_KEY);
      return raw ? JSON.parse(raw) : MOCK_PLAYER;
    } catch {
      return MOCK_PLAYER;
    }
  }
}
