import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Parametrizacion } from '@core/interfaces/maestros-del-sistema/parametrizacion.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { ParametrizacionService } from '@core/services/maestro-general/parametrizacion.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrizacionFormularioService {


  /**
   * Método donde se inyectan las dependencias
   * @param _httpBaseService inyeccion servicio http base
   * @param _parametrizacionService Servicio de las Parametrizaciones
   */
  constructor(
    private _httpBaseService: HttpBaseService,
    private _parametrizacionService: ParametrizacionService
  ) {}

  /**
   * Metodo encargado de crear una parametrizacion
   * @param parametrizacion Variable que contiene la informacion de la parametrizacion que se va a crear
   */
  public crearParametrizacion(parametrizacion: Parametrizacion): void{
    this._httpBaseService.postMethod('tipoDetalle', parametrizacion, [], false);
  }

  /**
   * Metodo para validar la existencia de la nomenclatura
   * @param tipoDetalle objeto a enviar
   * @returns objeto con la respuesta
   */
   public validarNomenclatura(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('tiposDetalle/nomenclatura/validar', criterios, false);
  }
}

