import { Injectable } from '@angular/core';
import { AppState } from '@core/store/app.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { ParametrizacionService } from '@core/services/maestro-general/parametrizacion.service';
import { getAllParametrizaciones, getMetadataParametrizaciones, getSelectedParametrizacion } from '@core/store/selectors/parametrizacion.selectors';
import * as parametrizacionActions from '../store/actions/parametrizacion.action';

@Injectable()
export class ParametrizacionModel {
  /**
   * Metodo encargado de accionar el store para obtener los tipos de parametrización
   */
  public parametrizaciones$: Observable<any> = this._store.select(getAllParametrizaciones);

  /**
   * Define el observable de la metadata de las parametrizaciones
   */
  public metadata$: Observable<any> = this._store.select(getMetadataParametrizaciones);

  /**
   * Define el observable de parametrizacion
   */
   public parametrizacion$: Observable<any> = this._store.select(getSelectedParametrizacion);

  /**
   * Metodo donde se inyectan las dependencias
   * @param _store Accede a los métodos y configuraciones del store
   * @param _parametrizacionService inyeccion servicio parametrizacion
   */
  constructor(
    private _store: Store<AppState>,
    private _parametrizacionService: ParametrizacionService
  ) { }

  /**
   * Metodo encagado de accionar el store para obtener una parametrizacion por un id especifico
   * @param idTipoDetalle seleccionado
   */
   public selected(idTipoDetalle: number): void {
    this._store.dispatch(parametrizacionActions.loadParametrizacion({ idTipoDetalle }));
  }

  /**
   * Metodo encargado de guardar una parametrizacion
   * @param payload objeto a guardar
   * @return objeto con la respuesta
   */
  public crearParametrizacion(payload: TipoDetalle): Observable<ResponseWebApi> {
    return this._parametrizacionService.crearParametrizacion(payload);
  }

  /**
   * Metodo encargado de obtener la lista de las parametrizaciones
   * @param criterios array con filtros
   */
  public obtenerListaParametrizaciones(criterios: Array<ObjParam>): void {
    this._store.dispatch(parametrizacionActions.loadParametrizaciones({ criterios }));
  }

  /**
   * Metodo encargado de editar el objeto enviado
   * @param tipoDetalle objeto a editar
   */
  public editarParametrizacion(tipoDetalle: TipoDetalle): void {
    this._store.dispatch(parametrizacionActions.updateParametrizacion({ tipoDetalle }));
  }

  /**
   * Metodo encargado de cambiar el estado de un objeto enviado
   * @param tipoDetalle objeto a editar
   */
  public cambioEstadoParametrizacion(tipoDetalle: TipoDetalle): void {
    this._store.dispatch(parametrizacionActions.cambioEstadoParametrizacion({ tipoDetalle }));
  }

  /**
   * Metodo encagado de accionar el store para obtener una parametrizacion por un id especifico
   * @param idTipoDetalle seleccionado
   */
   public obtenerParametrizacionesPorCriterios(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._parametrizacionService.obtenerListaParametrizacion(criterios);
  }

}
