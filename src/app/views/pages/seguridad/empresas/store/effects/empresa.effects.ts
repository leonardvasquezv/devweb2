import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EmpresaService } from '../../services/empresa.service';
import * as EmpresaActions from '../actions/empresa.actions';

@Injectable()
export class EmpresaEffects {

  /**
   * Define el metodo constructor de los efectos
   * @param _actions$ define las propiedades y atributos del servicio de las acciones de redux
   * @param _empresaService define las propiedades y atributos del servicio de empresa
   * @param _router define las propiedades y atributos de las rutas
   * @param _utils define las propiedades y atributos del servicio de utilidades
   */
  constructor(
    private _actions$: Actions,
    private _empresaService: EmpresaService,
    private _router: Router,
    private _utils: UtilsService
  ) { }

  /**
   * Efecto encargado de llamar servicio de crear empresa
   */
  createEmpresa$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(EmpresaActions.createEmpresa),
      mergeMap(({ payload }) => this._empresaService.crearEmpresa(payload)
        .pipe(
          map((res: any) => {
            let payload = {};
            let errorType = ETiposError.error;
            if (res.status) {
              this._router.navigate(['home/seguridad/empresas']);
              payload = { ...res.data };
              errorType = ETiposError.correcto;
            }
            this._utils.procesarMessageWebApi(res.message, errorType);
            return EmpresaActions.updateEmpresaSuccess({ payload });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(EmpresaActions.createEmpresaError({ payload: err }))
          })
        )
      )
    )
  );

  /**
   * Efecto encargado de llamar servicio de editar empresa
   */
  updateEmpresa$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(EmpresaActions.updateEmpresa),
      mergeMap(({ payload }) => this._empresaService.editarEmpresa(payload)
        .pipe(
          map((res: any) => {
            let payload = { id: 0 };
            let errorType = ETiposError.error;
            if (res.status) {
              this._router.navigate(['home/seguridad/empresas']);
              payload = { ...res, id: payload.id };
              errorType = ETiposError.correcto;
            }
            this._utils.procesarMessageWebApi(res.message, errorType);
            return EmpresaActions.updateEmpresaSuccess({ payload });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(EmpresaActions.updateEmpresaError({ payload: err }))
          })
        )
      )
    )
  );

  /**
   * Efecto encargado de cargar todos los Empresa
   */
  loadEmpresas$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(EmpresaActions.loadEmpresas),
      mergeMap(({ criterios }) => this._empresaService.obtenerEmpresas(criterios)
        .pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return EmpresaActions.loadEmpresasSuccess({ payload: res });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(EmpresaActions.loadEmpresasError({ payload: err }))
          })
        )
      )
    )
  );

  /**
   * Efecto encargado de cargar un empresa por Id en especifico
   */
  loadEmpresa$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(EmpresaActions.loadEmpresa),
      mergeMap(({ id }) => this._empresaService.obtenerEmpresaPorId(id)
        .pipe(
          map((res) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return EmpresaActions.loadEmpresaSuccess({ empresa: res.data })
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(EmpresaActions.loadEmpresaError({ payload: err }))
          })
        )
      )
    )
  );



  /**
   * Efecto encargado de activar un empresa por Id en especifico
   */
  activarEmpresa$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(EmpresaActions.activarEmpresa),
      mergeMap(({ payload }) => this._empresaService.activarEmpresa(payload)
        .pipe(
          map((res) => {
            const errorType = res.status ? ETiposError.correcto : ETiposError.error;
            this._utils.procesarMessageWebApi(res.message, errorType);
            return EmpresaActions.activarEmpresaSuccess({ payload: res.data });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(EmpresaActions.activarEmpresaError({ payload: err }))
          })
        )
      )
    )
  );

  /**
   * Efecto encargado de inactivar un empresa por Id en especifico
   */
  inactivarEmpresa$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(EmpresaActions.inactivarEmpresa),
      mergeMap(({ payload }) => this._empresaService.inactivarEmpresa(payload)
        .pipe(
          map((res) => {
            const errorType = res.status ? ETiposError.correcto : ETiposError.error;
            this._utils.procesarMessageWebApi(res.message, errorType);
            return EmpresaActions.inactivarEmpresaSuccess({ payload: res.data });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(EmpresaActions.inactivarEmpresaError({ payload: err }))
          })
        )
      )
    )
  );

  /**
  * Efecto encargado de cargar todas las paginas
  */
  loadPaginas$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(EmpresaActions.loadPaginas),
      mergeMap(({ criterios }) => this._empresaService.obtenerMenuPaginasPorCriterios(criterios)
        .pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return EmpresaActions.loadPaginasSuccess({ paginas: res?.data });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(EmpresaActions.inactivarEmpresaError({ payload: err }))
          })
        )
      )
    )
  );

  /**
  * Efecto encargado de cargar todas las permisos
  */
  loadPermisos$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(EmpresaActions.loadPermisos),
      mergeMap(({ criterios }) => this._empresaService.obtenerPermisosPorCriterios(criterios)
        .pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return EmpresaActions.loadPermisosSuccess({ permisos: res?.data });
          }),
          catchError(err => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(EmpresaActions.inactivarEmpresaError({ payload: err }))
          })
        )
      )
    )
  );

}
