import { Injectable } from '@angular/core';
import { InitService } from '@core/services/init.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as InitActions from '../actions/init.action';

@Injectable()
export class InitEffects {

  /**
   * Define el metodo constructor de los efectos
   * @param _actions$ define las acciones del init
   * @param _initService define los servicios del init
   * @param _router inyeccion de dependecia para instanciar y obtener todas las configuraciones de _router
   */
  constructor(
    private _actions$: Actions,
    private _initService: InitService,
  ) { }


  loadLogin$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(InitActions.InitActionsTypes.LoadLogin),
      mergeMap(() =>
        forkJoin([
          this._initService.obtenerMenuperfil(),
          this._initService.obtenerUserIdentity()
        ])
          .pipe(
            map((res: any) => {
              localStorage.setItem('paisUsuario', JSON.stringify({ idPais: res[1].data.idPais, nombrePais: res[1].data.nombrePais }))
              return InitActions.loadLoginsSuccess({ payload: res })
            }),
            catchError(err => of(InitActions.loadLoginsError({ payload: err })))
          )
      )
    )
  );

  updateUserIdentity$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(InitActions.InitActionsTypes.UpdateUserIdentity),
      mergeMap(() =>
        this._initService.obtenerUserIdentity()
          .pipe(
            map((res: any) => InitActions.updateUserIdentitySuccess({ payload: res })),
            catchError(err => of(InitActions.updateUserIdentityError({ payload: err })))
          )
      )
    )
  );

}
