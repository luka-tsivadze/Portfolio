import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
}
@Component({
  selector: 'app-bg-animator',
  imports: [],
  templateUrl: './bg-animator.html',
  styleUrl: './bg-animator.scss',
})
export class BgAnimator {
 @ViewChild('bgCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private readonly fps = 120;
  private readonly starCount = this.starscreen();
  private animationId: number | null = null;

  private mouse = { x: 0, y: 0 };

  // Keep handlers as class fields so we can remove them
  private handleResize = () => this.resizeCanvas();
  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
  };

starscreen(): number {
  const area = window.innerWidth * window.innerHeight;

  if (area < 600 * 800) return 20;      // small screens
  if (area < 1200 * 800) return 30;
  if (area < 1800 * 1000) return 55;
  return 80;                           // big screens
}

ngAfterViewInit(): void {
  const canvas = this.canvasRef.nativeElement;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('2D context not supported.');
    return;
  }

  this.ctx = ctx;

  this.resizeCanvas();
  this.createStars();

  window.addEventListener('resize', this.handleResize);
  window.addEventListener('mousemove', this.handleMouseMove);

  // initialize mouse roughly center
  this.mouse.x = window.innerWidth / 2;
  this.mouse.y = window.innerHeight / 2;

  this.tick();
}

ngOnDestroy(): void {
  if (this.animationId !== null) {
    cancelAnimationFrame(this.animationId);
  }

  window.removeEventListener('resize', this.handleResize);
  window.removeEventListener('mousemove', this.handleMouseMove);
}
  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Rebuild stars so density feels consistent after resize
    this.stars = [];
    this.createStars();
  }

  private createStars(): void {
    const canvas = this.canvasRef.nativeElement;

    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1 + 1,
        vx: Math.floor(Math.random() * 50) - 25,
        vy: Math.floor(Math.random() * 50) - 25,
      });
    }
  }

  private distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    // Draw stars
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];

      // neon-ish star color (blue with slight green)
      ctx.fillStyle = '#3af2ff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();

      // subtle inner stroke
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.stroke();
    }

    // Draw connections
    ctx.beginPath();
    for (let i = 0; i < this.stars.length; i++) {
      const starI = this.stars[i];

      // Connect to mouse
      if (this.distance(this.mouse, starI) < 110) {
        ctx.moveTo(starI.x, starI.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
      }

      // Connect to neighboring stars
      for (let j = i + 1; j < this.stars.length; j++) {
        const starII = this.stars[j];
        const dist = this.distance(starI, starII);

        if (dist < 100) {
          ctx.moveTo(starI.x, starI.y);
          ctx.lineTo(starII.x, starII.y);
        }
      }
    }

    ctx.lineWidth = 0.4;

    ctx.strokeStyle = 'rgba(114, 255, 180, 0.45)';
    ctx.stroke();
  }

  private update(): void {
    const canvas = this.canvasRef.nativeElement;

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];

      s.x += s.vx / this.fps;
      s.y += s.vy / this.fps;

      if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
      if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
    }
  }

  private tick(): void {
    this.draw();
    this.update();
    this.animationId = requestAnimationFrame(() => this.tick());
  }
}
