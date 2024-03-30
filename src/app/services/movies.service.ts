import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IMovie } from '../models/IMovie';
import { ErrorService } from './error.service';
import { IStaf } from '../models/IStaf';
import { IImage } from '../models/IImage';
import { IGenre } from '../models/IGenre';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  webApi:string = "http://localhost:5000/api/"
  constructor(private http: HttpClient, private errorService: ErrorService) { }

  getAll(): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(this.webApi +'Movie/pgetall', {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }
  take(skip: number, count: number): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(this.webApi +`Movie/take?skip=${skip}&count=${count}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }
  get(id: number): Observable<HttpResponse<IMovie>> {
    return this.http
      .get<IMovie>(this.webApi +`Movie/get/${id}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }

  getStafs(id: number): Observable<HttpResponse<IStaf[]>> {
    return this.http
      .get<IStaf[]>(this.webApi +`Movie/getstafs/${id}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }

  getScreens(id: number): Observable<HttpResponse<IImage[]>> {
    return this.http
      .get<IImage[]>(this.webApi +`Movie/getscreens/${id}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }

  getGenres(id: number): Observable<HttpResponse<IGenre[]>> {
    return this.http
      .get<IGenre[]>(this.webApi +`Movie/getgenres/${id}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }

  remove(id: number): Observable<HttpResponse<object>> {
    return this.http
      .delete(this.webApi +`Movie/delete/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }
  update(movieForm:FormData): Observable<HttpResponse<object>> {
    let hdrs = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .put<any>(this.webApi +`Movie/update`,movieForm, {observe: 'response',headers:hdrs})
      .pipe(catchError(this.errorService.errorHendler));
  }

  create(movieForm:FormData): Observable<HttpResponse<object>> {
    let hdrs = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .post<any>(this.webApi +`Movie/create`,movieForm, {observe: 'response',headers:hdrs})
      .pipe(catchError(this.errorService.errorHendler));
  }
}
