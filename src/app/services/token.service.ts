import { Injectable } from '@angular/core';
import { IUserData } from '../models/IUserData';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessKey = 'access-token-key';
  private refreshKey = 'refresh-token-key';
  userData: IUserData | null;
  constructor() {}

  getUserDataFromToken(): IUserData | null {
    const token = this.getAccessToken();
    if (token) {
      const data: any = jwtDecode<IUserData>(token);
      return {
        id: data[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier' as keyof IUserData
        ],
        name: data[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name' as keyof IUserData
        ],
        surname:
          data[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname' as keyof IUserData
          ],
        email:
          data[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' as keyof IUserData
          ],
        exp: data['exp' as keyof IUserData],
        iss: data['iss' as keyof IUserData],
        roles:
          data[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' as keyof IUserData
          ],
        dateOfBirth:
          data[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth' as keyof IUserData
          ],
      };
    }
    return null;
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessKey, accessToken);
    localStorage.setItem(this.refreshKey, refreshToken);
    this.updateUserData();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    this.userData = null;
  }

  updateUserData(): void {
    this.userData = this.getUserDataFromToken();
  }
}
