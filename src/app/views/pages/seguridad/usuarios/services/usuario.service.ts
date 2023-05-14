import { Injectable } from '@angular/core';
import { EPermisosEnum } from '@core/enum/permisos.enum';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Usuario } from '@core/interfaces/seguridad/usuario.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable()
export class UsuarioService {

  /**
   * Constructor de los servicios de usuario
   * @param _httpBase accede a las configuraciones y metodos del servicio
   * base de consumo http
   */
  constructor(private _httpBase: HttpBaseService) { }

  /**
   * Metodo para obtener todos los usuarios
   * @returns observable con la respuesta de la peticion
   */
  public obtenerUsuarios(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('usuarios', criterios);
  }

  /**
   * Metodo para guardar un usuario
   * @returns observable con la respuesta de la peticion
   */
  public crearUsuario(usuario: Usuario): Observable<ResponseWebApi> {
    return this._httpBase.postMethod('usuario', usuario, [], false);
    //return of(crearUsuarioResponse);
  }

  /**
   * Metodo para editar un usuario en base un Id en especifico
   * @returns observable con la respuesta de la peticion
   */
  public editarUsuario(usuario: Usuario): Observable<ResponseWebApi> {
    return this._httpBase.putMethod('usuario', usuario, [], false);
    //return of(editarUsuarioResponse);
  }

  /**
   * Metodo para consumir usuarios
   * @returns observable con la respuesta de la peticion
   */
  public obtenerUsuarioPorId(id: number): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`usuario/${id}`, [], false);
    //return of(usuarioIdResponse);
  }

  /**
   * Metodo para activar un usuario
   * @returns observable con la respuesta de la peticion
   */
  public ActivarUsuario(usuario: Usuario): Observable<ResponseWebApi> {
    return this._httpBase.putMethod(`usuario/${usuario.id}/activar`, usuario, [], false, EPermisosEnum.activar);
    //return of(activeStateResponse);
  }

  /**
   * Metodo para inactivar un usuario
   * @returns observable con la respuesta de la peticion
   */
  public InactivarUsuario(usuario: Usuario): Observable<ResponseWebApi> {
    return this._httpBase.putMethod(`usuario/${usuario.id}/inactivar`, usuario, [], false, EPermisosEnum.inactivar);
    //return of(inactiveStateResponse);
  }
  /**
   * Método para validar si existe usaurios a traves de campos 
   * @param campoAValidar Tipo de validación que se requiere hacer 
   * @param criterios campos que se envian para validar 
   * @returns observable con la respuesta de la peticion
   */
  public validarCamposUsuario(campoAValidar:string,criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`usuario/${campoAValidar}/validar`, criterios, false)
  }


}
