import { ChangeDetectorRef, Component, input, Input, SimpleChanges } from '@angular/core';
import { SplitCharsPipe } from "../../../pipe/split-chars/split-chars-pipe";

@Component({
  selector: 'app-textanimator',
  imports: [SplitCharsPipe],
  templateUrl: './textanimator.html',
  styleUrl: './textanimator.scss',
})
export class Textanimator {
  @Input() value: string = '';
  @Input() delay: number = 90;
  @Input () className: string = 'animate'; 
  @Input() fullDelay: number = 0;
  

  display = '';

  private timeouts: number[] = [];
constructor(private ref:ChangeDetectorRef){}
 animateOn = true; // controls whether the class is applied


ngOnChanges(changes: SimpleChanges): void {
  if (changes['value'] || changes['fullDelay']) {
    this.restartAnimation();
  }
}

private restartAnimation(): void {
  this.animateOn = false;

  // Wait fullDelay first
  setTimeout(() => {
    // Then re-enable the animation
    requestAnimationFrame(() => {
      this.animateOn = true;
    });
  }, this.fullDelay);
}

}

