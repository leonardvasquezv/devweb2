import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor() { }

  public isAuthenticated(): Observable<boolean> {
    const token = this.getUserToken();
    const helper = new JwtHelperService();
    return !token ? of(false) : of(!helper.isTokenExpired(token));
  }

  getUserToken(): string {
    const userToken = JSON.parse(localStorage.getItem('Authorization'));
    if (userToken !== 'undefined' && userToken !== null) {
      return userToken;
    } else {
      return null;
    }
  }
}
