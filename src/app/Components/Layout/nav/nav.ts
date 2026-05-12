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
  parcent:number=0;
  constructor() {}

onWindowScroll(): void {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop || 0;

  const max =
    (document.documentElement.scrollHeight || document.body.scrollHeight) -
    window.innerHeight;

  const next =
    max > 0 ? (scrollTop / max) * 100 : 0;

  if (next === this.parcent) return; // avoid pointless change

  this.parcent = next;
}

}
