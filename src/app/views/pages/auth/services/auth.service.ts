import { Injectable } from '@angular/core';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { ObjLoginUser } from '@shared/models/objLoginUser.model';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  /**
   * Metodo constructo encargado de contruir los servicios de autenticaicon
   * @param _httpBase inyeccion de servicio http base
   * para acceder a todos los metodos bases.
   */
  constructor(private _httpBase: HttpBaseService) { }

  /**
   * Metodo para ingresar a la aplicacion
   * @param login objeto que contiene informacion indispensable para el inicio de sesión
   * @returns observable de respuesta de la peticion
   */
  public login(login: ObjLoginUser): Observable<ResponseWebApi> {
    return this._httpBase.postMethod('usuario/login', login, [], false);
  }

}
