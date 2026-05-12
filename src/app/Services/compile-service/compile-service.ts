import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CompileService {

  private extractComponentName(tsCode: string): string | null {
    const match = tsCode.match(/(?:export\s+)?class\s+(\w+)/);
    return match ? match[1] : null;
  }

  compileAngular(html: string, scss: string, tsCode: string): Promise<{ html: string; css: string; js: string }> {
    const componentName = this.extractComponentName(tsCode);

    if (!componentName) {
      return Promise.reject(new Error('Could not find a class in your TypeScript'));
    }

    const tsWithExport = `${tsCode}\n(window).__userComponent = ${componentName};`;

    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        reject(new Error('Compilation timed out after 30s'));
      }, 30000);

      window.addEventListener('message', function handler(event) {
        if (event.data?.type === 'COMPILED') {
          clearTimeout(timeout);
          window.removeEventListener('message', handler);
          document.body.removeChild(iframe);
          resolve({ html: event.data.html, css: event.data.css, js: event.data.js });
        }
        if (event.data?.type === 'COMPILE_ERROR') {
          clearTimeout(timeout);
          window.removeEventListener('message', handler);
          document.body.removeChild(iframe);
          reject(new Error(event.data.error));
        }
      });

      iframe.srcdoc = this.buildCompilerIframe(html, scss, tsWithExport);
    });
  }

  private buildCompilerIframe(html: string, scss: string, tsCode: string): string {
    const escapedHtml = JSON.stringify(html);
    const escapedScss = JSON.stringify(scss);
    const escapedTs   = JSON.stringify(tsCode);

    return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/reflect-metadata@0.1.13/Reflect.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/typescript@5.3.3/lib/typescript.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js"></script>
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
</head>
<body>
  <script>
  window.addEventListener('ng-ready', async function() {
    let css      = '';
    let cleanJs  = '';
    let rawHtml  = '';
    let selector = 'app-root';
    let UserComponent = null;

    try {
      const { ngCore, ngCommon, ngPB, ngPBD } = window.__ng;

      const rawTs   = ${escapedTs};
      const rawScss = ${escapedScss};
      rawHtml       = ${escapedHtml};

      const cleanTs = rawTs
        .replace(/import\\s*\\{[^}]*\\}\\s*from\\s*['"][^'"]*['"]\\s*;?/g, '')
        .replace(/import\\s+[^;]+;/g, '');

      console.log('step 2: imports stripped');

      await new Promise(function(res) {
        Sass.compile(rawScss, function(result) {
          css = result.text || '';
          console.log('step 3: scss done, length:', css.length);
          res();
        });
      });

      const jsOutput = ts.transpileModule(cleanTs, {
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          module: ts.ModuleKind.None,
          target: ts.ScriptTarget.ES2017,
        }
      }).outputText;

      cleanJs = jsOutput
        .split('"use strict";').join('')
        .split("'use strict';").join('')
        .split('exports').join('window')
        .split('{ static: true }').join('{ static: false }');

      console.log('step 4: ts compiled, length:', cleanJs.length);

      window.Component = function(metadata) {
        const patched = Object.assign({}, metadata, { template: rawHtml, styles: [css] });
        delete patched.templateUrl;
        delete patched.styleUrl;
        delete patched.styleUrls;
        return ngCore.Component(patched);
      };

      window.NgModule            = ngCore.NgModule;
      window.Injectable          = ngCore.Injectable;
      window.Input               = ngCore.Input;
      window.Output              = ngCore.Output;
      window.EventEmitter        = ngCore.EventEmitter;
      window.ViewChild           = ngCore.ViewChild;
      window.ViewChildren        = ngCore.ViewChildren;
      window.ContentChild        = ngCore.ContentChild;
      window.ContentChildren     = ngCore.ContentChildren;
      window.HostListener        = ngCore.HostListener;
      window.HostBinding         = ngCore.HostBinding;
      window.Pipe                = ngCore.Pipe;
      window.Directive           = ngCore.Directive;
      window.OnInit              = ngCore.OnInit;
      window.OnDestroy           = ngCore.OnDestroy;
      window.OnChanges           = ngCore.OnChanges;
      window.AfterViewInit       = ngCore.AfterViewInit;
      window.AfterViewChecked    = ngCore.AfterViewChecked;
      window.AfterContentInit    = ngCore.AfterContentInit;
      window.AfterContentChecked = ngCore.AfterContentChecked;
      window.DoCheck             = ngCore.DoCheck;
      window.ElementRef          = ngCore.ElementRef;
      window.TemplateRef         = ngCore.TemplateRef;
      window.ViewContainerRef    = ngCore.ViewContainerRef;
      window.ChangeDetectorRef   = ngCore.ChangeDetectorRef;
      window.Renderer2           = ngCore.Renderer2;
      window.SimpleChanges       = ngCore.SimpleChanges;
      window.inject              = ngCore.inject;
      window.signal              = ngCore.signal;
      window.computed            = ngCore.computed;
      window.effect              = ngCore.effect;
      window.NgFor               = ngCommon.NgFor;
      window.NgIf                = ngCommon.NgIf;
      window.NgClass             = ngCommon.NgClass;
      window.NgStyle             = ngCommon.NgStyle;
      window.NgSwitch            = ngCommon.NgSwitch;
      window.NgSwitchCase        = ngCommon.NgSwitchCase;
      window.NgSwitchDefault     = ngCommon.NgSwitchDefault;
      window.AsyncPipe           = ngCommon.AsyncPipe;
      window.CommonModule        = ngCommon.CommonModule;
      window.DatePipe            = ngCommon.DatePipe;
      window.DecimalPipe         = ngCommon.DecimalPipe;
      window.CurrencyPipe        = ngCommon.CurrencyPipe;
      window.UpperCasePipe       = ngCommon.UpperCasePipe;
      window.LowerCasePipe       = ngCommon.LowerCasePipe;
      window.JsonPipe            = ngCommon.JsonPipe;
      window.SlicePipe           = ngCommon.SlicePipe;
      window.PercentPipe         = ngCommon.PercentPipe;

      console.log('step 5: globals exposed');

      eval(cleanJs);

      UserComponent = window.__userComponent;
      console.log('step 6: eval done, component:', !!UserComponent);

      if (!UserComponent) {
        throw new Error('Component class not found after eval');
      }

      const annotations = UserComponent.__annotations__;
      selector = annotations?.[0]?.selector || 'app-root';
      console.log('step 7: selector:', selector);

      const rootEl = document.createElement(selector);
      document.body.appendChild(rootEl);

      const AppModule = ngCore.NgModule({
        declarations: [UserComponent],
        imports:      [ngPB.BrowserModule, ngCommon.CommonModule],
        bootstrap:    [UserComponent]
      })(class AppModule {});

      console.log('step 8: bootstrapping...');
      const platformRef = await ngPBD.platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' });
      const appRef = platformRef.injector.get(ngCore.ApplicationRef);
   appRef.tick();

['click','mousedown','mouseup','mousemove','input','change','keyup','keydown'].forEach(function(ev) {
  document.addEventListener(ev, function() { appRef.tick(); });
});
setTimeout(function() {
  appRef.tick();
  const compRef = appRef.components[0];
  if (compRef && compRef.instance && compRef.instance.ngAfterViewInit) {
    try { compRef.instance.ngAfterViewInit(); } catch(e) {}
  }
}, 200);
      console.log('step 9: bootstrap done');

    } catch(e) {
      console.error('COMPILE FAILED:', e.message, e.stack);
      window.parent.postMessage({
        type: 'COMPILE_ERROR',
        error: e.message + '\\n' + (e.stack || '')
      }, '*');
      return;
    }

    setTimeout(function() {
      var encodedJs   = JSON.stringify(cleanJs);
      var encodedHtml = JSON.stringify(rawHtml);

      var fullBundle =
        '(async function() {' +
        'const ngCore   = window.__ng.ngCore;' +
        'const ngCommon = window.__ng.ngCommon;' +
        'const ngPB     = window.__ng.ngPB;' +
        'const ngPBD    = window.__ng.ngPBD;' +
        'const rawHtml  = ' + encodedHtml + ';' +
        'window.Component = function(metadata) {' +
          'const m = Object.assign({}, metadata);' +
          'delete m.templateUrl; delete m.styleUrl; delete m.styleUrls;' +
          'm.template = rawHtml;' +
          'return ngCore.Component(m);' +
        '};' +
        'window.NgModule            = ngCore.NgModule;' +
        'window.Injectable          = ngCore.Injectable;' +
        'window.Input               = ngCore.Input;' +
        'window.Output              = ngCore.Output;' +
        'window.EventEmitter        = ngCore.EventEmitter;' +
        'window.ViewChild           = ngCore.ViewChild;' +
        'window.ViewChildren        = ngCore.ViewChildren;' +
        'window.ContentChild        = ngCore.ContentChild;' +
        'window.ContentChildren     = ngCore.ContentChildren;' +
        'window.HostListener        = ngCore.HostListener;' +
        'window.HostBinding         = ngCore.HostBinding;' +
        'window.Pipe                = ngCore.Pipe;' +
        'window.Directive           = ngCore.Directive;' +
        'window.OnInit              = ngCore.OnInit;' +
        'window.OnDestroy           = ngCore.OnDestroy;' +
        'window.OnChanges           = ngCore.OnChanges;' +
        'window.AfterViewInit       = ngCore.AfterViewInit;' +
        'window.AfterViewChecked    = ngCore.AfterViewChecked;' +
        'window.AfterContentInit    = ngCore.AfterContentInit;' +
        'window.AfterContentChecked = ngCore.AfterContentChecked;' +
        'window.DoCheck             = ngCore.DoCheck;' +
        'window.ElementRef          = ngCore.ElementRef;' +
        'window.TemplateRef         = ngCore.TemplateRef;' +
        'window.ViewContainerRef    = ngCore.ViewContainerRef;' +
        'window.ChangeDetectorRef   = ngCore.ChangeDetectorRef;' +
        'window.Renderer2           = ngCore.Renderer2;' +
        'window.SimpleChanges       = ngCore.SimpleChanges;' +
        'window.inject              = ngCore.inject;' +
        'window.signal              = ngCore.signal;' +
        'window.computed            = ngCore.computed;' +
        'window.effect              = ngCore.effect;' +
        'window.NgFor               = ngCommon.NgFor;' +
        'window.NgIf                = ngCommon.NgIf;' +
        'window.NgClass             = ngCommon.NgClass;' +
        'window.NgStyle             = ngCommon.NgStyle;' +
        'window.CommonModule        = ngCommon.CommonModule;' +
        'eval(' + encodedJs + ');' +
        'const UserComponent = window.__userComponent;' +
        'if (!UserComponent) return;' +
        'const annotations = UserComponent.__annotations__;' +
        'const sel = annotations?.[0]?.selector || "app-root";' +
        'const rootEl = document.createElement(sel);' +
        'document.body.appendChild(rootEl);' +
        'const AppModule = ngCore.NgModule({' +
          'declarations: [UserComponent],' +
          'imports: [ngPB.BrowserModule, ngCommon.CommonModule],' +
          'bootstrap: [UserComponent]' +
        '})(class AppModule {});' +
        'const platformRef = await ngPBD.platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: "noop" });' +
        'const appRef = platformRef.injector.get(ngCore.ApplicationRef);' +
        'appRef.tick();' +
   '["click","mousedown","mouseup","mousemove","input","change","keyup","keydown"].forEach(function(ev) {' +
    'document.addEventListener(ev, function() {' +
      'console.log("event:", ev);' +  // ← add this temporarily
      'appRef.tick();' +
    '});' +
  '});' +
        'setTimeout(function() {' +
          'appRef.tick();' +
          'const compRef = appRef.components[0];' +
          'if (compRef && compRef.instance && compRef.instance.ngAfterViewInit) {' +
            'try { compRef.instance.ngAfterViewInit(); } catch(e) {}' +
          '}' +
        '}, 200);' +
        '})();';

      window.parent.postMessage({
        type: 'COMPILED',
        html: '',
        css:  css,
        js:   fullBundle,
      }, '*');
    }, 2000);
  });
  </script>
</body>
</html>`;
  }
}