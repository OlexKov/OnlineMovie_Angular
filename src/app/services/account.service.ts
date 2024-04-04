import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/LoginModel';
import { IResponseModel } from '../models/IResponsModel';
import { Observable} from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { IRegisterModel } from '../models/RegisterModel';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private webApi:string = "http://localhost:5000/api/Accounts/"
  constructor(private http: HttpClient,private tokenService:TokenService,private router:Router) {}

  register(model:IRegisterModel): Observable<HttpResponse<object>> {
    return this.http
      .post<IRegisterModel>(this.webApi +`register`,model, {observe: 'response'});
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

  refreshAccessToken(): void {
    const accessToken = this.tokenService.getAccessToken();
    const ferreshToken = this.tokenService.getRefreshToken();
    if (accessToken && ferreshToken) {
      this.refreshTokens({
          accessToken: accessToken,
          refreshToken: ferreshToken,
        })
        .subscribe((res) => {
          if (res.status == 200 && res.body) {
            this.tokenService.saveTokens(res.body.accessToken, res.body.refreshToken);
            window.location.reload();
          }
        });
    }
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
    return this.tokenService.userData?.dateOfBirth;
  }

  getUserEmail():string | undefined{
    return this.tokenService.userData?.dateOfBirth;
  }

  getUserId():string | undefined{
    return this.tokenService.userData?.id;
  }

}
