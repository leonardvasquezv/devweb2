import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { Observable } from 'rxjs';
import { Parametrizacion } from '../../interfaces/maestros-del-sistema/parametrizacion.interface';
import { HttpBaseService } from '../base/http-base.service';

@Injectable({
  providedIn: 'root',
})
export class ParametrizacionService {
  /**
   * Variable que guarda la lista de parametrizacion
   */
  public listaParametrizacionTemp: Parametrizacion[];

  /**
   * Metodo donde se inyectan las dependencias
   * @param _httpService inyeccion servicio general http
   */
  constructor(private _httpService: HttpBaseService) {
  }

  /**
   * Metodo para obtener la lista de parametrizacion
   * @param criterio Array que contiene los criterios para realizar la busqueda de parametrizaciones
   * @return  Devuelve una respuesta de backend simulada con la lista de parametrizaciones
   */
  public obtenerListaParametrizacion(criterio: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpService.getMethod('tiposDetalle', criterio, false);
  }


  /**
   * Metodo encargado de crear una parametrizacion
   * @param tipoDetalle Variable que contiene la informacion de la parametrizacion que se va a crear
   * return objeto respuesta
   */
  public crearParametrizacion(tipoDetalle: TipoDetalle): Observable<ResponseWebApi> {
    return this._httpService.postMethod('tipoDetalle', tipoDetalle, [], false);
  }

  /**
   * Metodo para obtener la lista de parametrizacion
   * @param idTipoDetalle id unico
   * @return objeto respuesta
   */
   public obtenerParametrizacionPorId(idTipoDetalle: number): Observable<ResponseWebApi> {
    return this._httpService.getMethod(`tipoDetalle/${idTipoDetalle}`, [], false);
  }

  /**
   * Metodo para editar un tipo detalle
   * @param tipoDetalle objeto a editar
   * @return objeto respuesta
   */
   public editarParametrizacion(tipoDetalle: TipoDetalle): Observable<ResponseWebApi> {
    return this._httpService.putMethod('tipoDetalle', tipoDetalle , [], false);
  }

  /**
   * Metodo para cambiar el estado de un tipo detalle
   * @param tipoDetalle objeto a editar
   * @return objeto respuesta
   */
   public cambioEstadoParametrizacion(tipoDetalle: TipoDetalle): Observable<ResponseWebApi> {
    return this._httpService.putMethod('tipoDetalle/cambioEstado', tipoDetalle , [], false);
  }

}
