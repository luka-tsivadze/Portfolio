import { NgClass, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
export type DecisionTag = 'CUSTOM' | 'PERF' | 'ARCH';

export interface Decision {
  tag: DecisionTag;
  name: string;
  why: string;
  ref: string;
}
@Component({
  selector: 'app-app-about-decisions',
  imports: [NgClass , NgFor],
  templateUrl: './app-about-decisions.html',
  styleUrl: './app-about-decisions.scss',
})
export class AppAboutDecisions {
  @Input() decisions: Decision[] = [];
}
