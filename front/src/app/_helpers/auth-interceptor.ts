import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { AuthService } from '../_services/auth_service';
import { Observable } from 'rxjs';
import { Device } from '@ionic-native/device/ngx';

const TOKEN_HEADER_KEY = 'x-access-token'; // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: AuthService,
    private device: Device) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //console.log(this.device)
    let authReq = req;
    if (
      !req.url.includes('https://api.spotify.com/') &&
      !req.url.includes('https://accounts.spotify.com/')
    ) {
      const token = this.token.getToken();
      const model = this.device.model;
      const platform = this.device.platform;
      const version = '1.0.0';
      if (token != null) {
        authReq = req.clone({
          setHeaders: { 'x-access-token': token,
          'model': model,
          'platform': platform,
          'version': version
        },
        });
      }
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
