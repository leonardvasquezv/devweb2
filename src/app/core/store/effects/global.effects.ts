import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GlobalActions from '../actions/global.action';
import { mergeMap, map, catchError } from 'rxjs/operators'
import { of, Observable, forkJoin } from 'rxjs';
import { Action } from '@ngrx/store';
import { UbicacionService } from '@core/services/ubicacion.service';

@Injectable()
export class GlobalEffects {

    /**
     * Define el metodo constructor de los efectos
     * @param _actions$ define las acciones del global
     * @param ubicacionService$ Servicio de Ubicacion
     */
    constructor(
        private _actions$: Actions,
        private ubicacionService: UbicacionService
    ) { }

    /**
     * Efecto encargado de cargar todos los global
     */
    loadGlobals$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(GlobalActions.loadGlobals),
            mergeMap(() =>
                forkJoin([
                    this.ubicacionService.obtenerDepartamentos(),
                    this.ubicacionService.obtenerMunicipios()
                ])
                    .pipe(
                        map((res: any) => GlobalActions.loadGlobalsSuccess({ payload: res })),
                        catchError(err => of(GlobalActions.loadGlobalsError({ payload: err })))
                    )
            )
        )
    );

}
