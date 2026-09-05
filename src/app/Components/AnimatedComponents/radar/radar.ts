import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  NgZone
} from '@angular/core';
import { Renderer, Program, Mesh, Triangle, OGLRenderingContext } from 'ogl';

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255
  ];
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uRingCount;
uniform float uSpokeCount;
uniform float uRingThickness;
uniform float uSpokeThickness;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepLobes;
uniform vec3 uColor;
uniform vec3 uBgColor;
uniform bool uLightMode;
uniform float uFalloff;
uniform float uBrightness;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;

#define TAU 6.28318530718
#define PI 3.14159265359

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  st = st * 2.0 - 1.0;
  st.x *= uResolution.x / uResolution.y;

  if (uEnableMouse) {
    vec2 mShift = (uMouse * 2.0 - 1.0);
    mShift.x *= uResolution.x / uResolution.y;
    st -= mShift * uMouseInfluence;
  }

  st *= uScale;

  float dist = length(st);
  float theta = atan(st.y, st.x);
  float t = uTime * uSpeed;

  float ringPhase = dist * uRingCount - t;
  float ringDist = abs(fract(ringPhase) - 0.5);
  float ringGlow = 1.0 - smoothstep(0.0, uRingThickness, ringDist);

  float spokeAngle = abs(fract(theta * uSpokeCount / TAU + 0.5) - 0.5) * TAU / uSpokeCount;
  float arcDist = spokeAngle * dist;
  float spokeGlow = (1.0 - smoothstep(0.0, uSpokeThickness, arcDist)) * smoothstep(0.0, 0.1, dist);

  float sweepPhase = t * uSweepSpeed;
  float sweepBeam = pow(max(0.5 * sin(uSweepLobes * theta + sweepPhase) + 0.5, 0.0), uSweepWidth);

  float fade = smoothstep(1.05, 0.85, dist) * pow(max(1.0 - dist, 0.0), uFalloff);

  float intensity = max((ringGlow + spokeGlow + sweepBeam) * fade * uBrightness, 0.0);
  vec3 signal = uColor * intensity;
  vec3 col;
  if (uLightMode) {
    vec3 mapped = vec3(1.0) - exp(-max(signal, vec3(0.0)) * 1.45);
    float energy = clamp(max(mapped.r, max(mapped.g, mapped.b)), 0.0, 1.0);
    vec3 hue = mapped / max(energy, 0.0001);
    hue = pow(clamp(hue, 0.0, 1.0), vec3(1.2));
    col = mix(uBgColor, hue, smoothstep(0.015, 0.8, energy) * 0.96);
    gl_FragColor = vec4(col, 1.0);
  } else {
    col = signal + uBgColor;
    float alpha = clamp(length(col), 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
}
`;

@Component({
  selector: 'app-radar',
  standalone: true,
  templateUrl: './radar.html',
  styleUrl: './radar.scss'
})
export class Radar implements AfterViewInit, OnDestroy, OnChanges {
  @Input() speed = 1.0;
  @Input() scale = 0.6;
  @Input() ringCount = 10.0;
  @Input() spokeCount = 10.0;
  @Input() ringThickness = 0.05;
  @Input() spokeThickness = 0.01;
  @Input() sweepSpeed = 1.0;
  @Input() sweepWidth = 2.0;
  @Input() sweepLobes = 1.0;
  @Input() color = '#9f29ff';
  @Input() backgroundColor = '#00000025';
  @Input() falloff = 2.0;
  @Input() brightness = 1.0;
  @Input() enableMouseInteraction = true;
  @Input() mouseInfluence = 0.1;
  @Input() lightMode = false;

  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private renderer!: Renderer;
  private gl!: OGLRenderingContext;
  private program!: Program;
  private mesh!: Mesh;
  private animationFrameId: number | null = null;
  private currentMouse = [0.5, 0.5];
  private targetMouse = [0.5, 0.5];
  private canvasEl!: HTMLCanvasElement;

  private resizeListener = () => this.resize();
  private mouseMoveListener = (e: MouseEvent) => this.handleMouseMove(e);
  private mouseLeaveListener = () => this.handleMouseLeave();

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    const container = this.containerRef.nativeElement;

    this.renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(this.gl);
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: [this.gl.canvas.width, this.gl.canvas.height, this.gl.canvas.width / this.gl.canvas.height]
        },
        uSpeed: { value: this.speed },
        uScale: { value: this.scale },
        uRingCount: { value: this.ringCount },
        uSpokeCount: { value: this.spokeCount },
        uRingThickness: { value: this.ringThickness },
        uSpokeThickness: { value: this.spokeThickness },
        uSweepSpeed: { value: this.sweepSpeed },
        uSweepWidth: { value: this.sweepWidth },
        uSweepLobes: { value: this.sweepLobes },
        uColor: { value: hexToVec3(this.color) },
        uBgColor: { value: hexToVec3(this.backgroundColor) },
        uLightMode: { value: this.lightMode },
        uFalloff: { value: this.falloff },
        uBrightness: { value: this.brightness },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseInfluence: { value: this.mouseInfluence },
        uEnableMouse: { value: this.enableMouseInteraction }
      }
    });

    this.mesh = new Mesh(this.gl, { geometry, program: this.program });
    this.canvasEl = this.gl.canvas as HTMLCanvasElement;
    container.appendChild(this.canvasEl);

    // Everything below (rAF loop, listeners) runs outside Angular's zone —
    // per-frame uniform updates have no template bindings to trigger CD for.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.resizeListener);
      this.resize();

      if (this.enableMouseInteraction) {
        this.canvasEl.addEventListener('mousemove', this.mouseMoveListener);
        this.canvasEl.addEventListener('mouseleave', this.mouseLeaveListener);
      }

      this.animationFrameId = requestAnimationFrame(this.update);
    });
  }

  ngOnChanges(): void {
    // Skip if the WebGL program hasn't been created yet (first ngOnChanges
    // fires before ngAfterViewInit).
    if (!this.program) return;

    const u = this.program.uniforms;
    u['uSpeed'].value = this.speed;
    u['uScale'].value = this.scale;
    u['uRingCount'].value = this.ringCount;
    u['uSpokeCount'].value = this.spokeCount;
    u['uRingThickness'].value = this.ringThickness;
    u['uSpokeThickness'].value = this.spokeThickness;
    u['uSweepSpeed'].value = this.sweepSpeed;
    u['uSweepWidth'].value = this.sweepWidth;
    u['uSweepLobes'].value = this.sweepLobes;
    u['uColor'].value = hexToVec3(this.color);
    u['uBgColor'].value = hexToVec3(this.backgroundColor);
    u['uLightMode'].value = this.lightMode;
    u['uFalloff'].value = this.falloff;
    u['uBrightness'].value = this.brightness;
    u['uMouseInfluence'].value = this.mouseInfluence;
    u['uEnableMouse'].value = this.enableMouseInteraction;

    // toggling mouse interaction at runtime needs the listeners added/removed
    if (this.canvasEl) {
      this.canvasEl.removeEventListener('mousemove', this.mouseMoveListener);
      this.canvasEl.removeEventListener('mouseleave', this.mouseLeaveListener);
      if (this.enableMouseInteraction) {
        this.canvasEl.addEventListener('mousemove', this.mouseMoveListener);
        this.canvasEl.addEventListener('mouseleave', this.mouseLeaveListener);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeListener);
    if (this.canvasEl) {
      this.canvasEl.removeEventListener('mousemove', this.mouseMoveListener);
      this.canvasEl.removeEventListener('mouseleave', this.mouseLeaveListener);
      this.canvasEl.parentNode?.removeChild(this.canvasEl);
    }
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private resize(): void {
    const container = this.containerRef.nativeElement;
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    if (this.program) {
      this.program.uniforms['uResolution'].value = [
        this.gl.canvas.width,
        this.gl.canvas.height,
        this.gl.canvas.width / this.gl.canvas.height
      ];
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    const rect = this.canvasEl.getBoundingClientRect();
    this.targetMouse = [
      (event.clientX - rect.left) / rect.width,
      1.0 - (event.clientY - rect.top) / rect.height
    ];
  }

  private handleMouseLeave(): void {
    this.targetMouse = [0.5, 0.5];
  }

  // Bound as a class field (arrow fn) so `this` stays correct in rAF.
  private update = (time: number): void => {
    this.animationFrameId = requestAnimationFrame(this.update);
    this.program.uniforms['uTime'].value = time * 0.001;

    if (this.enableMouseInteraction) {
      this.currentMouse[0] += 0.05 * (this.targetMouse[0] - this.currentMouse[0]);
      this.currentMouse[1] += 0.05 * (this.targetMouse[1] - this.currentMouse[1]);
      (this.program.uniforms['uMouse'].value as Float32Array)[0] = this.currentMouse[0];
      (this.program.uniforms['uMouse'].value as Float32Array)[1] = this.currentMouse[1];
    } else {
      (this.program.uniforms['uMouse'].value as Float32Array)[0] = 0.5;
      (this.program.uniforms['uMouse'].value as Float32Array)[1] = 0.5;
    }

    this.renderer.render({ scene: this.mesh });
  };
}