import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const TOKEN_HEADER_KEY = 'Authorization';
  const tokenService = inject(TokenService);
  let accessToken = tokenService.getAccessToken();
  if(accessToken)
      return next(req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + accessToken) }));
  return next(req.clone());
};
