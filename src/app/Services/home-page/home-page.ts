import { Injectable, inject } from '@angular/core';
import { CvInfo } from '../cv-info/cv-info';

interface headerDataType {
  codeWindows: {
    id: string;
    label: string;
    langClass: string;
    positionClass: string;
    code: string;
  }[];
  heroinformation:{
    name:string;
    role:string;
    location:string;
    about:string;
    available:string;
    miniskills:string;
    btncv:string;
    btnprojeects:string;
  }
} 


@Injectable({
  providedIn: 'root',
})




export class HomePage {
  private readonly serv: CvInfo = inject(CvInfo);
  header: headerDataType ={
   
  codeWindows: [
  {
    id: 'html',
    label: 'HTML',
    langClass: 'html',
    positionClass: 'pos-html',
    code: `<app-textanimator [value]="headerData.heroinformation.name" [delay]="80" ></app-textanimator>`
  },
  {
    id: 'scss',
    label: 'SCSS',
    langClass: 'scss',
    positionClass: 'pos-scss',
    code: `$color-primary: #ff3e00;
body {
  background-color: $color-primary;
} 
    `
  },
  {
    id: 'angular',
    label: 'Angular',
    langClass: 'angular',
    positionClass: 'pos-angular',
    code:
`@Component({
  selector: 'app-hello-world',
  template: '<div>Hello World</div>'
}) export class HelloWorldComponent { } `
  }
],

heroinformation:this.serv.heroinformation

}



}
