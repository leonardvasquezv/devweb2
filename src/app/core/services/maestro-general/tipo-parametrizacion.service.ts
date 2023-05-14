import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Observable, of } from 'rxjs';
import { HttpBaseService } from '../base/http-base.service';

@Injectable({
  providedIn: 'root',
})
export class TipoParametrizacionService {

  /**
   * Metodo donde se inyectan las dependencias
   * @param _httpService accede a las configuraciones y metodos del servicio
   */
  constructor(private _httpService: HttpBaseService) { }

  /**
   * Metodo para obtener las parametrizacion
   * @param criterios array con los filtros de la parametrizacion
   * @return Array con la respuesta
   */
  public obtenerParametrizaciones(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpService.getMethod('tipos', criterios, false)
  }

  /**
   * Metodo para obtener los tipos de parametrizacion
   * @param criterios array con los filtros de la parametrizacion
   * @return Array con la respuesta
   */
  public obtenerTiposParametrizaciones(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpService.getMethod('tiposDetalle', criterios, false)
  }
}
