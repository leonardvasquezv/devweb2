import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable()
export class UbicacionService {
  /**
   * Constructor de los servicios de ubicacion
   * @param _httpBaseService inyeccion servicio http base
   */
  constructor(private _httpBaseService: HttpBaseService) { }

  /**
   * Metodo para consumir departamentos
   * @param Critarios los parametros requeridos para traer el Listado de Departamentos
   * @returns Observable de tipo ResponseWebApi
   */
  public obtenerDepartamentos(Criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    if (!Criterios) Criterios = [{ campo: 'IdPais', valor: 1 }, { campo: 'EstadoRegistro', valor: 'A' }]
    return this._httpBaseService.getMethod('departamentos', Criterios, false)
  }

  /**
   * Metodo para consumir municipios
   * @param Criterios los parametros requeridos para traer el Listado de Municipios
   * @returns Observable de tipo ResponseWebApi
   */
  public obtenerMunicipios(Criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('municipios', Criterios || [], false)
  }

  /**
   * Metodo para consumir paises
   * @param Criterios los parametros requeridos para traer el Listado de Municipios
   * @returns Observable de tipo ResponseWebApi
   */
  public obtenerPaises(Criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('paises', Criterios || [], false)
  }

  /**
  * Metodo para consumir departamentos por un pais especifico
  * @param idPais del pais
  * @returns Observable de tipo ResponseWebApi
  */
  public obtenerDepartamentosPorPais(idPais: number): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod(`departamentos/${idPais}`, [], false)
  }

  /**
 * Metodo para consumir municipiod por un departamento especifico
 * @param idDepartamento del departamento
 * @returns Observable de tipo ResponseWebApi
 */
  public obtenerMunicipiosPorDepartamento(idDepartamento: number): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod(`municipios/${idDepartamento}`, [], false)
  }

}
