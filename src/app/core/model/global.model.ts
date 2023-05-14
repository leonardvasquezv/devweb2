import { Injectable } from '@angular/core';
import { Breadcrumb } from '@core/interfaces/base/breadcrumb.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { UbicacionService } from '@core/services/ubicacion.service';
import { AppState } from '@core/store/app.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as globalActions from '../store/actions/global.action';
import * as globalSelectors from '../store/selectors/global.selectors';
import { getBreadcrumb } from '../store/selectors/global.selectors';

@Injectable()
export class GlobalModel {
  /**
   * Metodo encargado de accionar el store para obtener El listado de Departamento
   */
  public departamentosEntities$: Observable<any> = this._store.select(globalSelectors.getDepartamentos);

  /**
   * Metodo encargado de accionar el store para obtener El listado de Municipio
   */
  public municipiosEntities$: Observable<any> = this._store.select(globalSelectors.getMunicipios);

  /**
   * Propiedad que observa los cambios del breadcrumb
   */
  public breadcrumb$: Observable<Breadcrumb> = this._store.select(getBreadcrumb);


  /**
   * Metodo constructor para obtener metodos generales del servicio
   * @param _store servicio de metodos generales de la aplicacion
   */
  constructor(
    private _store: Store<AppState>,
    private _ubicacionService: UbicacionService
  ) { }

  /**
   * Metodo encargado de accionar el store para obtener todos los
   * datos iniciales usados en el sistema
   */
  public obtenerGlobals(): void {
    this._store.dispatch(globalActions.loadGlobals());
  }

  /**
   * Metodo para consumir departamentos
   * @param Critarios los parametros requeridos para traer el Listado de Departamentos
   * @returns Observable de tipo ResponseWebApi
   */
  public obtenerDepartamentos(Criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._ubicacionService.obtenerDepartamentos(Criterios);
  }

  /**
   * Metodo para consumir municipios
   * @param Criterios los parametros requeridos para traer el Listado de Municipios
   * @returns Observable de tipo ResponseWebApi
   */
  public obtenerMunicipios(Criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._ubicacionService.obtenerMunicipios(Criterios);
  }

  /**
   * Metodo para consumir paises
   * @param Criterios los parametros requeridos para traer el Listado de Municipios
   * @returns Observable de tipo ResponseWebApi
   */
  public obtenerPaises(Criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._ubicacionService.obtenerPaises(Criterios);
  }

  /**
 * Metodo para consumir los departmentos por un pais
 * @param idPais del pais
 * @returns Observable de tipo ResponseWebApi
 */
  public obtenerDepartamentosPorPais(idPais: number): Observable<ResponseWebApi> {
    return this._ubicacionService.obtenerDepartamentosPorPais(idPais);
  }

  /**
    * Metodo para consumir los municipios por departamento
    * @param idDepartamento del departamento
    * @returns Observable de tipo ResponseWebApi
    */
  public obtenerMunicipiosPorDepartamento(idDepartamento: number): Observable<ResponseWebApi> {
    return this._ubicacionService.obtenerMunicipiosPorDepartamento(idDepartamento);
  }

  /**
   * Metodo para asignar el breadcrumb general
   * @param breadcrumb Variable que contiene el breacrumb a asignar
   */
  public setBreadcrumb(breadcrumb: Breadcrumb): void{
    this._store.dispatch(globalActions.setBreadCrumb({breadcrumb}));
  }

}
