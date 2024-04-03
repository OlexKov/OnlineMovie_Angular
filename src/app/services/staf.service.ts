import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStaf } from '../models/IStaf';
import { Observable, catchError } from 'rxjs';
import { IStafRole } from '../models/IStafRole';
import { IMovie } from '../models/IMovie';
import { IStafCreationModel } from '../models/IStafCreationModel';

@Injectable({
  providedIn: 'root'
})
export class StafService {
  webApi:string = "http://localhost:5000/api/Staf/"
  constructor(private http: HttpClient) { }
  getAll(): Observable<HttpResponse<IStaf[]>> {
    return this.http
      .get<IStaf[]>(this.webApi +'getall', {observe: 'response'});
  }

  get(id:number): Observable<HttpResponse<IStaf>> {
    return this.http
      .get<IStaf>(this.webApi +`get/${id}`, {observe: 'response'});
  }

  getroles(id:number): Observable<HttpResponse<IStafRole[]>> {
    return this.http
      .get<IStaf[]>(this.webApi +`getroles/${id}`, {observe: 'response'});
  }

  getmovies(id:number): Observable<HttpResponse<IMovie[]>> {
    return this.http
      .get<IMovie[]>(this.webApi +`getmovies/${id}`, {observe: 'response'});
  }

  remove(id: number): Observable<HttpResponse<object>> {
    return this.http
      .delete(this.webApi +`delete/${id}`, {observe: 'response'});
  }

  update(stafForm:FormData): Observable<HttpResponse<object>> {
    let hds = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .put<any>(this.webApi +`update`,stafForm, {observe: 'response',headers:hds});
  }
  create(stafForm:FormData): Observable<HttpResponse<object>> {
    let hds = new HttpHeaders().append('enctype','multipart/form-data')
    return this.http
      .post<any>(this.webApi +`create`,stafForm, {observe: 'response',headers:hds});
  }
}
