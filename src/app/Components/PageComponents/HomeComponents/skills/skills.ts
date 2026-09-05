
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CvInfo } from '../../../../Services/cv-info/cv-info';



@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
constructor(private router: Router) {}
rows = inject(CvInfo).rows;

  selectedKey: string | null = null;

  onRowClick(row:any|null) {
    this.selectedKey = row?.key;

    window.open(row?.url, '_blank');
  }
}


