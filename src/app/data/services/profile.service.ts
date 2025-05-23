import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';
import { Pageable } from '../interfaces/pageable.interface';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)
  baseApiUrl = 'https://icherniakov.ru/yt-course/'
  me = signal<Profile | null>(null)

  constructor() { }

  getTestAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`)
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
    .pipe(
      tap(res => this.me.set(res))
    )
  }

  getSubscribersShortList() {
    return this.http.get<Pageable<Profile>>(`${this.baseApiUrl}account/subscribers/`)
    .pipe(
      map((res: Pageable<Profile>)  => res.items.slice(0,3))
    )
  }
}
