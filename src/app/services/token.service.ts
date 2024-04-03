import { Injectable } from '@angular/core';
import { ITokenData } from '../models/TokenData';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessKey = "access-token-key";
  private refreshKey = "refresh-token-key";
  tokenData$ = new BehaviorSubject<ITokenData>(new Object() as ITokenData)
  constructor( private accountService: AccountService) { }

  getDataFromToken():ITokenData | null
  {
    const token = this.getAccessToken();
    if(token)
       return jwtDecode<ITokenData>(token)
    return null;
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.setItem(this.accessKey, accessToken);
    localStorage.setItem(this.refreshKey, refreshToken);
    this.updateTokenData();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }


  refreshTokens():void{
    this.accountService
          .refreshTokens({
            accessToken: this.getAccessToken() || ' ',
            refreshToken: this.getRefreshToken() || ' ',
          })
          .subscribe((res) => {
            if(res.status == 200)
            {
               this.saveTokens(res.body?.accessToken || '',res.body?.refreshToken ||'')
            }
          });
  }

  signOut(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    this.tokenData$.next(new Object() as ITokenData)
  }

  updateTokenData():void
  {
    const data = this.getDataFromToken();
    if (data)
       this.tokenData$.next(data)
  }

}
