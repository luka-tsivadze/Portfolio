import { Component } from '@angular/core';

type CubeFace = { face: string; text: string };

interface CubeNode {
  id: number;
  lat: number; // latitude angle
  lon: number; // longitude angle
  sides: CubeFace[];
}

const SIDES: CubeFace[] = [
  { face: 'front', text: '---' },
  { face: 'back', text: '---' },
  { face: 'left', text: '---' },
  { face: 'right', text: '---' },
  { face: 'top', text: '---' },
  { face: 'bottom', text: '---' },
];


@Component({
  selector: 'app-clobe',
  imports: [],
  templateUrl: './clobe.html',
  styleUrl: './clobe.scss',
})
export class Clobe {
 readonly radius = 140;
  readonly cubes: CubeNode[] = [];

  constructor() {
    this.buildSphere();
  }

  private buildSphere() {
    const latBands = 3;         // horizontal layers
    const lonBands = 8;         // cubes per ring
    let id = 0;

    for (let i = 0; i < latBands; i++) {
      const lat = -60 + (120 / (latBands - 1)) * i; // -60 to +60 degrees

      for (let j = 0; j < lonBands; j++) {
        const lon = (360 / lonBands) * j;

        this.cubes.push({
          id: id++,
          lat,
          lon,
          sides: SIDES
        });
      }
    }
  }

  cubeTransform(cube: CubeNode): string {
    return [
      'translate(-50%, -50%)',
      `rotateX(${cube.lat}deg)`,
      `rotateY(${cube.lon}deg)`,
      `translateZ(${this.radius}px)`
    ].join(' ');
  }
}
