import { Component } from '@angular/core';
import {

  ElementRef,
  Input,
  ViewChild,
  SimpleChanges,
  NgZone
} from '@angular/core';
 
type Direction = 'up' | 'down' | 'left' | 'right' | 'diagonal';
type Shape = 'square' | 'hexagon' | 'circle' | 'triangle';
@Component({
  selector: 'app-bg-animator-cubes',
  templateUrl: './bg-animator-cubes.html',
  styleUrl: './bg-animator-cubes.scss',
})
export class BgAnimatorCubes {
 @Input() direction: Direction = 'right';
  @Input() speed = 1;
  @Input() borderColor = '#999';
  @Input() squareSize = 40;
  @Input() hoverFillColor = '#222';
  @Input() shape: Shape = 'square';
  @Input() hoverTrailAmount = 0;
 
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
 
  private ctx!: CanvasRenderingContext2D;
  private requestId: number | null = null;
 
  private numSquaresX = 0;
  private numSquaresY = 0;
  private gridOffset = { x: 0, y: 0 };
  private hoveredSquare: { x: number; y: number } | null = null;
  private trailCells: { x: number; y: number }[] = [];
  private cellOpacities = new Map<string, number>();
 
  private isVisible = false;
  private isPageVisible = !document.hidden;
 
  private io!: IntersectionObserver;
 
  private resizeListener = () => this.resizeCanvas();
  private visibilityListener = () => this.onVisibility();
  private mouseMoveListener = (e: MouseEvent) => this.handleMouseMove(e);
  private mouseLeaveListener = () => this.handleMouseLeave();
 
  constructor(private zone: NgZone) {}
 
  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
 
    this.resizeCanvas();
 
    // Run outside Angular's change detection: this is a rAF animation loop
    // with no bindings to update, so we don't want CD firing every frame.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.resizeListener);
      canvas.addEventListener('mousemove', this.mouseMoveListener);
      canvas.addEventListener('mouseleave', this.mouseLeaveListener);
      document.addEventListener('visibilitychange', this.visibilityListener);
 
      this.io = new IntersectionObserver(
        ([entry]) => {
          this.isVisible = entry.isIntersecting;
          this.isVisible ? this.tryStart() : this.tryStop();
        },
        { threshold: 0 }
      );
      this.io.observe(canvas);
 
