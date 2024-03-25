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

  constructor(private http: HttpClient, private errorService: ErrorService) { }
  getAll(): Observable<HttpResponse<IStaf[]>> {
    return this.http
      .get<IStaf[]>('https://localhost:7158/api/Staf/getall', {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }

  getroles(id:number): Observable<HttpResponse<IStafRole[]>> {
    return this.http
      .get<IStaf[]>(`https://localhost:7158/api/Staf/getroles/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }

  getmovies(id:number): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(`https://localhost:7158/api/Staf/getmovies/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }

  remove(id: number): Observable<HttpResponse<object>> {
    return this.http
      .delete(`https://localhost:7158/api/Staf/delete/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }
  update(stafForm:FormData): Observable<HttpResponse<object>> {
    let hds = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .put<any>(`https://localhost:7158/api/Staf/update`,stafForm, {observe: 'response',headers:hds})
      .pipe(catchError(this.errorService.errorHendler));
  }
}
