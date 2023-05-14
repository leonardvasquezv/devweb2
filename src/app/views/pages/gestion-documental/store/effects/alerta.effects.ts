import { Injectable } from "@angular/core";
import { ETiposError } from "@core/enum/tipo-error.enum";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { UtilsService } from "@shared/services/utils.service";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { GestionDocumentalService } from "../../gestion-documental.service";
import * as AlertActions from "../actions/alerta.actions";

@Injectable()
export class AlertaEffects {
  /**
   * Define el metodo constructor de los efectos
   * @param _actions$ define las acciones del estado
   * @param _gestionDocumentalService Servicio del modulo Gestion Documental
   * @param _utilService variable con métodos globales
   */
  constructor(
    private _actions$: Actions,
    private _gestionDocumentalService: GestionDocumentalService,
    private _utilService: UtilsService
  ) { }
  /**
   * Efecto encargado de cargar los procesos
   */
  loadAlertas$: Observable<Action> = createEffect((): any =>
    this._actions$.pipe(ofType(AlertActions.loadAlertas),
      mergeMap(({ idDocumento }) => this._gestionDocumentalService.obtenerAlertasPorDocumento(idDocumento).pipe(
        map((res: ResponseWebApi) => {
          if (!res.status) this._utilService.procesarMessageWebApi(res.message, ETiposError.error);
          return AlertActions.loadAlertasSuccess({ payload: res });
        }),
        catchError((err) => {
          this._utilService.procesarMessageWebApi(err.error, ETiposError.error);
          return of(AlertActions.loadAlertasError({ payload: err }));
        })
      )
      )
    )
  );
}
