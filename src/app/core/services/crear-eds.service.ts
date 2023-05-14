import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { CrearEds } from '@core/interfaces/crear-eds.interface';
import { Observable } from 'rxjs';
import { DataEds } from '../interfaces/data-eds.interface';
import { HttpBaseService } from './base/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class CrearEdsService {

  /**
   * Metodo donde se inyectan las dependencias del componente.
   */
  constructor(
    private _httpBaseService: HttpBaseService
  ) {
  }

  /**
   * metodo que envia el idEds a consultar
   */
  public obtenerIdEds(idEds: number): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod(`eds/${idEds}`, [], false)
  }

  /**
   * Metodo encargado de crear un eds
   * @param eds Variable que contiene la informacion del eds que se va a crear
   * @returns Observeble con ResponseWebApi
   */
  public crearEds(eds: DataEds): Observable<ResponseWebApi> {
    return this._httpBaseService.postMethod('eds', eds, [], false);
  }

  /**
   * Metodo para validar la existencia de la nomenclatura
   * @param criterios objeto a enviar
   * @returns objeto con la respuesta
   */
  public ExisteCodigoSicom(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('eds/codigoSicom/existe', criterios, false);
  }

  /**
   * Metodo para obtener las parametrizacion
   * @param criterios array con los filtros de la parametrizacion
   * @return Array con la respuesta
   */
  public obtenerMayoristas(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('empresas', criterios, false)
  }

  /**
   * Metodo utilizado para editar una eds
   * @param eds objeto con la informacion a editar
   * @return Array con la respuesta
   */
  public editarEds(eds: DataEds): Observable<ResponseWebApi> {
    return this._httpBaseService.putMethod(`eds/${eds.idEds}`, eds, [], false)
  }

}
