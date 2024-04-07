import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/LoginModel';
import { IResponseModel } from '../models/IResponsModel';
import { Observable} from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { IRegisterModel } from '../models/RegisterModel';
import { IResetPasswordModel } from '../models/ResetPasswordModel';



@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private webApi:string = "http://localhost:5000/api/Accounts/"
  constructor(private http: HttpClient,private tokenService:TokenService,private router:Router) {}

  getResetToken(): Observable<HttpResponse<string>> {
    const requestOptions: Object = {
       responseType: 'text',
       observe: 'response'
    }
    return this.http
      .get<HttpResponse<string>>(this.webApi +`getresettoken/${this.getUserEmail()}`, requestOptions);
  }


  resetPassword(model:IResetPasswordModel): Observable<HttpResponse<object>> {
    return this.http
      .post<IResetPasswordModel>(this.webApi +`resetpasswordemail`,model, {observe: 'response'});
  }

  fogot(email:string): Observable<HttpResponse<object>> {
    return this.http
      .post<object>(this.webApi +`fogot/${email}`,null, {observe: 'response'});
  }

  register(model:IRegisterModel): Observable<HttpResponse<object>> {
    return this.http
      .post<object>(this.webApi +`register`,model, {observe: 'response'});
  }

  login(model:LoginModel): Observable<HttpResponse<IResponseModel>> {
    return this.http
      .post<IResponseModel>(this.webApi +`login`,model, {observe: 'response'});
  }

  refreshTokens(model:IResponseModel): Observable<HttpResponse<IResponseModel>> {
    return this.http
      .post<IResponseModel>(this.webApi +`refreshtokens`,model, {observe: 'response'});
  }

  logOut(): Observable<HttpResponse<any>> {
     const refreshToken = this.tokenService.getRefreshToken();
     this.tokenService.removeTokens();
     this.router.navigate(["/"]);
     return this.http.post(this.webApi + 'logout',refreshToken,{observe:'response'})
  }

  isAuthenticated():boolean{
   return this.tokenService.userData != null
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && this.tokenService.userData?.roles.includes('Admin') || false;
  }

  isUser(): boolean {
    return this.isAuthenticated() && this.tokenService.userData?.roles.includes('User') || false;
  }

  getUserName():string | undefined{
    return this.tokenService.userData?.name;
  }

  getUserSurname():string | undefined{
    return this.tokenService.userData?.surname;
  }

  getUserBirthdade():string | undefined{
    return  this.tokenService.userData?.dateOfBirth
    .split('.')
    .reverse()
    .join('-');
  }

  getUserEmail():string | undefined{
    return this.tokenService.userData?.email;
  }

  getUserId():string | undefined{
    return this.tokenService.userData?.id;
  }

}
