import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ItemPlanMejoramiento } from '@core/interfaces/plan-mejoramiento/itemPlanMejoramiento.interface';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts/highstock';
import { Subscription } from 'rxjs';
import { ModalVerResultadosService } from '../../services/modal-ver-resultados.service';
@Component({
  selector: 'app-slider-tres',
  templateUrl: './slider-tres.component.html',
  styleUrls: ['./slider-tres.component.scss']
})
export class SliderTresComponent implements OnInit, OnDestroy {
  /**
   * Variable que define las propiedades de HighCharts
   */
  public highCharts: typeof Highcharts = Highcharts;
  /**
   * Opciones de personalización de la gráfica
  */
  public chartOptions: Highcharts.Options;

  /**
   * Lista que contiene las etiquetas de la grafica
   */
  public etiquetas: Array<string>;

  /**
    * Lista que contiene los puntajes obtenidos
    */
  public puntajesObtenidos: Array<number>;

  /**
    * Lista que contiene los puntajes esperados
    */
  public puntajesEsperados: Array<number>;


  /**
   * Variable que contiene el id del documento
   */
  @Input() idDocumento: number;

  /**
   * Variable que contiene las subscripciones
   */
  private _suscripciones =  new Subscription()



  /**
   * Método para inyectar dependencias
   * @param _modalVerResultadosService Variable que permite acceder al modelo del modal ver resultados
   * @param _translateService Servicio de traducciones
   */
  constructor(
    private _translateService: TranslateService,
    private _modalVerResultadosService: ModalVerResultadosService
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
    const obtenerInfoGraficaCumplimientoSub = this._modalVerResultadosService.obtenerInfoGraficaCumplimiento(this.idDocumento,2).subscribe(response => {
      this.etiquetas = response.data.map((dato:ItemPlanMejoramiento) => dato.cumplimiento);
      this.puntajesEsperados = response.data.map((dato: ItemPlanMejoramiento) => dato.puntajeEsperado);
      this.puntajesObtenidos = response.data.map((dato: ItemPlanMejoramiento) => dato.puntajeObtenido);
      this.iniciarOpciones();
      this.iniciarGrafica();
    })

    this._suscripciones.add(obtenerInfoGraficaCumplimientoSub);
  }
  /**
   * Método para inicializar la gráfica
  */
  public iniciarGrafica(): void {
    Highcharts.chart('container-3', this.chartOptions)
  }
  /**
    *Método para inicializar las opciones de la gráfica 
  */
  public iniciarOpciones(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
        height: 350
      },
      title: undefined,

      xAxis: {
        categories: this.etiquetas,
        crosshair: true,
        labels: {
          overflow: 'justify',
          style: {
            fontFamily: 'Montserrat',
            color: '#7D7A86'
          }
        },
        min: 0,
        max: this.etiquetas.length - 1,
        scrollbar: {
          enabled: false
        }
      },

      yAxis: {
        title: null,
        tickAmount: 4,
        labels: {
          style: {
            fontFamily: 'Montserrat',
            color: '#D7DFDC'
          }
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          return `
             <span style="font-size:10px"> Ciclo: <b>${this.x}</b></span>
             <table>
               <tr>
                 <td style="color:${this.color};padding:0">${this.points[0].point.series.name}: </td>
                 <td style="padding:0"><b>${this.points[0].y}</b></td>
               </tr>
               <tr>
               <td style="color:${this.color};padding:0">${this.points[1].point.series.name}: </td>
               <td style="padding:0"><b>${this.points[1].y}</b></td>
             </tr>
             </table>
             `
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.1,
          groupPadding: 0.35,
        },
        series: {
          dataLabels: {
            enabled: true,
            style: {
              color: '#5C7448',
              fontFamily: 'Montserrat, Regular',
              fontWeight: '500'
            }
          }
        }
      },
      series: [
        {
          name: this._translateService.instant('TITULOS.PORCENTAJE_MAXIMO'),
          type: 'column',
          data: this.puntajesEsperados,
          color: '#CADFB8',
          borderRadius: 1,
          borderColor: '#CADFB8'
        },
        {
          name: this._translateService.instant('TITULOS.PORCENTAJE_OBTENIDO'),
          type: 'column',
          data: this.puntajesObtenidos,
          color: '#F5F9F2',
          borderColor: '#CADFB8',
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              callback: () => window.screen.width >= 360 && window.screen.width < 768
            },
            chartOptions:{
              plotOptions:{
                column: {
                  groupPadding: 0.1,
                },
              },
              xAxis: {
                labels: {
                  enabled: false
                }
              }
            }
          },
        ],
      },
      credits: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      }
    }
  }


}
