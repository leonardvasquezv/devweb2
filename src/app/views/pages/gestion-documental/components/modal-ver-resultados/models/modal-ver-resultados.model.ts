import { Injectable } from "@angular/core";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { AppState } from '@core/store/app.interface';
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as resultadoEvaluacionSelector from '../../../../gestion-documental/store/selectors/resultadoEvaluacion.selectors';
import { ModalVerResultadosService } from '../services/modal-ver-resultados.service';

@Injectable()
export class ModalVerResultadosModel {

    /**
     * Método encargado de accionar el store para obtener los resultados de una evaluación
     */
    public entitieResultadoEvaluacion$: Observable<any> = this._store.select(
        resultadoEvaluacionSelector.getAllResultadoEvaluacion
    )



    /**
     * Método en el que se inyectan las dependencias
     * @param _store Variable que permite acceder al Store
     * @param _modalVerResultadosService Varaible que permite acceder al servicio del ModalVerResultados
     */
    constructor(
        private _store: Store<AppState>,
        private _modalVerResultadosService: ModalVerResultadosService
    ) { }

    /**
     * Método encargado de crear una evidencia a un item del plan de mejoramiento de un archivo específico
     * @param evidencia Variable que trae consigo la información de la evidencia
     */
    public crearEvidenciaCriterio(evidencia: any): Observable<ResponseWebApi> {
        return this._modalVerResultadosService.crearEvidenciaCriterio(evidencia);
    }

    /**
 * Método encargado de crear una evidencia a un item del plan de mejoramiento de un archivo específico
 * @param evidencia Variable que trae consigo la información de la evidencia
 */
    public obtenerEvidenciaCriterio(idEvaluacionCriterio: number): Observable<ResponseWebApi> {
        return this._modalVerResultadosService.obtenerEvidenciaCriterio(idEvaluacionCriterio)
    }

    /**
     * Método en cargado de obtener el puntaje e indicador de una evaluación
     * @param idDocumento id del documento al que se desea obtener puntaje e indicador
     * @returns Objeto con el indicador y el puntaje
     */
    public obtenerIndicador(idDocumento: number): Observable<ResponseWebApi> {
        return this._modalVerResultadosService.obtenerIndicador(idDocumento)
    }

    /**
     * Método encargado de obtener el puntaje y el indicador de una evalución dependiendo de de un idDocumento
     * @param idDocumento Id del documento del que se le buscará el indicador y su puntaje
     * @return Objeto que contiene el indicador, mensaje informativo y su puntaje
     */
    public obtenerCriteriosNoCumplidos(idDocumento: number): Observable<ResponseWebApi> {
        return this._modalVerResultadosService.obtenerCriteriosNoCumplidos(idDocumento);
    }

    /**
     * Método encargado de obtener la información para las gráficas de cumplimiento
     * @param idDocumento Id del documento que contiene la evaluación la cual se le quiere consultar las gráficas
     * @param cumplimiento Variable que permite saber si se está consultado cumplimiento estándar o por ciclo phva
     * @eturns Lista de criterios agrupados por cumplimiento estándar o por ciclo phva
     */
    public obtenerInfoGraficaCumplimiento(idDocumento: number, cumplimiento: number): Observable<ResponseWebApi> {
        return this._modalVerResultadosService.obtenerInfoGraficaCumplimiento(idDocumento, cumplimiento);
    }

}