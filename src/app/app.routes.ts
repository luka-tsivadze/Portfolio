import { Routes } from '@angular/router';
import { Home } from './Pages/Home/home';
import { Playground } from './Pages/playground/playground';
import { About } from './Pages/about/about';
import { Projects } from './Pages/projects/projects';

export const routes: Routes = [
{
  path: '',
  component: Home
},
{
    path: 'playground',
  loadComponent: () =>
    import('./Pages/playground/playground').then(m => m.Playground)
},
{
  path: 'about',
  loadComponent: () =>
    import('./Pages/about/about').then(m => m.About)
},
{
    path:'Projects',
 loadComponent: () =>
   import('./Pages/projects/projects').then(m => m.Projects)
}
];
