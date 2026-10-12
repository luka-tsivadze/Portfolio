import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BgAnimator implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() contained = false;

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];

  private readonly targetFps = 60;
  private readonly frameInterval = 1000 / this.targetFps;

  private readonly starDistanceSq = 100 * 100;
  private readonly mouseDistanceSq = 110 * 110;

  private animationId: number | null = null;
  private lastFrameTime = 0;
  private visibilityListener = () => this.handleVisibilityChange();

  private mouse = { x: 0, y: 0 };

  private canvasLeft = 0;
  private canvasTop = 0;

  constructor(private readonly zone: NgZone) {}

  private handleResize = () => {
    this.resizeCanvas();
    this.updateCanvasPosition();
  };

  private handleMouseMove = (event: MouseEvent) => {
    this.mouse.x = event.clientX - this.canvasLeft;
    this.mouse.y = event.clientY - this.canvasTop;
  };

  private get sizeSource(): {
    width: number;
    height: number;
  } {
    if (this.contained) {
      const parent = this.canvasRef.nativeElement.parentElement;

      return {
        width: parent?.clientWidth || window.innerWidth,
        height: parent?.clientHeight || window.innerHeight,
      };
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  private starscreen(): number {
    const { width, height } = this.sizeSource;
    const area = width * height;

    if (area < 600 * 800) return 40;
    if (area < 1200 * 800) return 60;
    if (area < 1800 * 1000) return 95;

    return 120;
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
    this.updateCanvasPosition();

    this.mouse.x = canvas.width / 2;
    this.mouse.y = canvas.height / 2;

    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.handleResize, {
        passive: true,
      });

      window.addEventListener('mousemove', this.handleMouseMove, {
        passive: true,
      });
      document.addEventListener('visibilitychange', this.visibilityListener);

      if (!document.hidden) {
        this.animationId = requestAnimationFrame(this.tick);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('visibilitychange', this.visibilityListener);
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      return;
    }

    if (this.animationId === null) {
      this.lastFrameTime = performance.now();
      this.animationId = requestAnimationFrame(this.tick);
    }
  }

  private updateCanvasPosition(): void {
    const rect =
      this.canvasRef.nativeElement.getBoundingClientRect();

    this.canvasLeft = rect.left;
    this.canvasTop = rect.top;
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = this.sizeSource;

    canvas.width = width;
    canvas.height = height;

    this.createStars();
  }

  private createStars(): void {
    const canvas = this.canvasRef.nativeElement;
    const starCount = this.starscreen();

    this.stars.length = 0;

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1 + 1,

        // pixels per second
        vx: Math.random() * 50 - 25,
        vy: Math.random() * 50 - 25,
      });
    }
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const stars = this.stars;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.globalCompositeOperation = 'lighter';

    // stars
    ctx.fillStyle = '#3af2ff';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      ctx.beginPath();
      ctx.arc(
        star.x,
        star.y,
        star.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
    }

    // connections
    ctx.beginPath();

    for (let i = 0; i < stars.length; i++) {
      const starI = stars[i];

      // mouse connection
      const mouseDx = this.mouse.x - starI.x;
      const mouseDy = this.mouse.y - starI.y;

      if (
        mouseDx * mouseDx +
          mouseDy * mouseDy <
        this.mouseDistanceSq
      ) {
        ctx.moveTo(starI.x, starI.y);
        ctx.lineTo(
          this.mouse.x,
          this.mouse.y
        );
      }

      // star connections
      for (
        let j = i + 1;
        j < stars.length;
        j++
      ) {
        const starII = stars[j];

        const dx = starII.x - starI.x;
        const dy = starII.y - starI.y;

        if (
          dx * dx + dy * dy <
          this.starDistanceSq
        ) {
          ctx.moveTo(starI.x, starI.y);
          ctx.lineTo(
            starII.x,
            starII.y
          );
        }
      }
    }

    ctx.lineWidth = 0.4;
    ctx.strokeStyle =
      'rgba(114, 255, 180, 0.45)';
    ctx.stroke();
  }

  private update(deltaSeconds: number): void {
    const canvas = this.canvasRef.nativeElement;

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      star.x += star.vx * deltaSeconds;
      star.y += star.vy * deltaSeconds;

      if (
        star.x < 0 ||
        star.x > canvas.width
      ) {
        star.vx = -star.vx;
      }

      if (
        star.y < 0 ||
        star.y > canvas.height
      ) {
        star.vy = -star.vy;
      }
    }
  }

  private tick = (timestamp: number): void => {
    this.animationId =
      requestAnimationFrame(this.tick);

    const elapsed =
      timestamp - this.lastFrameTime;

    if (elapsed < this.frameInterval) {
      return;
    }

    this.lastFrameTime =
      timestamp -
      (elapsed % this.frameInterval);

    const deltaSeconds = Math.min(
      elapsed / 1000,
      0.05
    );

    this.update(deltaSeconds);
    this.draw();
  };
}