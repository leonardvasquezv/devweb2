import { Injectable } from '@angular/core';
import { EPermisosEnum } from '@core/enum/permisos.enum';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Empresa } from '@core/interfaces/seguridad/empresa.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable()
export class EmpresaService {

  /**
   * Constructor de los servicios de modulo
   * @param _httpBase obtiene los servicios de modulos
   */
  constructor(private _httpBase: HttpBaseService) { }

  /**
   * Metodo para guardar un empresa
   * @param empresa a crear
   * @returns objeto con información del empresa creado
   */
  public crearEmpresa(empresa: Empresa): Observable<ResponseWebApi> {
    return this._httpBase.postMethod('empresa', empresa, [], false, false, EPermisosEnum.crear);
  }

  /**
   * Metodo para editar un empresa en base un Id en especifico
   * @param empresa a editar
   * @returns objeto con información del empresa actualizado
   */
  public editarEmpresa(empresa: any): Observable<ResponseWebApi> {
    return this._httpBase.putMethod('empresa', empresa, [], false, EPermisosEnum.editar);
  }

  /**
   * Metodo para consumir un empresa por id
   * @param id de la empresa
   * @returns objeto con información del empresa del id consultado
   */
  public obtenerEmpresaPorId(id: number): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`empresa/${id}`, [], false, EPermisosEnum.leer);
  }

  /**
   * Metodo para consumir el historial de cambio de un empresa por id
   * @param id de la empresa
   * @returns objeto con información del empresa del id consultado
   */
  public obtenerEmpresaPorIdHistorial(id: number): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`empresa/historial/${id}`, [], false, EPermisosEnum.leer);
  }

  /**
   * Metodo para activar un empresa
   * @param empresa a activar
   * @returns Observable con la respuesta de la peticion
   */
  public activarEmpresa(empresa: Empresa): Observable<ResponseWebApi> {
    return this._httpBase.putMethod(`empresa/${empresa.id}/activar`, empresa, [], false, EPermisosEnum.activar);
  }

  /**
   * Metodo para inactivar un empresa
   * @param empresa a inactivar
   * @returns Observable con la respuesta de la peticion
   */
  public inactivarEmpresa(empresa: Empresa): Observable<ResponseWebApi> {
    return this._httpBase.putMethod(`empresa/${empresa.id}/inactivar`, empresa, [], false, EPermisosEnum.inactivar);
  }

  /**
   * Metodo para obtener los empresaes por grupo
   * @param criterios de busqueda
   * @returns Observable con la respuesta de la peticion
   */
  public obtenerEmpresas(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('empresas', criterios, false, EPermisosEnum.leer);
  }

  /**
   * Metodo usado para validar el codigo SICOM
   * @param codigo Codigo a validar
   * @param id Id a validar
   * @returns Observable con respuesta de la petición
   */
  public validarCodigoSicom(codigo: string, id: number): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`empresas/validarCodigo/${codigo}/${id}`, [], false, EPermisosEnum.leer);
  }

  /**
  * Metodo para consumir un perfil por id
  * @param id Identificador del perfil a consultar
  * @returns objeto con información del perfil del id consultado
  */
  public obtenerPerfilPorId(id: number): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`perfil/${id}`, [], false);
  }

  /**
  * Metodo para consumir perfiles por criterios
  * @param criterios como filtro de busqueda
  * @returns objeto con información del perfil del id consultado
  */
  public obtenerPerfilPorCriterios(criterios: Array<ObjParam> = []): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`perfiles`, criterios, false);
  }

  /**
  * Metodo para consumir paginas por criterios
  * @param criterios como filtro de busqueda
  * @returns objeto con información de las paginas
  */
  public obtenerMenuPaginasPorCriterios(criterios: Array<ObjParam> = []): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('paginas/menuPaginas', criterios, false);
  }

  /**
  * Metodo para consumir permisos por criterios
  * @param criterios como filtro de busqueda
  * @returns objeto con información de las permisos
  */
  public obtenerPermisosPorCriterios(criterios: Array<ObjParam> = []): Observable<ResponseWebApi> {
    return this._httpBase.getMethod('permisos', criterios, false);
  }

}
