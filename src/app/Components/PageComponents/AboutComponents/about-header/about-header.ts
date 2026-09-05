import { Component } from '@angular/core';

export interface TimelineEntry {
  year: string;
  text: string;
  fillPercent: number;
  accent?: boolean;
}
@Component({
  selector: 'app-about-header',
  imports: [],
  templateUrl: './about-header.html',
  styleUrl: './about-header.scss',
})
export class AboutHeader {
 timeline: TimelineEntry[] = [
    {
      year: '2022',
      text: 'First Angular projects. Learning RxJS, reactive patterns, component architecture from the ground up.',
      fillPercent: 100,
    },
    {
      year: '2023',
      text: 'Production at FindHouse.ge — real scale, real users. Performance, SEO, error logging, feedback systems.',
      fillPercent: 100,
    },
    {
      year: '2024',
      text: 'Expanded into IT systems — POS hardware, EAS, embedded diagnostics. Technical range broadened.',
      fillPercent: 70,
    },
    {
      year: '2025 →',
      text: 'This platform. Everything summed up in one build — still growing, no finish line.',
      fillPercent: 35,
      accent: true,
    },
  ];
}
