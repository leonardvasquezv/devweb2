import { Injectable } from '@angular/core';
import { EPermisosEnum } from '@core/enum/permisos.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable()
export class PerfilService {

  /**
   * Constructor de los servicios de modulo
   * @param _httpBase obtiene los servicios de modulos
   */
  constructor(private _httpBase: HttpBaseService) { }

  /**
   * Metodo para guardar un perfil
   * @returns objeto con información del perfil creado
   */
  public crearPerfil(perfil: Perfil): Observable<ResponseWebApi> {
    return this._httpBase.postMethod('perfil', perfil, [], false);
  }

  /**
   * Metodo para editar un perfil en base un Id en especifico
   * @returns objeto con información del perfil actualizado
   */
  public editarPerfil(perfil: any): Observable<ResponseWebApi> {
    return this._httpBase.putMethod('perfil', perfil, [], false);
  }

  /**
   * Metodo para consumir un perfil por id
   * @returns objeto con información del perfil del id consultado
   */
  public obtenerPerfilPorId(id: number): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`perfil/${id}`, [], false);
  }

  /**
   * Metodo para consumir el historial de cambio de un perfil por id
   * @returns objeto con información del perfil del id consultado
   */
  public obtenerPerfilPorIdHistorial(id: number): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`perfil/historial/${id}`, [], false);
  }

  /**
   * Metodo para activar un perfil
   * @returns Observable con la respuesta de la peticion
   */
  public activarPerfil(perfil: Perfil): Observable<ResponseWebApi> {
    return this._httpBase.putMethod(`perfil/${perfil.id}/activar`, perfil, [], false, EPermisosEnum.activar);
  }

  /**
   * Metodo para inactivar un perfil
   * @returns Observable con la respuesta de la peticion
   */
  public inactivarPerfil(perfil: Perfil): Observable<ResponseWebApi> {
    return this._httpBase.putMethod(`perfil/${perfil.id}/inactivar`, perfil, [], false, EPermisosEnum.inactivar);
  }

  /**
   * Metodo para obtener los perfiles por grupo
   * @returns Observable con la respuesta de la peticion
   */
  public obtenerPerfilesPorGrupo(): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('perfilesPorGrupos', [], false);
  }

  /**
   * Metodo para obtener losmenu de las paginas
   * @returns Observable con la respuesta de la peticion
   */
  public obtenerMenuPaginas(): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('paginas/menuPaginas', [], false);
  }

}
