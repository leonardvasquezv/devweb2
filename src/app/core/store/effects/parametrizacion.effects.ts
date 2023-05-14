import { Injectable } from "@angular/core";
import { ETiposError } from "@core/enum/tipo-error.enum";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { ParametrizacionService } from "@core/services/maestro-general/parametrizacion.service";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from "@ngrx/store";
import { UtilsService } from "@shared/services/utils.service";
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from "rxjs/operators";
import * as parametrizacionActions from '../actions/parametrizacion.action';



@Injectable()
export class ParametrizacionEffects {

  /**
   * Método donde se inyectan las dependencias
   * @param _actions$ define las acciones del estado
   * @param _parametrizacionService define el servicio de los tipos de parametriacion
   * @param _utils define el servicio de utilidades
   */
  constructor(
    private _actions$: Actions,
    private _parametrizacionService: ParametrizacionService,
    private _utils: UtilsService
  ) { }

  /**
   * Efecto encargado de cargar los tipos de parametrizacion
   */
  loadTiposParametrizacion$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(parametrizacionActions.loadParametrizaciones),
      mergeMap(({ criterios }) => this._parametrizacionService.obtenerListaParametrizacion(criterios)
        .pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return parametrizacionActions.loadParametrizacionesSuccess({ payload: res })
          }),
          catchError((err) => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(parametrizacionActions.loadParametrizacionesError({ payload: err }))
          })
        )
      )
    )
  )

  /**
   * Efecto encargado de guardar una parametrizacion
   */
  createTiposParametrizacion$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(parametrizacionActions.createParametrizaciones),
      mergeMap(({ payload }) => this._parametrizacionService.crearParametrizacion(payload)
        .pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return parametrizacionActions.loadParametrizacionesSuccess({ payload: res })
          }),
          catchError((err) => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(parametrizacionActions.loadParametrizacionesError({ payload: err }))
          })
        )
      )
    )
  )

  /**
   * Efecto encargado de obtener una parametrizacion por id
   */
  tiposParametrizacionPorId$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(parametrizacionActions.loadParametrizacion),
      mergeMap(({ idTipoDetalle }) => this._parametrizacionService.obtenerParametrizacionPorId(idTipoDetalle)
        .pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return parametrizacionActions.loadParametrizacionSuccess({ tipoDetalle: res.data })
          }),
          catchError((err) => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(parametrizacionActions.loadParametrizacionError({ payload: err }))
          })
        )
      )
    )
  )

  /**
   * Efecto encargado de editar una parametrizacion
   */
  tiposParametrizacionEditar$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(parametrizacionActions.updateParametrizacion),
      mergeMap(({ tipoDetalle }) => this._parametrizacionService.editarParametrizacion(tipoDetalle)
        .pipe(
          map((res: ResponseWebApi) => {
            this._utils.procesarMessageWebApi(res.message, !res.status ? ETiposError.error : ETiposError.correcto);
            return parametrizacionActions.updateParametrizacionSuccess({ payload: res.data })
          }),
          catchError((err) => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(parametrizacionActions.updateParametrizacionError({ payload: err }))
          })
        )
      )
    )
  )

  /**
   * Efecto encargado de cambiar el estado de una parametrizacion
   */
  parametrizacionCambioEstado$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(parametrizacionActions.cambioEstadoParametrizacion),
      mergeMap(({ tipoDetalle }) => this._parametrizacionService.cambioEstadoParametrizacion(tipoDetalle)
        .pipe(
          map((res: ResponseWebApi) => {
            this._utils.procesarMessageWebApi(res.message, !res.status ? ETiposError.error : ETiposError.correcto);
            return parametrizacionActions.cambioEstadoParametrizacionSuccess({ payload: res.data })
          }),
          catchError((err) => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(parametrizacionActions.cambioEstadoParametrizacionError({ payload: err }))
          })
        )
      )
    )
  )

}
