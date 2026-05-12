import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BgAnimator } from "./Components/Layout/bg-animator/bg-animator";
import { Nav } from "./Components/Layout/nav/nav";
import { Footer } from "./Components/Layout/footer/footer";
import { Loader } from "./Components/Layout/loader/loader";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BgAnimator, Nav, Footer, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('12PortfolioTS');
loading: boolean = true;
loaderDone: boolean = true;
constructor() {
      window.document.body.style.overflow = 'hidden';
    
      
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    setTimeout(() => {
            window.document.body.style.overflow = 'auto';
      this.loaderDone = false;
    }, 3650);
  }
}
