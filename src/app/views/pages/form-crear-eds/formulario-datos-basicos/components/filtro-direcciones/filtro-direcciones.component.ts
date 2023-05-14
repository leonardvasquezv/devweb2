import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { GeneralUtils } from '@core/utils/general-utils';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ModalBuscarDireccionService } from '../modal-buscar-direccion/modal-buscar-direccion.service';

@Component({
  selector: 'app-filtro-direcciones',
  templateUrl: './filtro-direcciones.component.html',
  styleUrls: ['./filtro-direcciones.component.scss']
})
export class FiltroDireccionesComponent implements OnInit, OnChanges {

  /**
   * Variable que contiene la ubicación seleccionada en coordeandas
   */
  @Output() public coordenadasDireccion: EventEmitter<google.maps.LatLng> = new EventEmitter();


  /**
   * Variable que contiene la lista de direcciones 
   */
  public direcciones: Array<google.maps.GeocoderResult>;

  /**
   * Variable que contiene las opciones de direccion
   */
  public prediccionDirecciones: Array<google.maps.places.AutocompletePrediction>


  /**
    * Variable que contiene la direccion ingresada en el buscador
    */
  @Input() public direccion: string;

  /**
    * VDefine las coordenas que restringe la zona de busqueda en el filtro
    */
  @Input() public boundsRestriccion: google.maps.LatLngBounds;

  /**
   * Derfine la ciudad seleccionada
   */
  @Input() public ciudadSeleccionada: string;

  /**
 * Derfine el departamento seleccionado
 */
  @Input() public departamentoSeleccionado: string;

  /**
   * Variable encargada de manejar el Debouncer
   */
  private _debouncer: Subject<string> = new Subject();



  /**
   * Método donde se inyectan las dependencias
   * @param _modalBuscarDireccionService Variable que permite utilizar el servicio del ModalBuscarDireccion
   */
  constructor(
    private _modalBuscarDireccionService: ModalBuscarDireccionService
  ) { }

  /**
   * Método que se ejecuta cuando cambia los valores del input
   */
  ngOnChanges(): void {
    if (this.boundsRestriccion) {
      this.inicializarValores();
    }
  }

  /**
   * Método que se ejecuta al inciar el componente
   */
  ngOnInit(): void {
  }


  /**
   * Método encargado de inicializar valores
   */
  public inicializarValores(): void {
    this.ciudadSeleccionada = GeneralUtils.normalizarVocalesConSignos(this.ciudadSeleccionada);

    this._debouncer
      .pipe(debounceTime(300))
      .subscribe(() => {
        this._modalBuscarDireccionService.obtenerPrediccionesDireccionConReestriccionBounds(`${this.direccion}, ${this.ciudadSeleccionada}, ${this.departamentoSeleccionado}` || ' ', this.boundsRestriccion).subscribe((resultado) => {
          const predicciones = JSON.parse(resultado.data)
          this.prediccionDirecciones = predicciones?.predictions.filter(prediccion => GeneralUtils.normalizarVocalesConSignos(prediccion?.description).toLocaleLowerCase().includes(this.ciudadSeleccionada.toLocaleLowerCase()))
        })
      })
  }


  /**
   * Método que se encargade obtener la tecla que ha sido presionada y pasarla al Debouncetimer
   */
  public teclaPresionada(): void {
    this._debouncer.next(this.direccion);
  }

  /**
   * Método encargado de buscar las coordenadas del lugar seleccionado y emitirlas al padre
   * @param place_id Id del lugar que se quiere obtener las coordenadas
   */
  public emitirCoordenadas(place_id: string): void {
    this._modalBuscarDireccionService.obtenerCoordenadasPorPlaceId(place_id)
      .subscribe((resultado) => {
        const coordenadas = JSON.parse(resultado.data);
        this.coordenadasDireccion.emit(coordenadas.results[0].geometry.location);
      })
  }
}
