import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'

})
export class ErrorService {

  constructor(private mainErrorBar: MatSnackBar){}

  get errorHendler():any {
    return this.hendler.bind(this);
  }

  private hendler(error:HttpErrorResponse)
  {
    let errorMessage:string = error.message + "\n"
    let errors = error.error;
    for (let i = 0; i < errors.length; i++)
    errorMessage =  errorMessage + errors[i].ErrorCode +": " + errors[i].ErrorMessage + " \n"

    this.mainErrorBar.open(errorMessage,"close",{
      duration: 5000,
      // verticalPosition:'top'
    });
    return throwError(() => errorMessage);
  }
}
