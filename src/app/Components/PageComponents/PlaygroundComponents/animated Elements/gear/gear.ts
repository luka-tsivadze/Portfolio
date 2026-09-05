import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-gear',
  standalone: true,
  templateUrl: './gear.html',
  styleUrl: './gear.scss',
})
export class Gear {
  @Input() size = 180;
  @Input() teethCount?: number;    
  @Input() toothWidth?: number;   
  @Input() toothHeight?: number;   
  @Input() radiusRatio = 0.4545;  
  @Input() hollowRatio = 0.82;
  @Input() delay = 0;
  @Input() duration = 4;           
  @Input() reverse = false;        
  @Input() color = '#22d3ee';
  @Input() toothColor = '#0f4952';
  @Input() hollowColor = '#0f172a';
  @Input() left?: number = 10
  @Input() top = 10

  get teeth(): number[] {
    const count = this.teethCount ?? Math.max(6, Math.round(this.size / 10));
    return Array.from({ length: count }, (_, i) => i);
  }

  get toothW(): number {
    return this.toothWidth ?? this.size * 0.0778; // ratio from original 14/180
  }

  get toothH(): number {
    return this.toothHeight ?? this.size * 0.2111; // ratio from original 38/180
  }

  get radius(): number {
    return this.size * this.radiusRatio;
  }

  get hollowSize(): number {
    return this.size * this.hollowRatio;
  }

  toothTransform(i: number, total: number): string {
    const angle = (360 / total) * i;
    return `rotate(${angle}deg) translateY(${this.radius}px)`;
  }
}