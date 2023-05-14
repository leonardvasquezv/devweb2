import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ETiposError } from "@core/enum/tipo-error.enum";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { UtilsService } from "@shared/services/utils.service";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { GestionDocumentalService } from '../../gestion-documental.service';
import * as DocumentoActions from '../actions/documento.actions';

@Injectable()
export class DocumentoEffects {
  /**
   * Define el metodo constructor de los efectos
   * @param _actions$ define las acciones del estado
   * @param _gestionDocumentalService Servicio del modulo Gestion Documental
   * @param _utilService variable con métodos globales
   * @param _translateService Servicio de traducciones
   * @param _router Servicio para navegar entre paginas
   */
  constructor(
    private _actions$: Actions,
    private _gestionDocumentalService: GestionDocumentalService,
    private _utilService: UtilsService,
    private _translateService: TranslateService,
    private _router: Router
  ) { }
  /**
   * Efecto encargado de cargar los Documentos
   */
  loadDocumentos$: Observable<Action> = createEffect((): any =>
    this._actions$.pipe(
      ofType(DocumentoActions.LoadDocumentos),
      mergeMap(({ criterios }) =>
        this._gestionDocumentalService.obtenerDocumentos(criterios)
          .pipe(
            map((res: ResponseWebApi) => {
              if (!res.status) {
                this._utilService.procesarMessageWebApi(
                  res.message,
                  ETiposError.error
                );
              }
              return DocumentoActions.LoadDocumentosSuccess(
                {
                  payload: res,
                }
              );
            }),
            catchError((err) => {
              this._utilService.procesarMessageWebApi(err.error, ETiposError.error);
              return of(
                DocumentoActions.LoadDocumentosError(
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
   * Efecto encargado de crear documento
   */
  createDocumentos$: Observable<Action> = createEffect((): any =>
    this._actions$.pipe(ofType(DocumentoActions.createDocumentos),
      mergeMap(({ documentos }) => this._gestionDocumentalService.crearDocumentos(documentos)
        .pipe(map((res: ResponseWebApi) => {
          if (!res.status) {
            this._utilService.procesarMessageWebApi(res.message, ETiposError.correcto);
            this._router.navigateByUrl('home/gestion-documental');
          }
          return DocumentoActions.createDocumentosSuccess({ payload: res.data });
        }),
          catchError((err) => {
            this._utilService.procesarMessageWebApi(err.error, ETiposError.error);
            return of(DocumentoActions.createDocumentosError({ payload: err }));
          })
        )
      )
    )
  );

  /**
  * Efecto encargado  de actualizar un documento  en backend
  */
  updateDocumento$: Observable<Action> = createEffect(
    (): any => this._actions$.pipe(
      ofType(DocumentoActions.UpdateDocumento),
      mergeMap(({ documento }) => this._gestionDocumentalService.actualizarDocumento(documento)
        .pipe(
          map((res: ResponseWebApi) => {
            if (res.status) {
              let mensaje = this._translateService.instant(
                "TITULOS.REGISTRO_ACTUALIZADO_EXITO"
              );
              this._utilService.procesarMessageWebApi(mensaje, "Correcto");

              return DocumentoActions.UpdateDocumentoSuccess({ payload: { ...res } })
            } else {
              let mensaje = this._translateService.instant(
                "TITULOS.REGISTRO_ACTUALIZADO_ERROR"
              );
              this._utilService.procesarMessageWebApi(mensaje, "Error");
              return DocumentoActions.UpdateDocumentoError({ payload: res.message })
            }
          }),
          catchError(err => of(DocumentoActions.UpdateDocumentoError({ payload: err })))
        )
      )
    )
  );
}
