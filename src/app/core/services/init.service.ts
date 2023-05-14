import { Injectable } from '@angular/core';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable()
export class InitService {

  /**
   * Constructor de los servicios de empresa
   * @param _httpBase accede a las configuraciones y metodos del servicio
   * base de consumo http
   */
  constructor(private _httpBase: HttpBaseService) { }

  /**
   * Metodo para obtener los menus del usuario logueado
   * @returns observable con la respuesta de la peticion
   */
  public obtenerMenuperfil(): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('usuario/menusPerfil', [], false);
  }

  /**
   * Metodo para obtener la informacion del usuario autenticado
   * @returns observable con la respuesta de la peticion
   */
  public obtenerUserIdentity(): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('usuario/userIdentity', [], false);
  }

}
