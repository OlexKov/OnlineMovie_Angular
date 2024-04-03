import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/LoginModel';
import { IResponseModel } from '../models/IResponsModel';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private webApi:string = "http://localhost:5000/api/Accounts/"
  constructor(private http: HttpClient) { }

  login(model:LoginModel): Observable<HttpResponse<IResponseModel>> {
    return this.http
      .post<IResponseModel>(this.webApi +`login`,model, {observe: 'response'});
  }
  refreshTokens(model:IResponseModel): Observable<HttpResponse<IResponseModel>> {
    return this.http
      .post<IResponseModel>(this.webApi +`refreshtokens`,model, {observe: 'response'});
  }

}
