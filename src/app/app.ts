import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BgAnimator } from "./Components/Layout/bg-animator/bg-animator";
import { Nav } from "./Components/Layout/nav/nav";
import { Footer } from "./Components/Layout/footer/footer";
import { Loader } from "./Components/Layout/loader/loader";
import { HomePage } from './Services/home-page/home-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BgAnimator, Nav, Footer, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  private readonly homeService = inject(HomePage);
  
  protected readonly title = signal('12PortfolioTS');
loading: boolean = true;
loaderDone: boolean = true;
storedOuterWidth = window.outerWidth;
storedInnerWidth = window.innerWidth;
storedOuterHeight = window.outerHeight;
storedInnerHeight = window.innerHeight;
constructor() {

  }

  private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async ngOnInit(): Promise<void> {
  document.body.style.overflow = 'hidden';

  try {
    await Promise.all([
      this.waitForWindowLoad(),

   
      this.delay(1500),
    ]);
  } catch (error) {
    console.error(error);
  }

  this.loading = false;
  this.loaderDone = false;
  document.body.style.overflow = 'auto';

  this.homeService.getVisitorInfo();
}
private waitForWindowLoad(): Promise<void> {
  if (document.readyState === 'complete') {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    window.addEventListener(
      'load',
      () => resolve(),
      { once: true }
    );
  });
}
  
}
