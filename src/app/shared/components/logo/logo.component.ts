import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Brain + Volleyball split-circle SVG logo -->
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 120 120"
         xmlns="http://www.w3.org/2000/svg" [style.display]="'block'">
      <defs>
        <clipPath id="bfv-left">
          <rect x="0" y="0" width="60" height="120"/>
        </clipPath>
        <clipPath id="bfv-right">
          <rect x="60" y="0" width="60" height="120"/>
        </clipPath>
      </defs>

      <!-- Base circle -->
      <circle cx="60" cy="60" r="56" fill="#415A80"/>

      <!-- ── Left: Brain ── -->
      <g clip-path="url(#bfv-left)" fill="none"
         stroke="#EEEFF2" stroke-width="2.2"
         stroke-linecap="round" stroke-linejoin="round">
        <!-- Outer brain silhouette -->
        <path d="M60,10 C44,10 30,18 22,32 C14,46 15,62 21,74 C27,86 34,91 31,100 C37,109 50,112 60,112"/>
        <!-- Frontal lobe folds -->
        <path d="M38,23 C30,32 26,44 29,55"/>
        <path d="M29,55 C26,63 29,72 36,76"/>
        <path d="M36,76 C31,84 33,93 40,98"/>
        <!-- Parietal folds -->
        <path d="M48,17 C41,27 39,40 43,52"/>
        <path d="M43,52 C39,62 39,73 45,80"/>
        <path d="M45,80 C43,89 45,99 52,106"/>
        <!-- Temporal folds -->
        <path d="M57,14 C53,25 53,40 57,53"/>
        <path d="M57,53 C53,64 53,77 57,90"/>
        <!-- Sulci cross lines -->
        <path d="M22,42 C18,52 20,63 27,68"/>
        <path d="M25,66 C20,75 22,84 29,89"/>
        <path d="M34,35 C28,43 28,55 33,61"/>
        <path d="M42,28 C36,38 36,51 41,59"/>
        <path d="M41,59 C38,68 39,78 44,84"/>
      </g>

      <!-- ── Right: Volleyball ── -->
      <g clip-path="url(#bfv-right)">
        <!-- Yellow panels -->
        <path d="M60,10 C76,10 89,18 96,32 C90,38 77,44 60,44Z"     fill="#FEE589"/>
        <path d="M96,32 C106,47 106,72 96,88 C88,82 79,68 60,65Z"   fill="#FEE589"/>
        <path d="M96,88 C89,102 76,110 60,110 C60,98 64,83 60,76Z"  fill="#FEE589"/>
        <!-- Seam curves (dark blue lines) -->
        <path d="M60,10 C73,26 77,45 60,64" fill="none" stroke="#415A80" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M96,32 C82,44 70,55 60,64" fill="none" stroke="#415A80" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M96,88 C82,80 71,72 60,64" fill="none" stroke="#415A80" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M60,110 C60,96 62,79 60,64" fill="none" stroke="#415A80" stroke-width="3.5" stroke-linecap="round"/>
      </g>

      <!-- Centre divider -->
      <line x1="60" y1="4" x2="60" y2="116"
            stroke="#EEEFF2" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,
})
export class LogoComponent {
  @Input() size: number | string = 48;
}
