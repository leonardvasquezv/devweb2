import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '@core/guard/auth.guard';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: []
})
export class AuthComponent implements OnInit {

  constructor(
    private _authGuard: AuthGuard,
    private _route: Router
  ) { }

  ngOnInit(): void {
    this.noReturnAuth();
  }

  /**
   * Metodo usado para no retornar al login una vez el usuario se encuentre autenticado
   */
  private noReturnAuth(): void {
    this._authGuard.isAuthenticated().subscribe(hasUser => {
      if (hasUser) {
        this._route.navigate(['/home/dashboard']);
      }
    });
  }

}
