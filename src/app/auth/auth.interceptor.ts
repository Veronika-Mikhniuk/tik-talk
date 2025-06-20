import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http"
import { inject, Injectable } from '@angular/core'
import { AuthService } from "./auth.service"
import { BehaviorSubject, catchError, switchMap, throwError, filter, tap } from "rxjs"
import { TokenResponse } from "./auth.interface"

let isRefreshing$ = new BehaviorSubject<boolean>(false)

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const token = authService.token

    if (!token) return next(req)
    
    if(isRefreshing$.value) {
        return refreshAndProceed(authService, req, next)
    }

    req = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })

    return next(addToken(req, token))
        .pipe(
            catchError(error => {
                if (error.status === 403) {
                    return refreshAndProceed(authService, req, next)
                }

                return throwError(error)
            })
        )

}

const refreshAndProceed = (
    authService: AuthService,
    req: HttpRequest<any>,
    next: HttpHandlerFn) => {
    if(!isRefreshing$.value) {
        isRefreshing$.next(true)

        return authService.refreshAuthToken()
        .pipe(
            switchMap((res) => {
                isRefreshing$.next(false)
                return next(addToken(req, res.access_token))
                .pipe(
                    tap(() => isRefreshing$.next(false))
                )
            })
        )
    }

    if(req.url.includes('refresh')) return next(addToken(req, authService.token!))

    return isRefreshing$.pipe(
        filter(isRefreshing => !isRefreshing),
        switchMap(res => {
            return next(addToken(req, authService.token!))
        })
    )
}

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
}