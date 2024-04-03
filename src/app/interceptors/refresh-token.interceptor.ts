import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { catchError, repeat, retry, throwError } from 'rxjs';
import { AccountService } from '../services/account.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  let reqToken = req.clone();
  const tokenService = inject(TokenService);
  const accountService = inject(AccountService);
  return next(reqToken).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status == 401) {
          if (!error.url?.includes('refreshtokens')) {
          accountService
            .refreshTokens({
              refreshToken: tokenService.getRefreshToken() || '',
              accessToken: tokenService.getAccessToken() || '',
            }).subscribe((res)=>{
              tokenService.saveTokens(res.body?.accessToken || '', res.body?.refreshToken||'');
              window.location.reload();
              return res;
            });
        }
        else
        {
          tokenService.signOut();
        }

      }
      return throwError(() => error);
    }));
};
