import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IErrors } from '../models/Errors';
import { catchError, switchMap, throwError } from 'rxjs';
import { ErrorViewComponent } from '../components/error-view/error-view.component';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const mainErrorBar = inject(MatSnackBar);
  const accountService = inject(AccountService);
  const tokenService = inject(TokenService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
            if (!error.url?.includes('refreshtokens')) {
            const accessToken = tokenService.getAccessToken();
            const refreshToken = tokenService.getRefreshToken();
            if (accessToken && refreshToken) {
             return accountService
                .refreshTokens({
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                })
                .pipe(
                  switchMap((tokens) => {
                    if (tokens.body)
                      tokenService.saveTokens(
                        tokens.body?.accessToken,
                        tokens.body?.refreshToken
                      );
                    return next(req.clone({
                        headers: req.headers.set(
                          'Authorization',
                          `Bearer ${tokens.body?.accessToken}`
                        ),
                      })
                    );
                  })
                );
            }
          } else accountService.logOut();
          break;
        case 403:
          router.navigate(['/forbidden']);
          break;
        default:
          let errorsArray: IErrors[] = [];
          errorsArray.push({ status: error.status, message: error.message });
          const errors = error.error;
          if (errors) {
            if (errors.length) {
              for (let i = 0; i < errors.length; i++) {
                errorsArray.push({
                  status: errors[i].ErrorCode,
                  message: errors[i].ErrorMessage,
                });
              }
            } else
              errorsArray.push({
                status:0,
                message: error.error.message,
              });
          }
          mainErrorBar.openFromComponent(ErrorViewComponent, {
            duration: 5000,
            data: errorsArray,
            // verticalPosition:'top'
          });
          break;
      }
      return throwError(() => error);
    })
  );
};
