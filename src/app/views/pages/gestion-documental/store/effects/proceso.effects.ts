import { Injectable } from "@angular/core";
import { ETiposError } from "@core/enum/tipo-error.enum";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { UtilsService } from "@shared/services/utils.service";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { GestionDocumentalService } from "../../gestion-documental.service";
import * as ProcesoActions from "../actions/proceso.actions";

@Injectable()
export class ProcesoEffects {
  /**
   * Define el metodo constructor de los efectos
   * @param _actions$ define las acciones del estado
   * @param _gestionDocumentalService Servicio del modulo Gestion Documental
   * @param _translateService Servicio de traducciones
   * @param _utilService variable con métodos globales
   */
  constructor(
    private _actions$: Actions,
    private _gestionDocumentalService: GestionDocumentalService,
    private _translateService: TranslateService,
    private _utilService: UtilsService,
  ) { }
  /**
   * Efecto encargado de cargar los procesos
   */
  loadProcesos$: Observable<Action> = createEffect((): any =>
    this._actions$.pipe(
      ofType(ProcesoActions.LoadProcesos),
      mergeMap(() =>
        this._gestionDocumentalService.obtenerProcesos().pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utilService.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return ProcesoActions.LoadProcesosSuccess({
              payload: res,
            });
          }),
          catchError((err) => {
            this._utilService.procesarMessageWebApi(err.error, ETiposError.error);
            return of(
              ProcesoActions.LoadProcesosError({
                payload: err,
              })
            );
          })
        )
      )
    )
  );
  /**
  * Efecto encargado de llamar servicio al agregar un proceso
  */
  addProceso$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(ProcesoActions.AddProceso),
      mergeMap(({ proceso }) => this._gestionDocumentalService.crearProceso(proceso)
        .pipe(
          map((res: ResponseWebApi) => {
            if (res.status) {
              let mensaje = this._translateService.instant(
                "TITULOS.REGISTRO_CREADO_EXITO"
              );
              this._utilService.procesarMessageWebApi(mensaje, "Correcto");

              return ProcesoActions.AddProcesoSuccess({ payload: { ...res } })
            } else {
              let mensaje = this._translateService.instant(
                "TITULOS.REGISTRO_CREADO_ERROR"
              );
              this._utilService.procesarMessageWebApi(mensaje, "Error");
              return ProcesoActions.AddProcesoError({ payload: res.message })
            }
          }),
          catchError(err => of(ProcesoActions.AddProcesoError({ payload: err })))
        )
      )
    )
  );
  /**
  * Efecto encargado de llamar servicio de actualizar un proceso
  */
  updateProceso$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(ProcesoActions.UpdateProceso),
      mergeMap(({ proceso }) => this._gestionDocumentalService.actualizarProceso(proceso)
        .pipe(
          map((res: ResponseWebApi) => {
            if (res.status) {
              let mensaje = this._translateService.instant(
                "TITULOS.REGISTRO_ACTUALIZADO_EXITO"
              );
              this._utilService.procesarMessageWebApi(mensaje, "Correcto");

              return ProcesoActions.UpdateProcesoSuccess({ payload: { ...res } })
            } else {
              let mensaje = this._translateService.instant(
                "TITULOS.REGISTRO_ACTUALIZADO_ERROR"
              );
              this._utilService.procesarMessageWebApi(mensaje, "Error");
              return ProcesoActions.UpdateProcesoError({ payload: res.message })
            }
          }),
          catchError(err => of(ProcesoActions.UpdateProcesoError({ payload: err })))
        )
      )
    )
  );
  /**
  * Efecto encargado de llamar servicio de actualizar el estado de un proceso
  */
  updateEstadoProceso$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(ProcesoActions.UpdateEstadoProceso),
      mergeMap(({ proceso }) => this._gestionDocumentalService.actualizarEstadoProceso(proceso)
        .pipe(
          map((res: ResponseWebApi) => {
            if (res.status) {
              let mensaje = this._translateService.instant(
                "TITULOS.REGISTRO_ACTUALIZADO_EXITO"
              );
              this._utilService.procesarMessageWebApi(mensaje, "Correcto");

              return ProcesoActions.UpdateProcesoSuccess({ payload: { ...res } })
            } else {
              let mensaje = this._translateService.instant(
                "TITULOS.REGISTRO_ACTUALIZADO_ERROR"
              );
              this._utilService.procesarMessageWebApi(mensaje, "Error");
              return ProcesoActions.UpdateProcesoError({ payload: res.message })
            }
          }),
          catchError(err => of(ProcesoActions.UpdateProcesoError({ payload: err })))
        )
      )
    )
  );
}
