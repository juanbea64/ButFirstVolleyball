import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      src="assets/bfvLogo.png"
      [style.width]="h ? 'auto' : widthPx + 'px'"
      [style.height]="h ? heightPx + 'px' : 'auto'"
      alt="But First, Volleyball"
      class="logo-image"
    />
  `,
  styles: [`
    .logo-image { display: block; object-fit: contain; }
  `],
})
export class LogoComponent {
  /** Ancho en px (la altura sigue el aspect ratio) */
  @Input() size: number | string = 48;
  /** Altura en px (el ancho sigue el aspect ratio) — úsalo en espacios de altura fija */
  @Input() h: number | string = 0;

  get widthPx():  number { return this._px(this.size, 48); }
  get heightPx(): number { return this._px(this.h,    0);  }

  private _px(v: number | string, fallback: number): number {
    const n = typeof v === 'number' ? v : parseInt(v as string, 10);
    return isNaN(n) ? fallback : n;
  }
}
