import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { AuthService } from '../_services/auth_service';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'x-access-token'; // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    if (
      !req.url.includes('https://api.spotify.com/') &&
      !req.url.includes('https://accounts.spotify.com/')
    ) {
      const token = this.token.getToken();
      if (token != null) {
        authReq = req.clone({
          headers: req.headers.set(TOKEN_HEADER_KEY, token),
        });
      }
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];