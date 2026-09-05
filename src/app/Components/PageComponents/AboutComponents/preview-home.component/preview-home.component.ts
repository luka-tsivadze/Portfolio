import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-preview-home',
  standalone: true,
  templateUrl: './preview-home.component.html',
  styleUrls: ['./preview-home.component.scss'],
})
export class PreviewHomeComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animId!: number;
  private particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth || 220;
    canvas.height = canvas.offsetHeight || 110;
    this.ctx = canvas.getContext('2d')!;

    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    this.draw();
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const { ctx, particles } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#030b0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 55) {
          ctx.strokeStyle = `rgba(29,158,117,${0.3 * (1 - dist / 55)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(93,202,165,0.8)';
      ctx.fill();
    });

    this.animId = requestAnimationFrame(() => this.draw());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }
}