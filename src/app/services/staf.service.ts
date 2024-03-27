import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { IStaf } from '../models/IStaf';
import { Observable, catchError } from 'rxjs';
import { IStafRole } from '../models/IStafRole';
import { IMovie } from '../models/IMovie';
import { IStafCreationModel } from '../models/IStafCreationModel';

@Injectable({
  providedIn: 'root'
})
export class StafService {
  webApi:string = "http://localhost:5000/api/"
  constructor(private http: HttpClient, private errorService: ErrorService) { }
  getAll(): Observable<HttpResponse<IStaf[]>> {
    return this.http
      .get<IStaf[]>(this.webApi +'Staf/getall', {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }

  getroles(id:number): Observable<HttpResponse<IStafRole[]>> {
    return this.http
      .get<IStaf[]>(this.webApi +`Staf/getroles/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }

  getmovies(id:number): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(this.webApi +`Staf/getmovies/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }

  remove(id: number): Observable<HttpResponse<object>> {
    return this.http
      .delete(this.webApi +`Staf/delete/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }
  update(stafForm:FormData): Observable<HttpResponse<object>> {
    let hds = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .put<any>(this.webApi +`Staf/update`,stafForm, {observe: 'response',headers:hds})
      .pipe(catchError(this.errorService.errorHendler));
  }
  create(stafForm:FormData): Observable<HttpResponse<object>> {
    let hds = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .post<any>(this.webApi +`Staf/create`,stafForm, {observe: 'response',headers:hds})
      .pipe(catchError(this.errorService.errorHendler));
  }
}
