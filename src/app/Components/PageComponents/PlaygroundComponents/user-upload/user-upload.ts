// user-upload.component.ts
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-user-upload',
  template: `
    <iframe 
      [srcdoc]="safeContent"
       sandbox="allow-scripts allow-same-origin"
      style="width: 100%; height: 400px; border: none;">
    </iframe>
  `
})
export class UserUpload implements OnInit, OnChanges {
  @Input() code: { html: string; css: string; js: string } | null = null;

  safeContent: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.updatePreview();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['code']) {
      this.updatePreview();
    }
  }
private updatePreview() {
  if (!this.code) return;
  const { css, js } = this.code;

  const isAngular = js.includes('window.__ng');

  const combined = isAngular ? `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/zone.js@0.13.3/dist/zone.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/reflect-metadata@0.1.13/Reflect.js"></script>
      <script type="importmap">
      {
        "imports": {
          "@angular/compiler": "https://esm.sh/@angular/compiler@17.3.0",
          "@angular/core": "https://esm.sh/@angular/core@17.3.0",
          "@angular/core/primitives/signals": "https://esm.sh/@angular/core@17.3.0/primitives/signals",
          "@angular/common": "https://esm.sh/@angular/common@17.3.0",
          "@angular/platform-browser": "https://esm.sh/@angular/platform-browser@17.3.0",
          "@angular/platform-browser-dynamic": "https://esm.sh/@angular/platform-browser-dynamic@17.3.0",
          "rxjs": "https://esm.sh/rxjs@7.8.1",
          "rxjs/operators": "https://esm.sh/rxjs@7.8.1/operators"
        }
      }
      </script>
      <script type="module">
        import '@angular/compiler';
        import * as ngCore   from '@angular/core';
        import * as ngCommon from '@angular/common';
        import * as ngPB     from '@angular/platform-browser';
        import * as ngPBD    from '@angular/platform-browser-dynamic';
        window.__ng = { ngCore, ngCommon, ngPB, ngPBD };
        window.dispatchEvent(new Event('ng-ready'));
      </script>
      <style>${css}</style>
    </head>
    <body>
      <script>
        window.addEventListener('ng-ready', function() {
          ${js}
        });
      </script>
    </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
      <head><style>${css}</style></head>
      <body>
        ${this.code.html}
        <script>${js}<\/script>
      </body>
    </html>
  `;

  this.safeContent = this.sanitizer.bypassSecurityTrustHtml(combined) as any;
}
}