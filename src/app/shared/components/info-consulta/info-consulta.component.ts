import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ObjConfiguracionGeneral } from '@core/interfaces/base/objConfiguracionGeneral.interface';
import { ObjInfoConsultaDatos } from '@core/interfaces/base/objInfoConsultaDatos.interface';

@Component({
  selector: 'app-info-consulta',
  templateUrl: './info-consulta.component.html',
})
export class InfoConsultaComponent implements OnChanges, OnInit {

  /**
   * Array con la informacion de titulo y contenido que se desea mostrar
   */
  @Input() arrayConsulta: Array<ObjInfoConsultaDatos> = [];
  /**
   * Cantidad de columnas que se quieren mostrar, por defecto es 4.
   */
  @Input() columnas = 4;
  /**
   * Cantidad de columnas que se quieren mostrar, por defecto es 4.
   */
  @Input() bgColor: string;

  /**
   * Propiedad que define el numero de columnas basaso en bootstrap
   */
  public numColumClass = 'col-sm-6 col-md-6 col-lg-6 col-xl-6';

  /**
   * Propiedad que define la configuracion general
   */
  public objConfigGen: ObjConfiguracionGeneral;

  /**
   * Propiedad que define el color de fondo
   */
  public bgColorStyle: string;

  /**
   * Array para mostrar las tarjetas
   */
  public arrayConsultaVisualizacion: Array<ObjInfoConsultaDatos> = [];

  /**
   * Metodo constructor del componente de informacion de consulta
   */
  constructor() { }

  /**
   * Metodo encargado de manejar los cambios de los valores de entrada
   * @param changes objetos con las propiedades de valores de entrada
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.columnas) {
      const colum = '' + Math.round(12 / changes.columnas.currentValue);
      this.numColumClass = 'col-sm-12 col-md-' + colum + ' col-lg-' + colum + ' col-xl-' + colum;
    }
    if (!!changes.bgColor) {
      this.bgColorStyle = `background-color: ${this.bgColor}!important;`;
    }
    if (!!changes.arrayConsulta) {
      this.arrayConsultaVisualizacion = this.arrayConsulta;
    }
  }
  //Método que se ejecuta al iniciar, se verifica si de los objetos de entrada que son
  //imágenes son de tipo FileList
  ngOnInit() {
    this.arrayConsulta.map((d) => {
      if (d.type == 'imagen') {
        if (d.value instanceof FileList) {
          var reader = new FileReader();
          reader.readAsDataURL(d.value[0]);
          reader.onload = function () {
            d.value = reader.result
          };
          reader.onerror = function (error) {
          };
        }
      }
    })
  }
}
