import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { UtilsService } from "@shared/services/utils.service";
import { ModalVerResultadosService } from '../../components/modal-ver-resultados/services/modal-ver-resultados.service';


@Injectable()
export class ResultadoEvaluacionEffects {

  /**
   * Método donde se inyectan las dependencias
   * @param _actions$ define las acciones del estado
   * @param _modalVerResultadosService Variable que permite utilizar el servicio de del Modal de Ver Resultados
   * @param _utilService Vasriable que permite acceder al servicio de Utils
   */
  constructor(
    private _actions$: Actions,
    private _modalVerResultadosService: ModalVerResultadosService,
    private _utilService: UtilsService
  ) { }



}