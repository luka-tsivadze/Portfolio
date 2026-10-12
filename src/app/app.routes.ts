import { Routes } from '@angular/router';
import { Home } from './Pages/Home/home';

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
