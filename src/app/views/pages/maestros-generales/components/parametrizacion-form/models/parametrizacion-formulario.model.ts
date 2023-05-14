import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Parametrizacion } from '@core/interfaces/maestros-del-sistema/parametrizacion.interface';
import { Observable } from 'rxjs';
import { ParametrizacionFormularioService } from '../services/parametrizacion-formulario.service';

@Injectable()
export class ParametrizacionFormularioModel {
  /**
   * Metodo donde se inyectan las dependencias
   * @param _parametrizacionFormService Servicio del formulario de parametrizaciones
   */
  constructor(
    private _parametrizacionFormService: ParametrizacionFormularioService,
  ) { }


  /**
   * Método encargado de crear una parametrización
   * @param parametrizacion Variable que contiene la informacion de la parametrizacion que se va a crear
   */
  public crearParametrizacion(parametrizacion: Parametrizacion): void {
    this._parametrizacionFormService.crearParametrizacion(parametrizacion);
  }

  /**
   * Metodo para validar la existencia de la nomenclatura
   * @param criterios array de los filtros a validar
   * @returns objeto con la respuesta
   */
  public validarNomenclatura(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._parametrizacionFormService.validarNomenclatura(criterios);
  }



}
