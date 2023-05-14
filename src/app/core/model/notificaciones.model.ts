import { Injectable } from "@angular/core";
import { Notificacion } from "@core/interfaces/base/notificacion.interface";
import { ObjParam } from "@core/interfaces/base/objParam.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { NotificacionesService } from "@core/services/notificaciones.service";
import { AppState } from "@core/store/app.interface";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as notificacionAction from '../store/actions/notificacion.action';
import * as edsSelectors from '../store/selectors/eds.selectors';
import * as notificacionSelectors from '../store/selectors/notificacion.selectors';

@Injectable()
export class NotificacionModel {
  /**
   * Método para inyectar dependencias
   * @param notificacionesService Servicio de notificaciones
   * @param _store Store de la aplicacion
   */
  constructor(
    private notificacionesService: NotificacionesService,
    private _store: Store<AppState>
  ) { }
  /**
   * Método para obtener las Eds
   */
  public entities$: Observable<any> = this._store.select(edsSelectors.getAllEds);

  /**
   * Metodo encargado de accionar el store para obtener los Metadatos de la entidad Eds
   */
  public metadata$: Observable<any> = this._store.select(edsSelectors.getMetadataEds);
  /**
   * Metodo encargado de accionar el store para obtener una entidad Eds
   */
  public edsSeleccionada$: Observable<any> = this._store.select(edsSelectors.getEdsSeleccionada);
  /**
   * Metodo encargado de accionar el store para obtener una notificacion
   */
  public notificacionSeleccionada$: Observable<any> = this._store.select(notificacionSelectors.getNotificacionSeleccionada);

  /**
   * Método para ejecutar la accion de selecionar eds
   * @param notificacion objeto eds a actualizar
   */
  public seleccionarNotificacion(notificacion: Notificacion): void {
    this._store.dispatch(notificacionAction.SeleccionarNotificacion({ notificacion }));
  }
  /**
   * Método para obtener las notificaciones
   * @param criterios Array de Criterios
   * @returns Observable con la respuesta
   */
  public obtenerNotificacionesPorCriterios(criterios: Array<ObjParam> = []): Observable<ResponseWebApi> {
    return this.notificacionesService.obtenerNotificaciones(criterios)
  }

  /**
   * Metodo para cambiar el estado de una notificacion
   * @param notificacion objeto a modificar
   * @returns Observable con la respuesta
   */
  public cambiarEstadoNotificacion(notificacion: Notificacion): Observable<ResponseWebApi> {
    return this.notificacionesService.cambioEstadoNotificacion(notificacion);
  }

  /**
   * Metodo para limpiar la notificaciones
   */
  public cleanNotificacionSeleccionada(): void {
    this._store.dispatch(notificacionAction.CleanSeleccionNotificacion());
  }
}
