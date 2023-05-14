import { Injectable } from '@angular/core';
import { EEstadoRegistro } from '@core/enum/estadoRegistro.enum';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Empresa } from '@core/interfaces/seguridad/empresa.interface';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { AppState } from '@core/store/app.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EmpresaService } from '../services/empresa.service';
import * as empresaActions from '../store/actions/empresa.actions';
import { getAllEmpresas, getEmpresaTieneEdsAsociada, getPermisos, getSelectedEmpresa } from '../store/selectors/empresa.selectors';
import { getEstadoFormularioPerfil, getMetadataEmpresas, getPaginas } from './../store/selectors/empresa.selectors';

@Injectable()
export class EmpresaModel {


  /**
   * Define el observable de los empresas consumidos
   */
  public empresas$: Observable<any> = this._store.select(getAllEmpresas);

  /**
  * Define el observable de los paginas consumidos
  */
  public paginas$: Observable<any> = this._store.select(getPaginas);

  /**
  * Define el observable de los permisos consumidos
  */
  public permisos$: Observable<any> = this._store.select(getPermisos);

  /**
   * Define el observable del empresa seleccionado
   */
  public empresa$: Observable<any> = this._store.select(getSelectedEmpresa);

  /**
   * Define el observable de la metadata de los empresas
   */
  public metadata$: Observable<any> = this._store.select(getMetadataEmpresas);

  /**
   * Define el observable para verificar si la empresa tiene Eds Asociada
   */
  public empresaTieneEdsAsociada$: Observable<any> = this._store.select(getEmpresaTieneEdsAsociada);

  /**
   * Define el observable para verificar si el formulario de usuario se encuentra en modo de edicion
   */
  public formularioPerfilEditado$: Observable<boolean> = this._store.select(getEstadoFormularioPerfil);

  /**
   * Metodo constructor del modelo de empresa, encargado de inyectar dependencias
   * @param _store accede a los metodos y configuraciones del store
   * @param _empresaService Servicio de empresas
   */
  constructor(
    private _store: Store<AppState>,
    private _empresaService: EmpresaService) { }

  /**
   * Get para obtener un perfil por default
   * @returns un perfil por defecto
   */
  get perfilDefault(): Perfil {
    return {
      id: 0,
      nuevo: true,
      nombre: 'Nuevo Perfil',
      estadoRegistro: EEstadoRegistro.activo,
      temporal: true
    }
  };

  /**
   * Metodo encarcado de accionar el store para crear un nuevo empresa
   * @param payload empresa que se desea crear
   */
  public create(payload: Empresa): void {
    this._store.dispatch(empresaActions.createEmpresa({ payload }));
  }

  /**
   * Metodo encagado de accionar el store para actualizar un empresa existente
   * @param payload empresa que se desea editar
   */
  public update(payload: Empresa): void {
    this._store.dispatch(empresaActions.updateEmpresa({ payload }));
  }

  /**
   * Metodo encagado de accionar el store para obtener los empresas por criterios en especifico
   * @param criterios del empresa
   */
  public getAllEmpresas(criterios: Array<ObjParam> = []): void {
    this._store.dispatch(empresaActions.cleanEmpresaList());
    this._store.dispatch(empresaActions.loadEmpresas({ criterios }));
  }

  /**
   * Metodo encagado de accionar el store para obtener un empresa por un Id en especifico
   * @param id del empresa seleccionado
   */
  public selected(id: number): void {
    this._store.dispatch(empresaActions.loadEmpresa({ id }));
  }

  /**
   * Metodo encargado de accionar el store para activar un empresa
   */
  public activarEmpresa(payload: Empresa): void {
    this._store.dispatch(empresaActions.activarEmpresa({ payload }));
  }

  /**
   * Metodo encargado de accionar el store para inactivar un empresa
   */
  public inactivarEmpresa(payload: Empresa): void {
    this._store.dispatch(empresaActions.inactivarEmpresa({ payload }));
  }

  /**
   * Metodo usado para validar el codigo SICOM
   * @param codigo Codigo a validar
   * @param id Id a validar
   * @returns Observable con respuesta de la petición
   */
  public validarCodigoSicom(codigo: string, id: number): Observable<ResponseWebApi> {
    return this._empresaService.validarCodigoSicom(codigo, id);
  }

  /**
   * Metodo encargado de accionar el store para definir si la empresa tiene eds
   * @param payload booleano que define si la empresa tiene eds asociada
   */
  public empresaTieneEdsAsociada(payload: boolean): void {
    this._store.dispatch(empresaActions.empresaTieneEdsAsociada({ payload }));
  }

  /**
   * Metodo encargado de accionar el store para limpiar si la empresa tiene eds asociada
   */
  public cleanEmpresaTieneEdsAsociada(): void {
    this._store.dispatch(empresaActions.cleanEmpresaTieneEdsAsociada());
  }

  /**
   * Metodo encargado de accionar el store para asignar estado del formulario perfil
   */
  public asignarEstadoFormularioPerfil(estado: boolean): void {
    this._store.dispatch(empresaActions.asignarFormularioPerfilEditado({ estado }));
  }

  /**
 * Metodo para consumir un perfil por id
 * @param id identificador del perfil a consultar
 * @returns objeto con información del perfil del id consultado
 */
  public obtenerPerfilPorId(id: number): Observable<ResponseWebApi> {
    return this._empresaService.obtenerPerfilPorId(id);
  }

  /**
  * Metodo para consumir perfiles por criterios
  * @param criterios como filtro de busqueda
  * @returns objeto con información del perfil del id consultado
  */
  public obtenerPerfilPorCriterios(criterios: Array<ObjParam> = []): Observable<ResponseWebApi> {
    return this._empresaService.obtenerPerfilPorCriterios(criterios);
  }

  /**
  * Metodo para consumir paginas por criterios
  * @param criterios como filtro de busqueda
  */
  public obtenerPaginasPorCriterios(criterios: Array<ObjParam> = []): void {
    this._store.dispatch(empresaActions.loadPaginas({ criterios }));
  }

  /**
 * Metodo para consumir permisos por criterios
 * @param criterios como filtro de busqueda
 */
  public obtenerPermisosPorCriterios(criterios: Array<ObjParam> = []): void {
    this._store.dispatch(empresaActions.loadPermisos({ criterios }));
  }

}
