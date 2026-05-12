import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Textanimator } from "../../AnimatedComponents/textanimator/textanimator";
import lottie from 'lottie-web';

@Component({
  selector: 'app-loader',
  imports: [Textanimator],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
  
})
export class Loader {

  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;

  private lottieAnim: any;

  ngAfterViewInit(): void {
    this.lottieAnim = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',           // ensures crisp, scalable graphics
      loop: true,
      autoplay: true,
      path: 'libraries/lotties/loader.json'  // your animation file
    });
  }

  ngOnDestroy(): void {
    if (this.lottieAnim) {
      this.lottieAnim.destroy();
    }
  }

}
  