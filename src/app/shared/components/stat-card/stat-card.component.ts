import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-card__header">
        <div class="stat-card__label-row">
          <div class="stat-card__icon" [style.background]="iconBg">
            <i class="fa-solid {{ icon }}" [style.color]="iconColor"></i>
          </div>
          <span class="stat-card__label">{{ label }}</span>
        </div>
        @if (trend !== undefined) {
          <span class="stat-card__trend" [class]="trend >= 0 ? 'up' : 'down'">
            {{ trend >= 0 ? '+' : '' }}{{ trend }}%
          </span>
        }
      </div>

      <div style="display:flex;align-items:flex-end;gap:.5rem;">
        <span class="stat-card__value" [style.color]="valueColor">{{ value }}</span>
        @if (unit) {
          <span class="stat-card__unit">{{ unit }}</span>
        }
      </div>

      @if (subtitle) {
        <p class="stat-card__subtitle">{{ subtitle }}</p>
      }

      @if (progress !== undefined) {
        <div class="progress-bar-track" style="margin-top:.25rem;">
          <div class="progress-bar-fill"
               [style.width.%]="progress"
               [style.background]="valueColor">
          </div>
        </div>
      }
    </div>
  `,
})
export class StatCardComponent {
  @Input() label     = '';
  @Input() value     = '';
  @Input() unit      = '';
  @Input() subtitle  = '';
  @Input() icon      = 'fa-star';
  @Input() iconBg    = 'rgba(65,90,128,.12)';
  @Input() iconColor = 'var(--primary)';
  @Input() valueColor= 'var(--primary)';
  @Input() trend?: number;
  @Input() progress?: number;
}
