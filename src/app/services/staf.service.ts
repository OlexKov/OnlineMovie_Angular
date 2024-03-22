import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { IStaf } from '../models/IStaf';
import { Observable, catchError } from 'rxjs';

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
  remove(id: number): Observable<HttpResponse<object>> {
    return this.http
      .delete(`https://localhost:7158/api/Staf/delete/${id}`, {observe: 'response'})
      .pipe(catchError(this.errorService.errorHendler));
  }
}
