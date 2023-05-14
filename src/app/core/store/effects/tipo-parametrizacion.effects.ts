import { Injectable } from '@angular/core';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { TipoParametrizacionService } from '@core/services/maestro-general/tipo-parametrizacion.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as tipoParametrizacionActions from '../actions/tipo-parametrizacion.action';



@Injectable()
export class TipoParametrizacionEffects {

  /**
   * Método donde se inyectan las dependencias
   * @param _actions$ define las acciones del estado
   * @param _tipoParametrizacionService define el servicio de los tipos de parametriacion
   * @param _utils define el servicio de utilidades
   */
  constructor(
    private _actions$: Actions,
    private _tipoParametrizacionService: TipoParametrizacionService,
    private _utils: UtilsService
  ) { }

  /**
   * Efecto encargado de cargar los tipos de parametrizacion
   */
  loadTiposParametrizacion$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(tipoParametrizacionActions.loadTiposParametrizacion),
      mergeMap(({ payload }) => this._tipoParametrizacionService.obtenerParametrizaciones(payload)
        .pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utils.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return tipoParametrizacionActions.loadtTiposParametrizacionSuccess({ payload: res })
          }),
          catchError((err) => {
            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
            return of(tipoParametrizacionActions.loadtTiposParametrizacionError({ payload: err }))
          })
        )
      )
    )
  )
}
