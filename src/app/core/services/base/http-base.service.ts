import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EPermisosEnum } from '@core/enum/permisos.enum';
import { ETypeContent } from '@core/enum/typeContent.enum';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { GeneralUtils } from '@core/utils/general-utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpBaseService {

  /**
   * Propiedad que especifica el dominio base del consumo de las webApi
   */
  private envSeg = GeneralUtils.getUrlWebApiSeguridad();

  /**
   * Propiedad que especifica el dominio base del consumo de las webApi
   */
  private envPro = GeneralUtils.getUrlWebApiProceso();

  /**
   * Propiedad para resovel fomatos de fecha
   */
  private _resolvedOptions = Intl.DateTimeFormat().resolvedOptions();

  /**
   * Inyeccion de dependencias para utilizar metodos http
   * @param _http creacion de instancia de httpClient
   */
  constructor(private _http: HttpClient) { }

  /**
   * Metodo GET utilizado para enviar peticiones al servidor
   * @param url que define el WebApi que será consumido
   * @param httpParams define los query params
   * @param idPermiso define el tipo de permiso que tiene la peticion
   * @param envTempSeg define el enviroment que se utilizara de manera temporal
   * @returns un observable con la respuesta del servidor
   */
  public getMethod<T>(
    url: string,
    httpParams: Array<ObjParam> = [],
    envTempSeg: boolean = true,
    idPermiso: number = EPermisosEnum.leer,
    typeContent: string = ETypeContent.applicationJson
  ): Observable<T> {
    //TODO Dejar solo un enviroment
    const urlApiResource = (envTempSeg ? this.envSeg : this.envPro) + url;
    let params = new HttpParams();
    if (httpParams)
      httpParams.forEach(
        (param) => (params = params.append(param.campo, param.valor))
      );
    let headers = this.interceptPermiso(new HttpHeaders(), idPermiso);
    headers = this.interceptTypeContent(headers, typeContent);
    return this._http.get<T>(urlApiResource, { params, headers });
  }

  /**
   * Metodo POST utilizado para enviar peticiones al servidor
   * @param url que define el WebApi que será consumido
   * @param params define los body params
   * @param timeZone define si se requiere parametros de zona horaria
   * @param idPermiso define el tipo de permiso que tiene la peticion
   * @param envTempSeg define el enviroment que se utilizara de manera temporal
   * @returns un observable con la respuesta del servidor
   */
  public postMethod<T>(
    url: string,
    bodyParams: any = null,
    httpParams: Array<ObjParam> = [],
    envTempSeg: boolean = true,
    timeZone = false,
    idPermiso: number = EPermisosEnum.crear,
    typeContent: string = ETypeContent.applicationJson
  ): Observable<T> {
    //TODO Dejar solo un enviroment
    const urlApiResource = (envTempSeg ? this.envSeg : this.envPro) + url;
    let params = new HttpParams();
    let headers = this.interceptPermiso(new HttpHeaders(), idPermiso);
    if (httpParams)
      httpParams.forEach(
        (param) => (params = params.append(param.campo, param.valor))
      );
    if (timeZone)
      headers = headers.append('ZonaHoraria', this._resolvedOptions.timeZone);
    headers = this.interceptTypeContent(headers, typeContent);
    return this._http.post<T>(urlApiResource, bodyParams, { params, headers });
  }

  /**
   * Metodo PUT utilizado para enviar peticiones al servidor
   * @param url que define el WebApi que será consumido
   * @param bodyParams define los body params
   * @param httpParams define los query params
   * @param envTempSeg envTempSeg define el enviroment que se utilizara de manera temporal
   * @param idPermiso define el tipo de permiso que tiene la peticion
   * @returns un observable con la respuesta del servidor
   */
  public putMethod<T>(
    url: string,
    bodyParams: any = null,
    httpParams: Array<ObjParam> = [],
    envTempSeg: boolean = true,
    idPermiso: number = EPermisosEnum.editar,
    typeContent: string = ETypeContent.applicationJson
  ): Observable<T> {
    //TODO Dejar solo un enviroment
    const urlApiResource = (envTempSeg ? this.envSeg : this.envPro) + url;
    let params = new HttpParams();
    let headers = this.interceptPermiso(new HttpHeaders(), idPermiso);
    headers = this.interceptTypeContent(headers, typeContent);
    if (httpParams)
      httpParams.forEach(
        (param) => (params = params.append(param.campo, param.valor))
      );
    return this._http.put<T>(urlApiResource, bodyParams, { params, headers });
  }

  /**
   * Metodo DELETE utilizado para enviar peticiones al servidor
   * @param url que define el WebApi que será consumido
   * @param httpParams define los query params
   * @param idPermiso define el tipo de permiso que tiene la peticion
   * @param envTempSeg envTempSeg define el enviroment que se utilizara de manera temporal
   * @returns un observable con la respuesta del servidor
   */
  public deleteMethod<T>(
    url: string,
    httpParams: Array<ObjParam> = [],
    idPermiso: number = EPermisosEnum.eliminar,
    envTempSeg: boolean = true,
    typeContent: string = ETypeContent.applicationJson
  ): Observable<T> {
    //TODO Dejar solo un enviroment
    const urlApiResource = (envTempSeg ? this.envSeg : this.envPro) + url;
    let params = new HttpParams();
    if (httpParams)
      httpParams.forEach(
        (param) => (params = params.append(param.campo, param.valor))
      );
    let headers = this.interceptPermiso(new HttpHeaders(), idPermiso);
    headers = this.interceptTypeContent(headers, typeContent);
    return this._http.delete<T>(urlApiResource, { params, headers });
  }

  /**
   * Metodo para interceptar los permisos de las peticiones
   * @param headers que se agregara parametros
   * @param idPermiso que se le agregara al header
   */
  private interceptPermiso(
    headers: HttpHeaders,
    idPermiso: number
  ): HttpHeaders {
    return idPermiso !== 0
      ? (headers = headers.append('idPermiso', idPermiso + ''))
      : headers;
  }

  /**
   * Metodo para interceptar los typecontent de las peticiones
   * @param headers que se agregara parametros
   * @param tyepContent que se le agregara al header
   */
  private interceptTypeContent(
    headers: HttpHeaders,
    typeContent: string
  ): HttpHeaders {
    return !!typeContent
      ? (headers = headers.append('content-type', typeContent))
      : headers;
  }
}
