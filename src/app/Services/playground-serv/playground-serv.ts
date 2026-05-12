import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

export type CodeMode = 'html' | 'angular-cli';

export interface UserCode {
  html: string;
  css: string;
  js: string;
  mode?: CodeMode;
}

@Injectable({
  providedIn: 'root',
})
export class PlaygroundServ {
 private http = inject(HttpClient);
  private url = 'https://portfolio-2fe89-default-rtdb.europe-west1.firebasedatabase.app/playground.json';

  allCode$ = new BehaviorSubject<UserCode[]>([]);

  load() {
    this.http.get<Record<string, UserCode>>(this.url).subscribe(resp => {
      this.allCode$.next(resp ? Object.values(resp) : []);
    });
  }

  upload(code: UserCode) {
    return this.http.post(this.url, code).pipe(
      tap(() => this.allCode$.next([...this.allCode$.value, code]))
    );
  }
}
