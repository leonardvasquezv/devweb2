import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListarGeoreferenciacionService {
  /**
   * Constructor servicio de listar georeferenciacion
   * @param _httpService accede a las configuraciones y metodos del servicio
   */
  constructor(
    private _httpService: HttpBaseService
  ) { }
  /**
   * Método que retorna data necesaria para la georeferenciacion de las EDS
   * @returns Array con data de EDS 
   */
  public obtenerGeoInfoEDS(criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpService.getMethod('eds-mapa', criterios, false)
  }

  
  /**
   * Método para traer los departamentos
   * @returns Array de departamentos
   */
  public obtenerDepartamentos(): Observable<ResponseWebApi> {
    return this._httpService.getMethod('departamentos',null, false);
  }
  /**
   * 
   * @param criterios Criterios para escoger los municipios
   * @returns Respuesta API con los municipios
   */
  public obtenerMunicipios(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpService.getMethod('municipios',criterios, false);
  }
}
