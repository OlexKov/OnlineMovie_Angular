import {
  HttpClient,
  HttpErrorResponse,
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

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  getAll(): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>('https://localhost:7158/api/Movie/getall', {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }
  take(skip: number, count: number): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(`https://localhost:7158/api/Movie/take?skip=${skip}&count=${count}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }
  get(id: number): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(`https://localhost:7158/api/Movie/get/${id}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }

  getStafs(id: number): Observable<HttpResponse<IStaf[]>> {
    return this.http
      .get<IStaf[]>(`https://localhost:7158/api/Movie/getstafs/${id}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }

  getScreens(id: number): Observable<HttpResponse<IImage[]>> {
    return this.http
      .get<IImage[]>(`https://localhost:7158/api/Movie/getscreens/${id}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }

  getGenres(id: number): Observable<HttpResponse<IGenre[]>> {
    return this.http
      .get<IGenre[]>(`https://localhost:7158/api/Movie/getgenres/${id}`,{observe: 'response' })
      .pipe(catchError(this.errorService.errorHendler));
  }

  remove(id: number): Observable<HttpResponse<object>> {
    return this.http
      .delete(`https://localhost:7158/api/Movie/delete/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }
}
