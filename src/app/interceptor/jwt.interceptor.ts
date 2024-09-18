import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

import { LoggerService } from '../service/logger.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private loggerService: LoggerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = JSON.parse(this.authService.getToken()!);
    let authReq = request;

    if (token) {
      authReq = request.clone({
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${token}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        switch (error.status) {
          case 401:
            errorMessage = error.error.data;
            this.authService.clearStorageByKey('tkn');
            if (!request.url.includes('/login')) {
              this.router.navigate(['/auth/login']);
            }
            break;
          case 403:
            errorMessage = error.error.data;
            this.authService.clearStorageByKey('tkn');
            this.router.navigate(['/auth/login']);

            break;
          case 500:
            errorMessage = 'Internal Server Error. Please try again later.';
            break;

          default:
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        this.loggerService.errorAlert(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
