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
      window.document.body.style.overflow = 'hidden';
setInterval(() => {
  const widthDiff = window.outerWidth + window.innerWidth;
  const heightDiff = window.outerHeight + window.innerHeight;
if (
  window.outerWidth !== this.storedOuterWidth ||
  window.innerWidth !== this.storedInnerWidth ||
  window.outerHeight !== this.storedOuterHeight ||
  window.innerHeight !== this.storedInnerHeight
) {
  console.log('inspect was open');
  // alert('Inspect was open. Please close it to continue using the application.');
  // debugger;

}
}, 1000);
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    setTimeout(() => {
            window.document.body.style.overflow = 'auto';
      this.loaderDone = false;
    }, 3650);
    this.homeService.getVisitorInfo().then((resp) => {
      // console.log('Visitor info retrieved:', resp);

    })
  }

  
}
