import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  globalError$ = new Subject<string>()

  clearError(){
    this.globalError$.next("");
  }

  errorHendler(error:HttpErrorResponse)
  {
     this.globalError$.next(error.error.message);
     return throwError(() => error.error.message);
  }
  handle(message:string)
  {
    this.globalError$.next(message);
  }
}
