import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IErrors } from '../models/Errors';
import { catchError, throwError } from 'rxjs';
import { ErrorViewComponent } from '../components/error-view/error-view.component';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const mainErrorBar = inject(MatSnackBar);
  const hidenErrors = [401];
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!hidenErrors.includes(error.status)) {
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
              status: error.status,
              message: error.error.message,
            });
        }

        mainErrorBar.openFromComponent(ErrorViewComponent, {
          duration: 5000,
          data: errorsArray,
          // verticalPosition:'top'
        });
      }
      return throwError(() => error);
    })
  );
};
