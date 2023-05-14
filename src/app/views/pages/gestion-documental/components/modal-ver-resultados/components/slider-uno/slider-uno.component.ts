import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigGraficaIndicador } from '@core/classes/configGraficaIndicador.class';
import { Archivo } from '@core/interfaces/archivo.interface';
import { IndicadorCumplimiento } from '@core/interfaces/evaluacion/indicadorCumplimiento.interface';
import { ItemPlanMejoramiento } from '@core/interfaces/plan-mejoramiento/itemPlanMejoramiento.interface';
import { ResultadosEvaluacion } from '@core/interfaces/resultados-evaluacion.interface';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '@shared/services/utils.service';
import * as Highcharts from 'highcharts/highstock';
import { Subscription } from 'rxjs';
import { ModalVerResultadosModel } from '../../models/modal-ver-resultados.model';
import { ModalMensajeInformativoComponent } from './components/modal-mensaje-informativo/modal-mensaje-informativo.component';
import { ModalRegistrarComponent } from './components/modal-registrar/modal-registrar.component';

@Component({
  selector: 'app-slider-uno',
  templateUrl: './slider-uno.component.html',
  styleUrls: ['./slider-uno.component.scss']
})
export class SliderUnoComponent implements OnInit, OnDestroy {

  /**
   * Opciones de personalización de la gráfica
   */
  public chartOptions: ConfigGraficaIndicador;

  /**
   * Propiedad que define la gráfica de Indicador de cumplimiento
   */
  public Highcharts: typeof Highcharts = Highcharts;

  /**
   * Variable que maneja el resultado de la evaluación
   */
  public textoBoton: string;

  /**
   * Variable que contiene los resultados de la evaluación
   */
  @Input() public resultadoEvaluacion: ResultadosEvaluacion;



  /**
   * Variable que contiene la información de un archivo
   */
  @Input() public archivo: Archivo;

  /**
   * Variable que contiene el id del documento
   */
  @Input() public idDocumento: number;

  /**
   * Variable que maneja el titutlo de la gráfica
   */
  public tituloGrafica: string;

  /**
   * Variable que contiene el último puntaje obtenido en la evaluación
   */
  public puntajeEvaluacion: number;

  /**
   * Variable que contiene la información del indicador de cumplimiento
   */
  public indicadorCumplimiento: IndicadorCumplimiento;

  /**
   * Variable que contiene los criterios que no cumplieron con el puntaje establecido
   */
  public criteriosNoCumplidos: ItemPlanMejoramiento;

  /**
   * Variable que contiene las subscripciones
   */
  private _suscripciones = new Subscription();


  /**
   * Metodo donde se inyectan las dependencias
   * @param _matDialog Define los atributos y las propiedades de los modales
   * @param _translateService Servicio para las traducciones
   * @param _modalVerResultadoModel Servicio que referencia al modal de ver resultados
   * @param _utilService Servicio de utlidades
   */
  constructor(
    private _matDialog: MatDialog,
    private _translateService: TranslateService,
    private _modalVerResultadoModel: ModalVerResultadosModel,
    private _utilService : UtilsService
  ) { }

  /**
   * Metodo que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._suscripciones.unsubscribe();
  }


  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {

    setTimeout(() => {
      this._utilService.refreshViewPage();
    }, 500);
    
    const obtenerIndicadorSub = this._modalVerResultadoModel.obtenerIndicador(this.idDocumento).subscribe(response => {
      this.indicadorCumplimiento = response.data
      this.iniciarOpciones();
      this.iniciarGrafica();
    })

    const obtenerCriteriosNoCumplidosSub = this._modalVerResultadoModel.obtenerCriteriosNoCumplidos(this.idDocumento).subscribe(response => {
      this.criteriosNoCumplidos = response.data;
    })
    this._suscripciones.add(obtenerIndicadorSub);
    this._suscripciones.add(obtenerCriteriosNoCumplidosSub);
  }



  /**
   * Método para inicializar la gráfica
   */
  public iniciarGrafica(): void {
    Highcharts.chart('container', this.chartOptions.obtenerOpciones())
  }

  /**
   * Método para inicializar las opciones de la gráfica
   */
  public iniciarOpciones(): void {
    this.puntajeEvaluacion = this.indicadorCumplimiento.puntaje;
    this.tituloGrafica = this.indicadorCumplimiento.tituloIndicador;
    this.chartOptions = new ConfigGraficaIndicador(this.puntajeEvaluacion, this.tituloGrafica);
    this.textoBoton = this._obtenerTraduccion()
  }

  /**
   * Método encargado de abrir el modal que contiene el mensaje informativo dependiendo del porcentaje obtenido
   */
  public mostrarValoracion(): void {
    this._matDialog.open(ModalMensajeInformativoComponent, {
      data: {
        puntajeObtenido: this.puntajeEvaluacion,
      },
      panelClass: 'modal-mensaje-informativo'
    })
  }


  /**
   * Método para obtener la traducción del botón
   * @returns La traducción para el texto del botón dependiendo del puntaje de la evaluación
   */
  private _obtenerTraduccion(): string {
    if (this.puntajeEvaluacion < 60) {
      return this._translateService.instant('TITULOS.RESULTADO_CRITICO');
    } else if (this.puntajeEvaluacion >= 60 && this.puntajeEvaluacion <= 85) {
      return this._translateService.instant('TITULOS.RESULTADO_MODERADAMENTE_ACEPTABLE');
    } else {
      return this._translateService.instant('TITULOS.RESULTADO_ACEPTABLE');
    }
  }


  /**
   * Método encargado de abrir el modal para registrar las evidencias del plan de mejoramiento
   * @param idEvaluacionCriterio de la evaluacion criterio
   */
  public abrirModalRegistrarPlanMejoramiento(idEvaluacionCriterio: number): void {
    this._matDialog.open(ModalRegistrarComponent, {
      data: {
        idEvaluacionCriterio
      },
      panelClass: 'modal-registrar-evidencia'

    })
  }


}
