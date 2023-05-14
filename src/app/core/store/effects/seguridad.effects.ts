import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as SeguridadActions from '@core/store/actions/seguridad.action';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Router } from '@angular/router';
import { AuthUtils } from '../../utils/auth-utils';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { SeguridadService } from '@core/services/seguridad.service';
import { UtilsService } from '@shared/services/utils.service';
@Injectable()
export class SeguridadEffects {

  /**
   * Define el metodo constructor de los efectos
   * @param _actions$ define las acciones del init
   * @param _seguridadService define los servicios del init
   * @param _router inyeccion de dependecia para instanciar y obtener todas las configuraciones de _router
   */
  constructor(
    private _actions$: Actions,
    private _seguridadService: SeguridadService,
    private _router: Router,
    private _utils: UtilsService
  ) { }

  /**
   * Effecto encargado de iniciar sesión y ejecutar acciones
   */
  logout$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(SeguridadActions.logoutUser),
      mergeMap(() => this._seguridadService.logout().pipe(
        map((response: ResponseWebApi) => {
          if (response.status) {
            localStorage.clear();
            this._router.navigate(['/']);
            return SeguridadActions.LogoutUserSuccess();
          } else {
            localStorage.clear();
            if (AuthUtils.isLoggedIn()) {
              this._router.navigate(['/']);
              this._utils.procesarMessageWebApi('Su sesion expiro o inicio sesión en otro PC, favor validar.', ETiposError.info);
            }
          }
        }),
        catchError(() => {
          localStorage.clear();
          this._router.navigate(['/']);
          this._utils.procesarMessageWebApi('Su sesion expiro o inicio sesión en otro PC, favor validar.', ETiposError.info);
          return of(SeguridadActions.errorLogoutUser());
        })
      )
      )
    )
  );

  /**
   * Effecto encargado de generar codigo de verificacion
   */
  generarCodigo$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(SeguridadActions.generarCodigo),
      mergeMap((action) => this._seguridadService.generarCodigo(action.body).pipe(
        map((response: ResponseWebApi) => {
          if (!response.status) {
            this._utils.procesarMessageWebApi(response.message, response.message === 'Usuario no se encuentra registrado.' ? ETiposError.error : ETiposError.correcto);
          }
          return SeguridadActions.generarCodigoSuccess({ response });
        }),
        catchError((response) => {
          this._utils.procesarMessageWebApi(response.message, ETiposError.error);
          return of(SeguridadActions.generarCodigoError(response));
        })
      )
      )
    )
  );

  /**
   * Effecto encargado de validar codigo de verificacion
   */
  validarCodigo$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(SeguridadActions.validarCodigo),
      mergeMap((action) => this._seguridadService.validarCodigo(action.body).pipe(
        map((response: ResponseWebApi) => {
          if (!response.status) {
            this._utils.procesarMessageWebApi(response.message, ETiposError.correcto);
          }
          return SeguridadActions.validarCodigoSuccess({ response });
        }),
        catchError((response) => {
          this._utils.procesarMessageWebApi(response.error.message, ETiposError.error);
          return of(SeguridadActions.validarCodigoError(response));
        })
      )
      )
    )
  );

}
