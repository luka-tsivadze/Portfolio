
import { Component } from '@angular/core';
import { Router } from '@angular/router';

type SkillRow = {
  key: string;         // 'angular'
  name: string;        // 'Angular'
  category: string;    // 'Frontend framework'
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  since?: string;      // '2021'
  usedIn: string[];    // ['FindHouse', 'University website']
  url: string;         
};


@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
constructor(private router: Router) {}
rows: SkillRow[] = [
  {
    key: 'angular',
    name: 'Angular',
    category: 'Frontend framework',
    level: 'Advanced',
    since: '2021',
    usedIn: ['https://findhouse.ge/', 'https://gtu-chatbot.netlify.app/'],
    url: 'https://v17.angular.io/guide/what-is-angular'
  },

  {
    key: 'seo',
    name: 'SEO',
    category: 'Web fundamentals',
    level: 'Intermediate',
    usedIn: ['FindHouse'],
    url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide'
  },

  {
    key: 'performance',
    name: 'Performance Optimization',
    category: 'Frontend engineering',
    level: 'Intermediate',
    usedIn: ['FindHouse', 'Portfolio', 'Various web apps'],
    url: 'https://web.dev/learn-performance/' // official performance guide by Google
  },

  {
    key: 'typescript',
    name: 'TypeScript',
    category: 'Language',
    level: 'Advanced',
    since: '2021',
    usedIn: ['Angular projects'],
    url: 'https://www.typescriptlang.org/docs/'
  },

  {
    key: 'ionic',
    name: 'Ionic',
    category: 'Frontend framework',
    level: 'Intermediate',
    since: '2023',
    usedIn: ['Mobile applications'],
    url: 'https://ionicframework.com/docs'
  },

  {
    key: 'rxjs',
    name: 'RxJS',
    category: 'Reactive programming',
    level: 'Intermediate',
    since: '2023',
    usedIn: ['Angular observables', 'Forms & services'],
    url: 'https://rxjs.dev/guide/overview'
  },

  {
    key: 'html',
    name: 'HTML',
    category: 'Markup',
    level: 'Expert',
    usedIn: ['All frontend projects'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
  },

  {
    key: 'css',
    name: 'CSS',
    category: 'Styling',
    level: 'Expert',
    usedIn: ['FindHouse', 'Angular projects'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
  },

  {
    key: 'scss',
    name: 'SCSS',
    category: 'Preprocessor',
    level: 'Advanced',
    usedIn: ['Global theming', 'Component styles'],
    url: 'https://sass-lang.com/documentation/'
  },

  {
    key: 'javascript',
    name: 'JavaScript',
    category: 'Language',
    level: 'Advanced',
    usedIn: ['jQuery stuff', 'vanilla utilities'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },

  {
    key: 'react',
    name: 'React',
    category: 'Frontend library',
    level: 'Intermediate',
    usedIn: ['Side projects'],
    url: 'https://react.dev/learn'
  },

  {
    key: 'git',
    name: 'Git',
    category: 'Version control',
    level: 'Advanced',
    usedIn: ['All projects'],
    url: 'https://git-scm.com/about'
  },

  {
    key: 'arch',
    name: 'Arch Linux',
    category: 'Linux distro',
    level: 'Beginner',
    usedIn: ['Main dev machine'],
    url: 'https://archlinux.org/'
  },

  {
    key: 'jquery',
    name: 'jQuery',
    category: 'Legacy / utility',
    level: 'Intermediate',
    usedIn: ['Older projects and freelance'],
    url: 'https://jquery.com/'
  }
];


  selectedKey: string | null = null;

  onRowClick(row: SkillRow) {
    this.selectedKey = row.key;

    window.open(row.url, '_blank');
  }
}