      this.tryStart();
    });
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    // Nothing dynamic to re-bind besides the values themselves, which are
    // read fresh each frame from `this.*` — so no extra work needed here.
    // Kept as a hook in case squareSize/shape changes should force a resize.
    if ((changes['squareSize'] || changes['shape']) && this.ctx) {
      this.resizeCanvas();
    }
  }
 
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    document.removeEventListener('visibilitychange', this.visibilityListener);
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      canvas.removeEventListener('mousemove', this.mouseMoveListener);
      canvas.removeEventListener('mouseleave', this.mouseLeaveListener);
    }
    this.io?.disconnect();
    this.tryStop();
  }
 
  // ---- lifecycle helpers ----
 
  private tryStart(): void {
    if (this.isVisible && this.isPageVisible && this.requestId === null) {
      this.requestId = requestAnimationFrame(() => this.updateAnimation());
    }
  }
 
  private tryStop(): void {
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }
 
  private onVisibility(): void {
    this.isPageVisible = !document.hidden;
    this.isPageVisible ? this.tryStart() : this.tryStop();
  }
 
  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.numSquaresX = Math.ceil(canvas.width / this.squareSize) + 1;
    this.numSquaresY = Math.ceil(canvas.height / this.squareSize) + 1;
  }
 
  // ---- shape drawing ----
 
  private drawHex(cx: number, cy: number, size: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const vx = cx + size * Math.cos(angle);
      const vy = cy + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
  }
 
  private drawCircle(cx: number, cy: number, size: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.closePath();
  }
 
  private drawTriangle(cx: number, cy: number, size: number, flip: boolean): void {
    const ctx = this.ctx;
    ctx.beginPath();
    if (flip) {
      ctx.moveTo(cx, cy + size / 2);
      ctx.lineTo(cx + size / 2, cy - size / 2);
      ctx.lineTo(cx - size / 2, cy - size / 2);
    } else {
      ctx.moveTo(cx, cy - size / 2);
      ctx.lineTo(cx + size / 2, cy + size / 2);
      ctx.lineTo(cx - size / 2, cy + size / 2);
    }
    ctx.closePath();
  }
 
  private drawGrid(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const { squareSize, shape, borderColor, hoverFillColor } = this;
 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    const isHex = shape === 'hexagon';
    const isTri = shape === 'triangle';
    const hexHoriz = squareSize * 1.5;
    const hexVert = squareSize * Math.sqrt(3);
 
    if (isHex) {
      const colShift = Math.floor(this.gridOffset.x / hexHoriz);
      const offsetX = ((this.gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
      const offsetY = ((this.gridOffset.y % hexVert) + hexVert) % hexVert;
 
      const cols = Math.ceil(canvas.width / hexHoriz) + 3;
      const rows = Math.ceil(canvas.height / hexVert) + 3;
 
      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * hexHoriz + offsetX;
          const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;
 
          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawHex(cx, cy, squareSize);
            ctx.fillStyle = hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
 
          this.drawHex(cx, cy, squareSize);
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }
      }
    } else if (isTri) {
      const halfW = squareSize / 2;
      const colShift = Math.floor(this.gridOffset.x / halfW);
      const rowShift = Math.floor(this.gridOffset.y / squareSize);
      const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
      const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;
 
      const cols = Math.ceil(canvas.width / halfW) + 4;
      const rows = Math.ceil(canvas.height / squareSize) + 4;
 
      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * halfW + offsetX;
          const cy = row * squareSize + squareSize / 2 + offsetY;
          const flip = (((col + colShift + row + rowShift) % 2) + 2) % 2 !== 0;
 
          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawTriangle(cx, cy, squareSize, flip);
            ctx.fillStyle = hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
 
          this.drawTriangle(cx, cy, squareSize, flip);
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }
      }
    } else if (shape === 'circle') {
      const offsetX = ((this.gridOffset.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;
 
      const cols = Math.ceil(canvas.width / squareSize) + 3;
      const rows = Math.ceil(canvas.height / squareSize) + 3;
 
      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * squareSize + squareSize / 2 + offsetX;
          const cy = row * squareSize + squareSize / 2 + offsetY;
 
          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawCircle(cx, cy, squareSize);
            ctx.fillStyle = hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
 
          this.drawCircle(cx, cy, squareSize);
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }
      }
    } else {
      const offsetX = ((this.gridOffset.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;
 
      const cols = Math.ceil(canvas.width / squareSize) + 3;
      const rows = Math.ceil(canvas.height / squareSize) + 3;
 
      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const sx = col * squareSize + offsetX;
          const sy = row * squareSize + offsetY;
 
          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(sx, sy, squareSize, squareSize);
            ctx.globalAlpha = 1;
          }
 
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(sx, sy, squareSize, squareSize);
        }
      }
    }
 
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
 
  // ---- animation loop ----
 
  private updateAnimation(): void {
    const { squareSize, shape } = this;
    const isHex = shape === 'hexagon';
    const isTri = shape === 'triangle';
    const hexHoriz = squareSize * 1.5;
    const hexVert = squareSize * Math.sqrt(3);
 
    const effectiveSpeed = Math.max(this.speed, 0.1);
    const wrapX = isHex ? hexHoriz * 2 : squareSize;
    const wrapY = isHex ? hexVert : isTri ? squareSize * 2 : squareSize;
 
    switch (this.direction) {
      case 'right':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
        break;
      case 'left':
        this.gridOffset.x = (this.gridOffset.x + effectiveSpeed + wrapX) % wrapX;
        break;
      case 'up':
        this.gridOffset.y = (this.gridOffset.y + effectiveSpeed + wrapY) % wrapY;
        break;
      case 'down':
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
        break;
      case 'diagonal':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
        break;
    }
 
    this.updateCellOpacities();
    this.drawGrid();
    this.requestId = requestAnimationFrame(() => this.updateAnimation());
  }
 
  private updateCellOpacities(): void {
    const targets = new Map<string, number>();
 
    if (this.hoveredSquare) {
      targets.set(`${this.hoveredSquare.x},${this.hoveredSquare.y}`, 1);
    }
 
    if (this.hoverTrailAmount > 0) {
      for (let i = 0; i < this.trailCells.length; i++) {
        const t = this.trailCells[i];
        const key = `${t.x},${t.y}`;
        if (!targets.has(key)) {
          targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
        }
      }
    }
 
    for (const [key] of targets) {
      if (!this.cellOpacities.has(key)) {
        this.cellOpacities.set(key, 0);
      }
    }
 
    for (const [key, opacity] of this.cellOpacities) {
      const target = targets.get(key) || 0;
      const next = opacity + (target - opacity) * 0.15;
      if (next < 0.005) {
        this.cellOpacities.delete(key);
      } else {
        this.cellOpacities.set(key, next);
      }
    }
  }
 
  // ---- mouse interaction ----
 
  private handleMouseMove(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const { squareSize, shape } = this;
    const isHex = shape === 'hexagon';
    const isTri = shape === 'triangle';
    const hexHoriz = squareSize * 1.5;
    const hexVert = squareSize * Math.sqrt(3);
 
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
 
    let col: number;
    let row: number;
 
    if (isHex) {
      const colShift = Math.floor(this.gridOffset.x / hexHoriz);
      const offsetX = ((this.gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz;
      const offsetY = ((this.gridOffset.y % hexVert) + hexVert) % hexVert;
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
 
      col = Math.round(adjustedX / hexHoriz);
      const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
      row = Math.round((adjustedY - rowOffset) / hexVert);
    } else if (isTri) {
      const halfW = squareSize / 2;
      const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
      const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;
 
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
 
      col = Math.round(adjustedX / halfW);
      row = Math.floor(adjustedY / squareSize);
    } else if (shape === 'circle') {
      const offsetX = ((this.gridOffset.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;
 
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
 
      col = Math.round(adjustedX / squareSize);
      row = Math.round(adjustedY / squareSize);
    } else {
      const offsetX = ((this.gridOffset.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((this.gridOffset.y % squareSize) + squareSize) % squareSize;
 
      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;
 
      col = Math.floor(adjustedX / squareSize);
      row = Math.floor(adjustedY / squareSize);
    }
 
    if (!this.hoveredSquare || this.hoveredSquare.x !== col || this.hoveredSquare.y !== row) {
      if (this.hoveredSquare && this.hoverTrailAmount > 0) {
        this.trailCells.unshift({ ...this.hoveredSquare });
        if (this.trailCells.length > this.hoverTrailAmount) {
          this.trailCells.length = this.hoverTrailAmount;
        }
      }
      this.hoveredSquare = { x: col, y: row };
    }
}

  private handleMouseLeave(): void {
    if (this.hoveredSquare && this.hoverTrailAmount > 0) {
      this.trailCells.unshift({ ...this.hoveredSquare });
      if (this.trailCells.length > this.hoverTrailAmount) {
        this.trailCells.length = this.hoverTrailAmount;
      }
    }
    this.hoveredSquare = null;
  }
}