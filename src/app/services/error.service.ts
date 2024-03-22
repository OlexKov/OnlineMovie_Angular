import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'

})
export class ErrorService {

  constructor(private _snackBar: MatSnackBar){}

  get errorHendler():any {
    return this.hendler.bind(this);
  }

  private hendler(error:HttpErrorResponse)
  {
    this._snackBar.open(error.message,"close",{
      duration: 3000,
      // verticalPosition:'top'
    });
    return throwError(() => error.message);
  }
}
