import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IErrors } from '../models/Errors';
import { ErrorViewComponent } from '../components/error-view/error-view.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorsArray: IErrors[] = [];
  constructor(private mainErrorBar: MatSnackBar) {}

  get errorHendler(): any {
    return this.hendler.bind(this);
  }

  private hendler(error: HttpErrorResponse) {
    this.errorsArray = [];
    this.errorsArray.push({ status: error.status, message: error.message });
    const errors = error.error;
    if (errors && errors.length>0) {
      for (let i = 0; i < errors.length; i++) {
        this.errorsArray.push({
          status: errors[i].ErrorCode,
          message: errors[i].ErrorMessage,
        });
      }
    }

    this.mainErrorBar.openFromComponent(ErrorViewComponent, {
      duration: 5000,
      data: this.errorsArray
      // verticalPosition:'top'
    });
    return throwError(() => this.errorsArray);
  }
}
