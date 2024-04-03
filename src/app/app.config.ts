import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient , withInterceptors} from '@angular/common/http';
import { errorInterceptor } from './interceptors/error.interceptor';
import { accessTokenInterceptor } from './interceptors/access-token.interceptor';
import { refreshTokenInterceptor } from './interceptors/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHttpClient(
      withInterceptors([
      accessTokenInterceptor,
      refreshTokenInterceptor,
      errorInterceptor
    ])),
  ]
};
