import { Injectable } from '@angular/core';
import { EPermisosEnum } from '@core/enum/permisos.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalVerResultadosService {

  /**
   * Método en el que se inyectan las dependencias
   * @param _httpService Variable que accede a las configuraciones y metodos del servicio Http
   */
  constructor(
    private _httpService: HttpBaseService
  ) { }


  /**
   * Método encargado de crear una evidencia a un item del plan de mejoramiento
   * @param evidencia Variable que trae consigo la información de la evidencia
   * @return Un observable de tipo ResponseWebApi que trae consigo el item que ha sido creado
   */
  public crearEvidenciaCriterio(evidencia: any): Observable<ResponseWebApi> {
    return this._httpService.postMethod('evidenciaCriterio', evidencia, [], false, false, EPermisosEnum.crear);
  }

  /**
   * Metodo pars traer la evidencia de las evaluaciones criterio
   * @param idEvaluacionCriterio id de la evaluacion a buscar las evidencias
   * @returns Observable de tipo ResponseWebApi
   */
  public obtenerEvidenciaCriterio(idEvaluacionCriterio: number): Observable<ResponseWebApi> {
    return this._httpService.getMethod(`evidenciaCriterio/${idEvaluacionCriterio}`, [], false);
  }

  /**
   * Método encargado de obtener el puntaje y el indicador de una evalución dependiendo de de un idDocumento
   * @param idDocumento Id del documento del que se le buscará el indicador y su puntaje
   * @return Objeto que contiene el indicador, mensaje informativo y su puntaje
   */
  public obtenerIndicador(idDocumento: number): Observable<ResponseWebApi> {
    return this._httpService.getMethod(`evaluacion/obtenerIndicador/${idDocumento}`, [], false);
  }


  /**
   * Método encargado de obtener los criterios de una evaluación que no cumplieron con el puntaje establecido
   * @param idDocumento Id del documento al que pertenece la evaluación y de la cual se quiere conocer los criterios no cumplidos
   * @returns Lista de criterios no cumplidos
   */
  public obtenerCriteriosNoCumplidos(idDocumento: number): Observable<ResponseWebApi> {
    return this._httpService.getMethod(`criterio/no-aprobados/${idDocumento}`, [], false);
  }

  /**
   * Método encargado de obtener la información para las gráficas de cumplimiento
   * @param idDocumento Id del documento que contiene la evaluación la cual se le quiere consultar las gráficas
   * @param cumplimiento Variable que permite saber si se está consultado cumplimiento estándar o por ciclo phva
   * @eturns Lista de criterios agrupados por cumplimiento estándar o por ciclo phva
   */
  public obtenerInfoGraficaCumplimiento(idDocumento: number, cumplimiento: number): Observable<ResponseWebApi> {
    return this._httpService.getMethod(`criterio/grafica-cumplimiento/${idDocumento}/${cumplimiento}`, [], false);
  }

}
