import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Textanimator } from '../../../AnimatedComponents/textanimator/textanimator';

type MoonConfig = {
  key: string;   // used for classes, like 'ts', 'rxjs'
  name: string;  // used for alt text
  iconSrc?: string; // optional, you fill later
  url: string;
};

type PlanetConfig = {
  key: string;   // 'angular', 'git', 'linux', ...
  name: string;  // alt text
  iconSrc?: string; // optional, you fill later
  orbitClass: string; // e.g. 'orbit--angular'
  wrapperClass: string; // e.g. 'planet-wrapper--angular'
  moons?: MoonConfig[];
  url: string;
};

@Component({
  selector: 'app-skilaxy',
  imports: [NgClass, Textanimator],
  templateUrl: './skilaxy.html',
  styleUrl: './skilaxy.scss',
})
export class Skilaxy {

 planets: PlanetConfig[] = [
  {
    key: 'angular',
    name: 'Angular',
    url: 'https://v17.angular.io/guide/what-is-angular',
    orbitClass: 'orbit--angular',
    wrapperClass: 'planet-wrapper--angular',
    iconSrc: 'Icons/Home/angular.svg',
    moons: [
      { 
        key: 'ionic', 
        name: 'Ionic', 
        iconSrc:'Icons/Home/ionic.svg',
        url: 'https://ionicframework.com/docs'
      },
      {  
        key: 'rxjs', 
        name: 'RxJS', 
        iconSrc: 'Icons/Home/rxjs.svg',
        url: 'https://rxjs.dev/guide/overview'
      }
    ]
  },

  {
    key: 'github',
    name: 'GitHub',
    url: 'https://github.com/about',
    orbitClass: 'orbit--git',
    wrapperClass: 'planet-wrapper--git',
    iconSrc:'Icons/Home/github.svg',
    moons: [
      { 
        key: 'git', 
        name:'Git', 
        iconSrc: 'Icons/Home/git.svg',
        url: 'https://git-scm.com/about'
      }
    ]
  },

  {
    key: 'linux',
    name: 'Linux',
    url: 'https://www.linuxfoundation.org/',
    orbitClass: 'orbit--linux',
    wrapperClass: 'planet-wrapper--linux',
    iconSrc: 'Icons/Home/linux.svg',
    moons: [
      { 
        key: 'arch', 
        name: 'Arch Linux',
        iconSrc:'Icons/Home/arch.svg',
        url: 'https://archlinux.org/'
      }
    ]
  },

  {
    key: 'react',
    name: 'React',
    url: 'https://react.dev/learn',
    orbitClass: 'orbit--react',
    wrapperClass: 'planet-wrapper--react',
    iconSrc: 'Icons/Home/react.svg'
  },

  {
    key: 'html',
    name: 'HTML',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    orbitClass: 'orbit--html',
    wrapperClass: 'planet-wrapper--html',
    iconSrc: 'Icons/Home/html5.svg',
    moons: [
      { 
        key: 'seo', 
        name: 'SEO', 
        iconSrc:'Icons/Home/seo.svg',
        url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide'
      },
      { 
        key: 'bootstrap', 
        name:'Bootstrap', 
        iconSrc:'Icons/Home/bootstrap.svg',
        url: 'https://getbootstrap.com/docs/'
      }
    ]
  },

  {
    key: 'css',
    name: 'CSS',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    orbitClass: 'orbit--css',
    wrapperClass: 'planet-wrapper--css',
    iconSrc: 'Icons/Home/css.svg',
    moons: [
      { 
        key: 'scss', 
        name: 'SCSS',
        iconSrc: 'Icons/Home/sass.svg',
        url: 'https://sass-lang.com/documentation/'
      }
    ]
  },

  {
    key: 'js',
    name: 'JavaScript',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    orbitClass: 'orbit--js',
    wrapperClass: 'planet-wrapper--js',
    iconSrc: 'Icons/Home/javascript.svg',
    moons:[
      { 
        key: 'ts',
        name: 'TypeScript',
        iconSrc: 'Icons/Home/typescript.svg',
        url: 'https://www.typescriptlang.org/docs/'
      },
      { 
        key: 'jQuery',
        name: 'jQuery',
        iconSrc: 'Icons/Home/jquerry.png',
        url: 'https://jquery.com/'
      }
    ]
  }
];

  suntitle:{name:string , icon:string}={name:"core stack & tools", icon:''}
constructor(){

}


  setname(planet:PlanetConfig  | MoonConfig){

    this.suntitle.name=planet.name;
    this.suntitle.icon=planet.iconSrc || '';
  
  }
  openUrl(url:string){
    window.open(url, '_blank');
  }

}

