import { Injectable } from "@angular/core";
import { ObjParam } from "@core/interfaces/base/objParam.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { DataEds } from "@core/interfaces/data-eds.interface";
import { Observable } from "rxjs";
import { HttpBaseService } from "./base/http-base.service";

@Injectable({
  providedIn: 'root'
})
export class EdsService {

  /**
   * Constructor de los servicios de eds
   * @param _httpBaseService inyeccion servicio http base
   */
  constructor(private _httpBaseService: HttpBaseService) { }

  /**
  * metodo para obtener el listado de eds
  * @param criterios parametros de busqueda
  * @returns Observeble con ResponseWebApi
  */
  public obtenerEds(criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('listadoEds', criterios || [], false)
  }

  /**
   * Método para  actualizar un objeto de tipo Eds
   * @param criterios Objeto de tipo Array<ObjParam> con los parametros contenidos
   * @returns Observable con ResponseWebApi
   */
  public actualizarEstadoEds(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('eds/cambioEstado', criterios || [], false)
  }

  /**
   * Metodo para validar si existe  una eds con Nit 
   * @param criterios objeto a enviar
   * @returns objeto con la respuesta
   */
  public ExisteNitEds(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('eds/Nit/existe', criterios, false);
  }
}
