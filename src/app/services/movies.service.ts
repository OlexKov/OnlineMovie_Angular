import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IMovie } from '../models/IMovie';
import { IStaf } from '../models/IStaf';
import { IImage } from '../models/IImage';
import { IGenre } from '../models/IGenre';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  webApi:string = "http://localhost:5000/api/Movie/"
  constructor(private http: HttpClient) { }

  getAll(): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(this.webApi +'getall', {observe: 'response'});
  }
  take(skip: number, count: number): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(this.webApi +`take?skip=${skip}&count=${count}`,{observe: 'response' });
  }
  get(id: number): Observable<HttpResponse<IMovie>> {
    return this.http
      .get<IMovie>(this.webApi +`get/${id}`,{observe: 'response' });
  }

  getStafs(id: number): Observable<HttpResponse<IStaf[]>> {
    return this.http
      .get<IStaf[]>(this.webApi +`getstafs/${id}`,{observe: 'response' });
  }

  getScreens(id: number): Observable<HttpResponse<IImage[]>> {
    return this.http
      .get<IImage[]>(this.webApi +`getscreens/${id}`,{observe: 'response' });
  }

  getGenres(id: number): Observable<HttpResponse<IGenre[]>> {
    return this.http
      .get<IGenre[]>(this.webApi +`getgenres/${id}`,{observe: 'response' });
  }

  remove(id: number): Observable<HttpResponse<object>> {
    return this.http
      .delete(this.webApi +`delete/${id}`, {observe: 'response'});
  }
  update(movieForm:FormData): Observable<HttpResponse<object>> {
    let hdrs = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .put<any>(this.webApi +`update`,movieForm, {observe: 'response',headers:hdrs});
  }

  create(movieForm:FormData): Observable<HttpResponse<object>> {
    let hdrs = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .post<any>(this.webApi +`create`,movieForm, {observe: 'response',headers:hdrs});
  }
}
