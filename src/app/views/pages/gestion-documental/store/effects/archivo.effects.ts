import { Injectable } from '@angular/core';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GestionDocumentalService } from '../../gestion-documental.service';
import * as ArchivoActions from '../actions/archivo.actions';

@Injectable()
export class ArchivoEffects {
  /**
   * Define el metodo constructor de los efectos
   * @param _actions$ define las acciones del estado
   * @param _gestionDocumentalService Variable que permite acceder al servicio de Gestión Documental
   * @param _translateService Servicio de traducciones
   * @param _utilService Variable que permite acceder al servicio de Utils
   */
  constructor(
    private _actions$: Actions,
    private _gestionDocumentalService: GestionDocumentalService,
    private _translateService: TranslateService,
    private _utilService: UtilsService,
  ) { }
  /**
   * Efecto encargado de cargar los Archivos
   */
  loadArchivos$: Observable<Action> = createEffect((): any =>
    this._actions$.pipe(
      ofType(ArchivoActions.LoadArchivos),
      mergeMap(({ criterios }) =>
        this._gestionDocumentalService.obtenerArchivos(criterios).pipe(
          map((res: ResponseWebApi) => {
            if (!res.status) {
              this._utilService.procesarMessageWebApi(res.message, ETiposError.error);
            }
            return ArchivoActions.LoadArchivosSuccess({
              payload: res,
            });
          }),
          catchError((err) => {
            this._utilService.procesarMessageWebApi(err.error, ETiposError.error);
            return of(
              ArchivoActions.LoadArchivosError({
                payload: err,
              })
            );
          })
        )
      )
    )
  );


  /**
   * Efecto encargado de editar Un archivo
   */
  updateArchivo$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(ArchivoActions.updateArchivo),
      mergeMap(({ archivo }) => this._gestionDocumentalService.editarArchivo(archivo)
        .pipe(map((res: ResponseWebApi) => {
          const errorType = res.status ? ETiposError.correcto : ETiposError.error;
          this._utilService.procesarMessageWebApi(res.message, errorType);
          return ArchivoActions.updateArchivoSuccess({ payload: { ...res } })
        }),
        catchError(err => {
          this._utilService.procesarMessageWebApi(err.error, ETiposError.error);
          return of(ArchivoActions.updateArchivoError({ payload: err }))
        })
        )
      )
    )
  );

}
