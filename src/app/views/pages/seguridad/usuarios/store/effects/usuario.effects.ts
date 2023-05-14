import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { InitModel } from '@core/model/init.model';
import { SeguridadService } from '@core/services/seguridad.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario.service';
import * as UsuarioActions from '../actions/usuario.actions';

@Injectable()
export class UsuarioEffects {

  /**
   * Define el metodo constructor de los efectos
   * @param _actions$ define las acciones del usuario
   * @param _usuarioService define los servicios del usuario
   * @param _router inyeccion de dependecia para instanciar y obtener todas las configuraciones de _router
   * @param _util utilidades del aplicativo
   * @param _seguridadService define los servicios de seguridad
   * @param _initModel define el modelo donde se llaman las acciones de init
   */
  constructor(
    private _actions$: Actions,
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _utils: UtilsService,
    private _seguridadService: SeguridadService,
    private _initModel: InitModel
  ) { }

  /**
   * Efecto encargado de llamar servicio de crear usuario
   */
  createUsuario$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(UsuarioActions.createUsuario),
      mergeMap(({ payload }) => this._usuarioService.crearUsuario(payload)
        .pipe(
          map((res: any) => {
            let payload = {};
            let errorType = ETiposError.error;
            if (res.status) {
              this._router.navigate(['home/seguridad/usuarios']);
              payload = { ...res.data };
              errorType = ETiposError.correcto;
            }
            this._utils.procesarMessageWebApi(res.message, errorType);
            return UsuarioActions.updateUsuarioSuccess({ payload });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(UsuarioActions.createUsuarioError({ payload: err }))
          })
        )
      )
    )
  );

  /**
   * Efecto encargado de llamar servicio de editar usuario
   */
  updateUsuario$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(UsuarioActions.updateUsuario),
      mergeMap(({ payload }) => this._usuarioService.editarUsuario(payload)
        .pipe(
          map((res: any) => {
            let payload = { id: 0 };
            let errorType = ETiposError.error;
            if (res.status) {
              this._router.navigate(['home/seguridad/usuarios']);
              payload = { ...res, id: payload.id };
              errorType = ETiposError.correcto;
            }
            this._initModel.updateUserIdentity();
            this._utils.procesarMessageWebApi(res.message, errorType);
            return UsuarioActions.updateUsuarioSuccess({ payload });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(UsuarioActions.updateUsuarioError({ payload: err }))
          })
        )
      )
    )
  );

  /**
   * Efecto encargado de cargar todos los Usuario
   */
  loadUsuarios$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(UsuarioActions.loadUsuarios),
      mergeMap(({ criterios }) => this._seguridadService.obtenerUsuarios(criterios)
        .pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return UsuarioActions.loadUsuariosSuccess({ payload: res });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(UsuarioActions.loadUsuariosError({ payload: err }))
          })
        )
      )
    )
  );

  /**
   * Efecto encargado de cargar un usuario por Id en especifico
   */
  loadUsuario$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(UsuarioActions.loadUsuario),
      mergeMap(({ id }) => this._usuarioService.obtenerUsuarioPorId(id)
        .pipe(
          map((res) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return UsuarioActions.loadUsuarioSuccess({ usuario: res.data })
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(UsuarioActions.loadUsuarioError({ payload: err }))
          })
        )
      )
    )
  );


  /**
   * Efecto encargado de activar un usuario por Id en especifico
   */
  activarUsuario$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(UsuarioActions.activarUsuario),
      mergeMap(({ payload }) => this._usuarioService.ActivarUsuario(payload)
        .pipe(
          map((res) => {
            const errorType = res.status ? ETiposError.correcto : ETiposError.error;
            this._utils.procesarMessageWebApi(res.message, errorType);
            return UsuarioActions.activarUsuarioSuccess({ payload: res.data });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(UsuarioActions.activarUsuarioError({ payload: err }))
          })
        )
      )
    )
  );

  /**
   * Efecto encargado de inactivar un usuario por Id en especifico
   */
  inactivarUsuario$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(UsuarioActions.inactivarUsuario),
      mergeMap(({ payload }) => this._usuarioService.InactivarUsuario(payload)
        .pipe(
          map((res) => {
            const errorType = res.status ? ETiposError.correcto : ETiposError.error;
            this._utils.procesarMessageWebApi(res.message, errorType);
            return UsuarioActions.inactivarUsuarioSuccess({ payload: res.data });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(UsuarioActions.inactivarUsuarioError({ payload: err }))
          })
        )
      )
    )
  );

}
