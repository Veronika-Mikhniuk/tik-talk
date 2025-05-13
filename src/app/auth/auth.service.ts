import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { catchError, tap } from 'rxjs/operators'
import { TokenResponse } from './auth.interface'
import { CookieService } from 'ngx-cookie-service'
import { throwError } from 'rxjs'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  router = inject(Router)
  cookieService = inject(CookieService)
  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/'
  token: string | null = null
  refreshToken: string | null = null

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token')
      this.refreshToken = this.cookieService.get('refreshToken')
    }

    return !!this.token
  }

  login(payload: { username: string, password: string }) {
    const formData = new FormData()

    formData.append('username', payload.username)
    formData.append('password', payload.password)

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}token`,
      formData
    ).pipe( // Организоваtn цепочку обработки данных
      tap((val) => { // Выполняет побочные действия, такие как: логирование, сохранение данных в переменные или сервисы,
        // вызов других методов НО! не изменять данные, в отличие от map
        this.saveTokens(val)
      })
    )
  }

  refreshAuthToken() {
    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}refresh`,
      {
        refresh_token: this.refreshToken
      }
    ).pipe(
      tap(val => {
        this.saveTokens(val)
      }),
      catchError(err => {
        this.logout()
        return throwError(err)
      })

    )
  }

  logout() {
    this.cookieService.deleteAll()
    this.token = null
    this.refreshToken = null
    this.router.navigate(['/login'])
  }

  saveTokens(res: TokenResponse) {
    this.token = res.access_token
    this.refreshToken = res.refresh_token
    this.cookieService.set('token', this.token)
    this.cookieService.set('refreshToken', this.refreshToken)
  }

}
