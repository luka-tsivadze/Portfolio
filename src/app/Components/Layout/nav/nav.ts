import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  styleUrls: ['./nav.scss'],
  host: {
    '(window:scroll)': 'onWindowScroll()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class Nav {
  scrollProgress = 0;
  isScrolled = false;
  menuOpen = false;
  constructor() {}

toggleMenu(): void {
  this.menuOpen = !this.menuOpen;
}

closeMenu(): void {
  this.menuOpen = false;
}

onWindowScroll(): void {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop || 0;

  const max =
    (document.documentElement.scrollHeight || document.body.scrollHeight) -
    window.innerHeight;

  this.isScrolled = scrollTop > 12;
  this.scrollProgress =
    max > 0 ? (scrollTop / max) * 100 : 0;
}

}
