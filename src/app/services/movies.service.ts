import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IMovie } from '../models/IMovie';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http:HttpClient,private errorService:ErrorService){ }

  getAll():Observable<IMovie[]>{
     return this.http.get<IMovie[]>("https://localhost:7158/api/Movie/getall")
                     .pipe(catchError(this.errorHendler.bind(this)))
  }
  take(skip:number,count:number):Observable<IMovie[]>{
    return this.http.get<IMovie[]>(`https://localhost:7158/api/Movie/take?skip=${skip}&count=${count}`)
                    .pipe(catchError(this.errorHendler.bind(this)))
 }
  get(id:number):Observable<IMovie[]>{
     return this.http.get<IMovie[]>(`https://localhost:7158/api/Movie/get/${id}`)
                     .pipe(catchError(this.errorHendler.bind(this)))
  }

  private errorHendler(error:HttpErrorResponse)
  {
     this.errorService.handle(error.error.message);
     return throwError(() => error.error.message);
  }
}

