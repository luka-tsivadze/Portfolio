import { Component, OnInit, AfterViewInit, OnDestroy, Sanitizer } from '@angular/core';
import { Textanimator } from '../../Components/AnimatedComponents/textanimator/textanimator';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CvInfo } from '../../Services/cv-info/cv-info';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  imports: [Textanimator],
})
export class Projects implements OnInit, AfterViewInit, OnDestroy {
  projects: any[] = [];

  currentIndex: number[] = [];
  autoplayHandles: any[] = [];
  touchStartX: number[] = [];
  touchEndX: number[] = [];

  autoplayDelay = 4000;
  transitionMs = 500;

  constructor(private sanitizer: DomSanitizer , private serv:CvInfo) {}

  ngOnInit(): void {
    this.loadProjects();
    this.currentIndex = new Array(this.projects.length).fill(0);
    this.touchStartX = new Array(this.projects.length).fill(0);
    this.touchEndX = new Array(this.projects.length).fill(0);
  }

  ngAfterViewInit(): void {
    // autoplay per project
    this.projects.forEach((_, i) => this.startAutoplay(i));
  }

  ngOnDestroy(): void {
    this.stopAllAutoplay();
  }

  loadProjects() {
    this.projects = this.serv.Sprojects;
  }

  // carousel controls
  next(i: number) {
    const len = this.projects[i].imgs.length;
    this.currentIndex[i] = (this.currentIndex[i] + 1) % len;
  }

  prev(i: number) {
    const len = this.projects[i].imgs.length;
    this.currentIndex[i] = (this.currentIndex[i] - 1 + len) % len;
  }

  goTo(i: number, slideIndex: number) {
    this.currentIndex[i] = slideIndex;
    this.restartAutoplay(i);
  }

  // autoplay
  startAutoplay(i: number) {
    this.stopAutoplay(i);
    this.autoplayHandles[i] = setInterval(() => this.next(i), this.autoplayDelay);
  }

  stopAutoplay(i: number) {
    if (this.autoplayHandles[i]) {
      clearInterval(this.autoplayHandles[i]);
      this.autoplayHandles[i] = null;
    }
  }

  stopAllAutoplay() {
    this.autoplayHandles.forEach((h) => h && clearInterval(h));
    this.autoplayHandles = [];
  }

  restartAutoplay(i: number) {
    this.stopAutoplay(i);
    this.autoplayHandles[i] = setInterval(() => this.next(i), this.autoplayDelay);
  }


  iframeActive = false;
  iframeUrl: SafeUrl | null= null;

  openIframe(url: string) {

 
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.iframeActive = true;
  }

  closeIframe() {
    this.iframeActive = false;

    // unload iframe content after animation ends
    setTimeout(() => {
      this.iframeUrl = null;
    }, 350);
  }
}
