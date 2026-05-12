import { Component, EventEmitter, inject, Output } from '@angular/core';
import { UserCode, CodeMode } from '../../../../Services/playground-serv/playground-serv';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CompileService } from '../../../../Services/compile-service/compile-service';

@Component({
  selector: 'app-code-uploader',
  imports: [NgClass, FormsModule],
  templateUrl: './code-uploader.html',
  styleUrl: './code-uploader.scss',
})
export class CodeUploader {
  @Output() codeUploaded = new EventEmitter<UserCode>();

  private compileService = inject(CompileService);
  isCompiling = false;
  tabs = [
    { key: 'html', label: 'HTML' },
    { key: 'css',  label: 'CSS'  },
    { key: 'js',   label: 'JavaScript' },
  ];

  modeTabs: { key: CodeMode; label: string }[] = [
    { key: 'html',        label: 'HTML / CSS / JS' },
    { key: 'angular-cli', label: 'Angular' },
  ];

  activeTab = 'html';
  activeMode: CodeMode = 'html';
  code = { html: '', css: '', js: '' };

  fieldErrors: Record<string, boolean> = { html: false, css: false };
  jsWarning = false;
  jsWarnAcknowledged = false;

  bannerMessage = '';
  bannerType: 'error' | 'warn' | '' = '';
  statusText = 'READY · SANDBOX ISOLATED';
  isFlashing = false;

  get charCount(): number {
    return this.code[this.activeTab as keyof typeof this.code]?.length ?? 0;
  }

  setTab(key: string) {
    this.activeTab = key;
  }

  getLineNumbers(key: keyof typeof this.code): number[] {
    const lines = Math.max(this.code[key].split('\n').length, 6);
    return Array.from({ length: lines }, (_, i) => i + 1);
  }

  onInputChange(key: string) {
    this.fieldErrors[key] = false;
    if (key === 'js') {
      this.jsWarning = false;
      this.jsWarnAcknowledged = false;
    }
    this.dismissBanner();
  }

  dismissBanner() {
    this.bannerMessage = '';
    this.bannerType = '';
    if (this.jsWarning) {
      this.jsWarnAcknowledged = true;
      this.jsWarning = false;
    }
  }

  clearActive() {
    this.code[this.activeTab as keyof typeof this.code] = '';
    this.onInputChange(this.activeTab);
  }

  setMode(type: CodeMode) {
    // clicking active angular button toggles back to html
    if (this.activeMode === 'angular-cli' && type === 'angular-cli') {
      type = 'html';
    }

    this.activeMode = type;

    this.tabs = this.activeMode === 'angular-cli'
      ? [
          { key: 'html', label: 'HTML' },
          { key: 'css',  label: 'SCSS' },
          { key: 'js',   label: 'TypeScript' },
        ]
      : [
          { key: 'html', label: 'HTML' },
          { key: 'css',  label: 'CSS'  },
          { key: 'js',   label: 'JavaScript' },
        ];

    this.resetState();
  }

private resetState() {
  this.code = { html: '', css: '', js: '' };
  this.fieldErrors = { html: false, css: false };
  this.jsWarning = false;
  this.jsWarnAcknowledged = false;
  this.activeTab = 'html';
  this.bannerMessage = '';
  this.bannerType = '';
}

  async onUploadCode() {
    const html = this.code.html.trim();
    const css  = this.code.css.trim();
    const js   = this.code.js.trim();

    // reset errors — same as before
    this.fieldErrors = { html: false, css: false };
    this.jsWarning = false;
    this.bannerMessage = '';
    this.bannerType = '';

    const missing: string[] = [];
    if (!html) missing.push('html');
    if (!css)  missing.push('css');

    if (missing.length > 0) {
      missing.forEach(k => this.fieldErrors[k] = true);
      const labels = missing
        .map(k => {
          if (k === 'css') return this.tabs.find(t => t.key === 'css')?.label ?? 'CSS';
          return k.toUpperCase();
        })
        .join(' and ');
      this.bannerMessage = `${labels} cannot be empty — component blocked`;
      this.bannerType = 'error';
      if (!missing.includes(this.activeTab)) this.activeTab = missing[0];
      return;
    }

    if (!js && !this.jsWarnAcknowledged) {
      this.jsWarning = true;
      const label = this.tabs.find(t => t.key === 'js')?.label ?? 'JavaScript';
      this.bannerMessage = `No ${label} detected — component will be static. Dismiss to deploy anyway.`;
      this.bannerType = 'warn';
      this.activeTab = 'js';
      return;
    }

    // compile if angular mode
    let finalCode = { html: this.code.html, css: this.code.css, js: this.code.js };

    if (this.activeMode === 'angular-cli') {
      this.isCompiling = true;
      this.statusText = 'COMPILING · PLEASE WAIT...';
      try {
        finalCode = await this.compileService.compileAngular(
          this.code.html,
          this.code.css,
          this.code.js
        );
      } catch (e) {
        this.bannerMessage = 'Compilation failed — check your code for errors';
        this.bannerType = 'error';
        this.isCompiling = false;
        this.statusText = 'READY · SANDBOX ISOLATED';
        return;
      }
      this.isCompiling = false;
    }

    this.codeUploaded.emit({
      ...finalCode,
      mode: 'html', // always plain after compilation
    });

    this.isFlashing = true;
    setTimeout(() => this.isFlashing = false, 400);
    this.statusText = '✓ COMPONENT DEPLOYED · RENDERING...';
    setTimeout(() => this.statusText = 'READY · SANDBOX ISOLATED', 2500);
    this.jsWarnAcknowledged = false;
  }
}