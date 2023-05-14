import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { SeguridadService } from '@core/services/seguridad.service';
import * as seguridadActions from '@core/store/actions/seguridad.action';
import { AppState } from '@core/store/app.interface';
import * as seguridadSelectors from '@core/store/selectors/seguridad.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable()
export class SeguridadModel {

  /**
   * Define la respuesta de un codigo generado
   */
  public responseCodigoGenerar$: Observable<any> = this._store.select(seguridadSelectors.getCodigoGenerado);

  /**
   * Define la respuesta de la validacion del codigo generado
   */
  public responseCodigoValidado$: Observable<any> = this._store.select(seguridadSelectors.getValidacionCodigo);


  /**
   * Metodo constructor del modelo de modulo, encargado de inyectar dependencias
   * @param store accede a los metodos y configuraciones del store
   */
  constructor(
    private _store: Store<AppState>,
    private _seguridadService: SeguridadService,
  ) { }

  /**
   * Metodo encargado de generar un codigo de verificacion
   * @param body objeto necesario para generar un codigo de verificacion
   */
  public generarCodigo(body: any): void {
    this._store.dispatch(seguridadActions.generarCodigo({ body }));
  }

  /**
   * Metodo encargado de validar un codigo de verificacion
   * @param body objeto necesario para validar un codigo de verificacion
   */
  public validarCodigo(body: any): void {
    this._store.dispatch(seguridadActions.validarCodigo({ body }));
  }
  /*
   * Metodo encargado de accionar el store para cerrar sesion
   */
  public cerrarSesion(): void {
    this._store.dispatch(seguridadActions.logoutUser());
  }

  /**
   * Metodo utilizado para actualizar la contraseña
   * @param body cuerpo de petición para reestablecer contraseña
   * @return Observable con la respuesta de la peticion
   */
  public actualizarPassword(body: any): Observable<ResponseWebApi> {
    let claves = {
      passwordActual: btoa(body.passwordActual),
      passwordNew: btoa(body.passwordNew),
      passwordNewConfirm: btoa(body.passwordNewConfirm)
    };
    return this._seguridadService.actualizarPassword(claves);
  }

  /**
   * Metodo utilizado para actualizar la contraseña
   * @param body cuerpo de petición para reestablecer contraseña
   * @return Observable con la respuesta de la peticion
   */
  public actualizarPasswordUser(body: any): Observable<ResponseWebApi> {
    let claves = {
      passwordActual: btoa(body.passwordActual),
      passwordNew: btoa(body.passwordNew),
      passwordNewConfirm: btoa(body.passwordNew),
      username: body.username,
      idUsuario: body.idUsuario
    };
    return this._seguridadService.actualizarPasswordUser(claves);
  }

  /**
   * Método encargado de validar un codigo de verificacion
   * @param body objeto necesario para validar un codigo de verificacion
   */
  public validarCodigoEager(body: any): Observable<ResponseWebApi> {
    return this._seguridadService.validarCodigo(body);
  }

  /**
   * Metodo utilizado para reestablecer contraseña desde el olvido de contraseña
   * @param body cuerpo de petición para reestablecer contraseña
   * @return Observable con la respuesta de la peticion
   */
  public reestablecerContrasena(body: any): Observable<ResponseWebApi> {
    body.passwordNew = btoa(body.passwordNew);
    body.passwordNewConfirm = btoa(body.passwordNewConfirm);
    return this._seguridadService.reestablecerContrasena(body);
  }

  /**
  * Método encargado de obtener empresas por criterios
  * @param criterios de filtro
  */
  public obtenerEmpresas(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._seguridadService.obtenerEmpresas(criterios);
  }

  /**
  * Método encargado de obtener perfiles por criterios
  * @param criterios de filtro
  */
  public obtenerPerfiles(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._seguridadService.obtenerPerfiles(criterios);
  }

  /**
  * Método encargado de obtener eds por criterios
  * @param criterios de filtro
  */
  public obtenerAllEds(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._seguridadService.obtenerAllEds(criterios);
  }

}
