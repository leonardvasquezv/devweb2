import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Documento } from '@core/interfaces/documento.interface';
import { IndicadorCumplimiento } from '@core/interfaces/evaluacion/indicadorCumplimiento.interface';
import { ResultadosEvaluacion } from '@core/interfaces/resultados-evaluacion.interface';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { GestionDocumentalModel } from '../../models/gestion-documental.model';
import { ModalVerResultadosModel } from './models/modal-ver-resultados.model';

@Component({
  selector: 'app-modal-ver-resultados',
  templateUrl: './modal-ver-resultados.component.html',
  styleUrls: ['./modal-ver-resultados.component.scss']
})
export class ModalVerResultadosComponent implements OnInit, OnDestroy {

  /**
   * Opciones para el funcionamiento del Slider
   */
  public opcionesSlider: OwlOptions;

  /**
   * Variable que contiene el archivo actual del documento
   */
  public resultadoEvaluacion: ResultadosEvaluacion;

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();


  /**
   * Variable que contiene la información para la gráfica del primer slider - indicador de cumplimiento
   */
  public indicadorCumplimiento: IndicadorCumplimiento;


  /**
   * Método para inyectar dependencias
   * @param MAT_DIALOG_DATA Inyección del servicio de modales
   * @param _gestionDocumentalModel modelo de gestion documental
   * @param _modalVerResultadoModel Modelo de el modal ver resultados
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { documento: Documento },
    private _modalVerResultadoModel: ModalVerResultadosModel,
    private _gestionDocumentalModel: GestionDocumentalModel,
  ) { }


  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.cargarValoresIniciales();
    if (this.resultadoEvaluacion) this.inicializarConfiguracionesSliderGrafica();
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
    this._gestionDocumentalModel.cleanAllArchivoList();
  }


  /**
   * Método que permite establecer valores iniciales
   */
  private cargarValoresIniciales(): void {
    //TODO ajaner validar valor que sera asignado
    let codigoArchivo = null;;
  }


  /**
   * Método encargado de inicializar las configuraciones del slider
   */
  public inicializarConfiguracionesSliderGrafica(): void {
    this.opcionesSlider = {
      dots: false,
      margin: 20,
      smartSpeed: 400,
      dragEndSpeed: 350,
      mouseDrag: false,
      responsive: {
        0: {
          items: 1
        }
      },
      responsiveRefreshRate: 100,
      nav: true,
      navText: ['<div></div>', '<div></div>'],
    }
  }

}
