import { Injectable } from '@angular/core';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { EdsService } from '@core/services/eds.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as edsActions from '../actions/eds.action';

@Injectable({
    providedIn: 'root'
})
export class EdsEffects {
    /**
     * Método para inyectar dependencias
     * @param _actions$ Actions del effect
     * @param _edsService Servicios de eds
     * @param _utils Servicios de utils
     * @param _translateService Servicio de traducciones
     */
    constructor(
        private _actions$: Actions,
        private _edsService: EdsService,
        private _utils: UtilsService,
        private _translateService: TranslateService,
    ) { }
    /**
     * Efecto que se dispara al cargar las EDS
     */
    loadProcesos$: Observable<Action> = createEffect((): any =>
        this._actions$.pipe(
            ofType(edsActions.LoadEds),
            mergeMap(({ payload }) =>
                this._edsService.obtenerEds(payload)
                    .pipe(
                        map((res: ResponseWebApi) => {
                            if (!res.status) {
                                this._utils.procesarMessageWebApi(
                                    res.message,
                                    ETiposError.error
                                );
                            }
                            return edsActions.LoadEdsSuccess(
                                {
                                    payload: res,
                                }
                            );
                        }),
                        catchError((err) => {
                            this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                            return of(
                                edsActions.LoadEdsError(
                                    {
                                        payload: err,
                                    }
                                )
                            );
                        })
                    )
            )
        )
    );
    /**
      * Efecto encargado de editar el estado de una eds
      */
    updateEstadoEds$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(edsActions.UpdateEstadoEds),
            mergeMap(({ payload }) => this._edsService.actualizarEstadoEds(payload)
                .pipe(
                    map((res: ResponseWebApi) => {
                        if (res.status) {
                            let mensaje = this._translateService.instant(
                                "TITULOS.REGISTRO_ACTUALIZADO_EXITO"
                            );
                            this._utils.procesarMessageWebApi(mensaje, "Correcto");
                            return edsActions.UpdateEstadoEdsSuccess({ payload: { ...res } })
                        } else {
                            let mensaje = this._translateService.instant(
                                "TITULOS.REGISTRO_ACTUALIZADO_ERROR"
                            );
                            this._utils.procesarMessageWebApi(mensaje, "Error");
                            return edsActions.UpdateEstadoEdsError({ payload: res.message })
                        }
                    }),
                    catchError(err => of(edsActions.UpdateEstadoEdsError({ payload: err })))
                )
            )
        )
    );

}