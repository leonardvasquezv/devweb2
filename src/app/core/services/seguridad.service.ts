import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class SeguridadService {

  /**
   * Constructor de los servicios de modulo
   * @param _httpBase obtiene los servicios de modulos
   */
  constructor(private _httpBase: HttpBaseService) { }

  /**
   * Metodo para cerrar sesion
   * @returns observable de respuesta de la peticion
   */
  public logout(): Observable<ResponseWebApi> {
    return this._httpBase.postMethod('usuario/logout', {}, [], false, true);
    //return of(logoutRespose);
  }

  /**
   * Metodo utilizado para generar un codigo de verificacion
   * @param body objeto con los valores del username y tipo
   * @returns observable de respuesta de la peticion
   */
  public generarCodigo(body: any): Observable<ResponseWebApi> {
    return this._httpBase.postMethod('codigo/generar', body, [], false);
    //return of(generarCodigoResponse);
  }

  /**
   * Metodo utilizado para generar un codigo de verificacion
   * @param body objeto con los valores del username y tipo
   * @returns observable de respuesta de la peticion
   */
  public validarCodigo(body: any): Observable<ResponseWebApi> {
    return this._httpBase.postMethod('codigo/validar', body, [], false);
    //return of(validarCodigoResponse);
  }

  /**
   * Metodo para actualizar la contraseña
   * @returns observable de respuesta de la peticion
   */
  public actualizarPassword(body: any): Observable<ResponseWebApi> {
    return this._httpBase.putMethod('usuarios/password', body, [], false);
  }

  /**
   * Metodo para actualizar la contraseña
   * @returns observable de respuesta de la peticion
   */
  public actualizarPasswordUser(body: any): Observable<ResponseWebApi> {
    return this._httpBase.putMethod('usuarios/caafi/password', body, [], false);
  }

  /**
   * Metodo utilizado para generar un codigo de verificacion
   * @param body objeto con los valores del username y tipo
   * @returns observable de respuesta de la peticion
   */
  public reestablecerContrasena(body: any): Observable<ResponseWebApi> {
    return this._httpBase.postMethod(`usuarios/password`, body, [], false);
    //return of(reestablecerResponse);
  }

  /**
   * Metodo para obtener todos los clientes
   * @returns lista de todos los clientes
   */
  public obtenerClientes(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('clientes', criterios, false);
  }

  /**
   * Metodo para obtener todos los empresas
   * @returns lista de todos los empresas
   */
  public obtenerEmpresas(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('empresas', criterios, false);
  }

  /**
 * Método encargado de obtener perfiles por criterios
 * @param criterios de filtro
 */
  public obtenerPerfiles(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('perfiles', criterios, false);
  }

  /**
  * Método encargado de obtener eds por criterios
  * @param criterios de filtro
  */
  public obtenerAllEds(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('listadoEds', criterios, false);
  }

  /**
   * Metodo para obtener todos las paginas
   * @returns observable con la respuesta de la peticion
   */
  public obtenerUsuarios(usuarios: Array<ObjParam>): Observable<any> {
    return this._httpBase.getMethod('usuarios', usuarios, false);
  }

}



