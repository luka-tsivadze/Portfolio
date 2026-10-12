import { Injectable, inject } from '@angular/core';
import { CvInfo } from '../cv-info/cv-info';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface VisitorInfo {
  timestamp: string;
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screen: string;
  referrer: string;
  ip: string;
  city: string;
  country: string;
}

const VISITORS_URL =
  'https://portfolio-2fe89-default-rtdb.europe-west1.firebasedatabase.app/visitors';

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
    const info: VisitorInfo = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}`,
      referrer: document.referrer || 'direct',
      ip: '',
      city: '',
      country: '',
    };

    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) return;

      const geo = await response.json();
      info.ip = typeof geo.ip === 'string' ? geo.ip.trim() : '';
      info.city = typeof geo.city === 'string' ? geo.city.trim() : '';
      info.country = typeof geo.country_name === 'string' ? geo.country_name.trim() : '';
    } catch {
      return;
    }

    if (!info.ip) return;

    try {
      const key = await this.createVisitorKey(info);
      const visitorUrl = `${VISITORS_URL}/${key}.json`;
      const existing = await firstValueFrom(this.http.get<VisitorInfo | null>(visitorUrl));

      if (existing !== null) return;

      await firstValueFrom(this.http.put(visitorUrl, info));
    } catch {
      // Visitor logging must not block or disrupt the portfolio.
    }
  }

  private async createVisitorKey(info: VisitorInfo): Promise<string> {
    const identity = JSON.stringify([
      info.ip.toLowerCase(),
      info.city.toLowerCase(),
      info.country.toLowerCase(),
      info.userAgent,
      info.platform,
      info.screen,
    ]);
    const digest = await globalThis.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(identity),
    );

    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}
