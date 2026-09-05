import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectRow {
  label: string;
  color: string;
}

@Component({
  selector: 'app-preview-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-projects.component.html',
  styleUrls: ['./preview-projects.component.scss'],
})
export class PreviewProjectsComponent {
  rows: ProjectRow[] = [
    { label: 'FindHouse.ge — property listings platform', color: 'rgba(29,158,117,0.6)' },
    { label: 'GTU Chatbot — university AI assistant', color: 'rgba(127,119,221,0.5)' },
    { label: 'This portfolio — built from scratch', color: 'rgba(239,159,39,0.4)' },
  ];
}