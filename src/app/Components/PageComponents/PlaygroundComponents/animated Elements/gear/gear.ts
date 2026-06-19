import { Component } from '@angular/core';


@Component({
  selector: 'app-gear',
  imports: [],
  templateUrl: './gear.html',
  styleUrl: './gear.scss',
})
export class Gear {
  size= 400;
  teeth = Array.from({ length: this.size/10 }, (_, i) => i);
  random = Math.random() * 100;
  toothTransform(i: number): string {
    const angle = (360 / this.teeth.length) * i;
    
    return `rotate(${angle}deg) translateY(${this.size/2.2}px)`;
  }
  
}
