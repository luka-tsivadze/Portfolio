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
    component: Playground
},
{
    path: 'about',
    component: About
},
{
    path:'Projects',
    component:Projects
}
];
