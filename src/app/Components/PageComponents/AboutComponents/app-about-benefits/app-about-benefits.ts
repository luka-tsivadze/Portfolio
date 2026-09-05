import { Component, Input } from '@angular/core';


export interface BenefitItem {
  label: string;
}

@Component({
  selector: 'app-app-about-benefits',
  imports: [],
  templateUrl: './app-about-benefits.html',
  styleUrl: './app-about-benefits.scss',
})
export class AppAboutBenefits {
  @Input() heading = '';
  // List of short lines under that heading
  @Input() items: BenefitItem[] = [];
}
