import { Component } from '@angular/core';
import { PreviewHomeComponent } from "../../Components/PageComponents/AboutComponents/preview-home.component/preview-home.component";
import { PreviewProjectsComponent } from "../../Components/PageComponents/AboutComponents/preview-projects.component/preview-projects.component";

import { PreviewSkillsComponent } from '../../Components/PageComponents/AboutComponents/preview-skills.component/preview-skills.component';
import { AppAboutBenefits } from '../../Components/PageComponents/AboutComponents/app-about-benefits/app-about-benefits';
import { AppAboutDecisions } from '../../Components/PageComponents/AboutComponents/app-about-decisions/app-about-decisions';
import { PreviewPlaygroundComponent } from '../../Components/PageComponents/AboutComponents/preview-playground.component/preview-playground.component';
import { AboutHeader } from "../../Components/PageComponents/AboutComponents/about-header/about-header";

@Component({
  selector: 'app-about',
  imports: [PreviewHomeComponent, PreviewProjectsComponent, PreviewSkillsComponent, AppAboutBenefits, AppAboutDecisions, PreviewPlaygroundComponent, AboutHeader],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {

   decisions = [
    {
      tag: 'CUSTOM',
      name: 'split-chars pipe — text animator',
      why: 'Needed precise control over character-level timing for entrance animations. No library offered that granularity, so the pipe was built from scratch.',
      ref: 'pipe/split-chars/split-chars-pipe.ts',
    },
    {
      tag: 'PERF',
      name: 'Lazy-loaded page modules',
      why: 'Each page is a standalone module loaded only when navigated to — keeps the initial bundle small and improves perceived speed on first load.',
      ref: 'Pages/ — Home, Playground, Projects, About',
    },
    {
      tag: 'CUSTOM',
      name: 'SCSS architecture — vars, mixins, animations',
      why: 'Global theming lives in colorvars.scss. Reusable patterns in mixins.scss. Animations isolated in animations.scss. Clean separation, no style leakage between components.',
      ref: 'scss/colorvars · mixins · animations · responsive',
    },
    {
      tag: 'ARCH',
      name: 'iframe sandbox engine',
      why: 'User-uploaded code runs in a fully isolated iframe — no access to host context, no shared globals. Security by architecture, not by filtering.',
      ref: 'PlaygroundComp/user-upload · code-uploader',
    },
    {
      tag: 'CUSTOM',
      name: 'Solar system — skilaxy component',
      why: 'Skills visualized as orbiting planets using Three.js — each body orbits at its own angular velocity. Hover reveals full metadata. No charting library involved.',
      ref: 'HomeComponent/skilaxy',
    },
  ];
 
  // Three columns shown at the bottom of the page, each rendered by
  // its own <app-about-benefits> instance with a different heading + items.
 
  noLibrariesItems= [
    { label: 'No UI framework installed' },
    { label: 'No animation library' },
    { label: 'No charting package' },
    { label: 'Three.js only for 3D' },
  ];
 
  builtHereItems = [
    { label: 'Custom text animator pipe' },
    { label: 'SCSS system from scratch' },
    { label: 'iframe sandbox engine' },
    { label: 'Particle network — raw JS' },
  ];
 
  architectureItems = [
    { label: 'Lazy-loaded page modules' },
    { label: 'Global SCSS token system' },
    { label: 'Guards on restricted routes' },
    { label: "One DB connection — that's it" },
  ];
technicalDecisions: any;
  
}
