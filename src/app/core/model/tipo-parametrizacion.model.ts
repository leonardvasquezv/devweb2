import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TipoParametrizacionService } from '@core/services/maestro-general/tipo-parametrizacion.service';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';

@Injectable()
export class TipoParametrizacionModel{

    /**
     * Metodo donde se inyectan las dependencias
     * @param _tipoParametrizacionService inyeccion servicios tipo parametrizacion
     */
    constructor(
       private _tipoParametrizacionService: TipoParametrizacionService
    ){}

    /**
     * Metodo encargado de accionar el store para obtener los tipos de parametrizaciones
     * @param criterios filtro
     * @returns array con la respuesta
     */
    public obtenerTiposParametrizacion(criterios: Array<ObjParam> = null): Observable<ResponseWebApi> {
      return this._tipoParametrizacionService.obtenerTiposParametrizaciones(criterios)
    }

}
