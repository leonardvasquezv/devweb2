import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { AuthUtils } from '@core/utils/auth-utils';
import { PermisosUtils } from '@core/utils/permisos-utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as authActions from '../actions/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthEffects {

  /**
   * Metodo constructor de los efectos de autenticacion
   * @param actions$ de la autenticacion
   * @param authService servicios propios de la autenticacion
   * @param router maneja la navegacion en el sistema
   */
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private utils: UtilsService
  ) { }

  /**
   * Effecto encargado de iniciar sesión y ejecutar acciones
   */
  login$: Observable<Action> = createEffect(
    (): any => this.actions$.pipe(
      ofType(authActions.loginUser),
      mergeMap((action) => this.authService.login(action.login).pipe(
        map((response: ResponseWebApi) => {
          if (response.status) {
            AuthUtils.setLocalStorage(response);
            let ruta = 'home/dashboard';
            if (localStorage.getItem('isLoggedin')) {
              this.utils.getPaginaUrlWithArray('/' + ruta, response?.data?.loginUser?.menuPerfilDefault).then(element => {
                PermisosUtils.GuardarPagina(element?.id);
              });
            } else {
              ruta = '/';
            }
            this.router.navigate([ruta]);
          } else {
            localStorage.setItem('isLoggedin', 'false');
            this.utils.procesarMessageWebApi(response.message, ETiposError.error);
          }
          return authActions.loginUserSuccess();
        }),
        catchError((response) => {
          this.utils.procesarMessageWebApi(response.error.message, ETiposError.error);
          return of(authActions.errorLoginUser());
        })
      )
      )
    )
  );

}
