import { Injectable } from '@angular/core';
import { CrearEds } from '@core/interfaces/crear-eds.interface';
import { AppState } from '@core/store/app.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { CrearEdsService } from '@core/services/crear-eds.service';
import * as CrearEdsActions from '../store/actions/crear-eds.actions';
import { getInfoCrearEds } from '../store/selectors/crear-eds.selectors';


@Injectable()
export class CrearEdsModel {
  /**
   * Metodo encargado de accionar el store para obtener los consolidados de ventas
   */
  public infoCrearEds$: Observable<any> = this._store.select(getInfoCrearEds);

  /**
   * Metodo constructor del modelo de la creacion de una eds, encargado de inyectar dependencias
   * @param _store accede a los metodos y configuraciones del store
   */
  constructor(
    private _store: Store<AppState>,
    private _crearEdsService: CrearEdsService
  ) { }

  /**
   * Metodo encagado de accionar el store para obtener la informacion de la eds a crear
   * @param idEds informacion de la eds a crear
   */
  public obtenerEds(idEds: number): void {
    this._store.dispatch(CrearEdsActions.AddInfoCrearEds({ idEds }));
  }

  /**
   * Metodo encagado de obtener la informacion de la eds por su id
   * @param idEds informacion de la eds 
   */
  public obtenerEdsPorId(idEds: number): Observable<ResponseWebApi> {
    return this._crearEdsService.obtenerIdEds(idEds);
  }
  /**
   * Metodo encagado de accionar el store para editar la informacion de la eds a crear
   * @param infoEds informacion de la eds a crear
   */
  public updateInfoCrearEds(infoEds: CrearEds): void {
    this._store.dispatch(
      CrearEdsActions.UpdateInfoCrearEdsSuccess({ infoEds })
    );
  }
  /**
   * Metodo encargado de limpiar en el store los estados de  la informacion de la eds a crear
   */
  public cleanCrearEdsList(): void {
    this._store.dispatch(CrearEdsActions.cleanCrearEdsList());
  }

  /**
* Metodo para validar la existencia de la nomenclatura
* @param criterios array de los filtros a validar
* @returns objeto con la respuesta
*/
  public ExisteCodigoSicom(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._crearEdsService.ExisteCodigoSicom(criterios);
  }

  /**
      * Metodo encargado de accionar el store para obtener los tipos de parametrizaciones
      * @param criterios filtro
      * @returns array con la respuesta
      */
  public obtenerMayoristas(criterios: Array<ObjParam> = null): Observable<ResponseWebApi> {
    return this._crearEdsService.obtenerMayoristas(criterios)
  }

}