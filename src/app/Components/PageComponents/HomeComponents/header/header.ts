import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { HomePage } from '../../../../Services/home-page/home-page';
import { Textanimator } from '../../../AnimatedComponents/textanimator/textanimator';




@Component({
  selector: 'app-header',
  imports: [NgClass, Textanimator],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

headerData:any
  // later you can wire these to router or actual files
  readonly cvUrl = 'assets/cv.pdf';
constructor(private Data:HomePage)  {
}
ngOnInit(): void {
  this.headerData = this.Data.header;
 }

@ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;


  ngAfterViewInit(): void {
    const el = this.bgVideo?.nativeElement;
    if (!el) return;
    el.muted = true;
    const playPromise = el.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => {

      });
    }
  }


}
