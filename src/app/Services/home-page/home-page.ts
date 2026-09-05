import { Injectable, inject } from '@angular/core';
import { CvInfo } from '../cv-info/cv-info';
import { HttpClient } from '@angular/common/http';
import { concatMap, filter, map } from 'rxjs';

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
  private http = inject(HttpClient);
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


  async getVisitorInfo() {
  const info = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}`,
    referrer: document.referrer || 'direct',
    ip: '',
    city: '',
    country: ''
  };
 
  try {
    const res = await fetch('https://ipapi.co/json/');
    const geo = await res.json();
    info.ip = geo.ip;
    info.city = geo.city;
    info.country = geo.country_name;
  } catch {
    // service down or blocked — don't fail the whole thing over it
  }


  this.http.get<any>(
  'https://portfolio-2fe89-default-rtdb.europe-west1.firebasedatabase.app/visitors.json'
).subscribe((visitors) => {
  // console.log('Retrieved visitors:', visitors);

  const visitorList = visitors ? Object.values(visitors) : [];
  const shouldPost = !visitorList.some((v: any) => this.isSameVisitor(v, info));

  if (shouldPost) {
    this.http.post(
      'https://portfolio-2fe89-default-rtdb.europe-west1.firebasedatabase.app/visitors.json',
      info
    ).subscribe();
  }
});

  }

  private isSameVisitor(stored: any, incoming: any): boolean {
  const fieldsToCompare: (keyof typeof incoming)[] = [
    'ip', 'city', 'country', 'language', 'platform',
    'referrer', 'screen', 'timezone', 'userAgent'
  ];

  return fieldsToCompare.every(key => stored[key] === incoming[key]);
}
}
