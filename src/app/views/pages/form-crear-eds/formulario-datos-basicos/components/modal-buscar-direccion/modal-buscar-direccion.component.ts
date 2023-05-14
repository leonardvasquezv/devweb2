import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapConfig } from '@core/classes/mapConfig.class';
import { InformacionDeUbicacionEds } from '@core/interfaces/informacionDeUbicacionEds.interface';
import { Loader } from '@googlemaps/js-api-loader';
import { GeneralUtils } from 'src/app/core/utils/general-utils';
import { environment } from 'src/environments/environment';
import { FiltroDireccionesComponent } from '../filtro-direcciones/filtro-direcciones.component';
import { ModalBuscarDireccionService } from './modal-buscar-direccion.service';


@Component({
  selector: 'app-modal-buscar-direccion',
  templateUrl: './modal-buscar-direccion.component.html',
  styleUrls: ['./modal-buscar-direccion.component.scss']
})
export class ModalBuscarDireccionComponent implements OnInit {

  /**
   * Referencia al mapa de Google
   */
  @ViewChild(GoogleMap) mapa: GoogleMap;

  /**
   * Referencia al marcador del mapa
   */
  @ViewChild(MapMarker) marker: google.maps.Marker;

  /**
   * Variable que contiene una referencia al comoponente de filtro de direcciones
   */
  @ViewChild(FiltroDireccionesComponent) filtroDireccionesRef: FiltroDireccionesComponent;

  /**
   * Variable que contiene las opciones del mapa
   */
  public opcionesMapa: google.maps.MapOptions;

  /**
   * Clase que contiene las configuraciones del mapa
   */
  public mapConfig = new MapConfig();

  /**
   * Variable que contiene el zoom en el mapa (Datos de Maquetación)
   */
  public zoom: number = 14;

  /**
   * Maximo zoom del mapa
   */
  public maxZoom: number = 18;

  /**
   * Minimo zoom del mapa
   */
  public minZoom: number = 8;

  /**
   * Ubicación central del mapa
   */
  public center: google.maps.LatLng;

  /**
   * Variable que contiene la dirección que será buscada
   */
  public direccionABuscar: string;

  /**
   * Variable que contiene las opciones del marcador
   */
  public markerOptions: google.maps.MarkerOptions;


  /**
   * Variable que contiene la direccion escogida con el marcador
   */
  public direccion: string;

  /**
   * Variable que contiene la información sobre la ubicación de una EDS
   */
  public informacionUbicacion: InformacionDeUbicacionEds;

  /**
   * Variable que permite el cargue de la API de Google Maps
   */
  private _loader: Loader;

  /**
   * Variable que define el estado de cargue del mapa de google
   */
  public mapaCargado: boolean = false;

  /**
   * Ubicacion de reestriccion
   */
  public ubicacionRestriccion: string = '';

  /**
   * Instacia de restriccion de coordenadas del mapa
   */
  public boundsRestriccion: google.maps.LatLngBounds;

  /**
   * Define la ultima posicionn del marcador
   */
  public lastPosicionMarker: google.maps.LatLng

  /**
 * Define las coordenadas de la direccion
 */
  public coordenadasDireccion: google.maps.LatLng


  /**
   * Metodo donde se inyectan las dependencias
   * @param _modalBuscarDireccionService Variable que permite utilizar el servicio del ModalBuscarDireccion
   * @param MAT_DIALOG_DATA Inyección del servicio de modales
   */
  constructor(
    private _modalBuscarDireccionService: ModalBuscarDireccionService,
    @Inject(MAT_DIALOG_DATA) public data: {
      coordenadas: any,
      direccionEscrita: string,
      departamentoSeleccionado: string,
      ciudadSeleccionada: string
      ubicacionRestriccion: string,
    }
  ) { }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.ubicacionRestriccion = this.data ? this.data.ubicacionRestriccion : '';
    this._cargarApiKey();
  }

  /**
   * Método encargado de cargar la Api key de Google Maps
   */
  private _cargarApiKey(): void {
    this._loader = new Loader({
      apiKey: environment.apiKeyGoogleMaps,
      version: 'weekly',
      libraries: ['geometry']
    });

    this._loader.load().then(() => {
      this.iniciarRestriccionesMapa();
    })
  }



  /**
   * Metodo para incializar la restricción de movimiento del mapa
   */
  public iniciarRestriccionesMapa(): void {
    this.obtenerPlaceIdDepartamentoSeleccionado();
  }

  /**
   * Metodo para obtener el placeId del departamento
   */
  public obtenerPlaceIdDepartamentoSeleccionado(): void {
    this._modalBuscarDireccionService.obtenerPrediccionesDireccion(this.data.departamentoSeleccionado).subscribe((response) => {
      const predicciones = JSON.parse(response.data)
      if (predicciones.predictions && predicciones.predictions.length > 0) {
        const placeId = predicciones.predictions[0].place_id;
        this.obtenerBoundsDepartamento(placeId);
      }
    })
  }

  /**
   * Metodo para obtener los limites bounds del departamento
   * @param placeId del departamento
   */
  public obtenerBoundsDepartamento(placeId: string): void {
    this._modalBuscarDireccionService.obtenerCoordenadasPorPlaceId(placeId).subscribe((results) => {
      const coordenadas = JSON.parse(results.data)
      if (coordenadas.results && coordenadas.results.length > 0) {
        const { southwest, northeast } = coordenadas.results[0].geometry.bounds
        const bounds = new google.maps.LatLngBounds(southwest, northeast);
        this.boundsRestriccion = bounds;
        this.obtenerPlaceIdCiudadSeleccionda();
      }
    })
  }

  /**
   * Metodo para obtener el placeId de la ciudad seleccionada
   */
  public obtenerPlaceIdCiudadSeleccionda(): void {
    const lugar = `${this.data.ciudadSeleccionada}, ${this.data.departamentoSeleccionado}`;
    this._modalBuscarDireccionService.obtenerPrediccionesDireccion(lugar, 'political').subscribe((response) => {
      const predicciones = JSON.parse(response.data)
      if (predicciones.predictions && predicciones.predictions.length > 0) {
        const placeId = predicciones.predictions[0].place_id;
        this.obtenerCoordenadasCiudadSeleccionada(placeId);
      }
    })
  }

  /**
   * Metodo para buscar las coordenadas de la ciudad seleccionada
   * @param placeIdCiudad de la ciudad seleccionada
   */
  public obtenerCoordenadasCiudadSeleccionada(placeIdCiudad: string): void {
    this._modalBuscarDireccionService.obtenerCoordenadasPorPlaceId(placeIdCiudad).subscribe((results) => {
      const coordenadas = JSON.parse(results.data)
      if (coordenadas.results && coordenadas.results.length > 0) {
        const localizacionCiudad = coordenadas.results[0].geometry.location
        this.mapaCargado = true;
        this.iniciarOpcionesMapa(localizacionCiudad);
      }
    })
  }

  /**
   * Método encargado de inicializar las opciones del mapa
   * @param localizacionCiudad de la ciudad
   */
  private iniciarOpcionesMapa(localizacionCiudad: google.maps.LatLng): void {
    this.opcionesMapa = {
      restriction: {
        latLngBounds: this.boundsRestriccion,
        strictBounds: false
      },
      center: localizacionCiudad,
      streetViewControl: false,
      disableDefaultUI: false,
      mapTypeControl: false,
      zoomControl: false,
      scrollwheel: true,
      fullscreenControl: false,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      zoom: this.zoom,
      styles: this.mapConfig.styles
    }



    if (this.data.coordenadas) {
      this.coordenadasDireccion = new google.maps.LatLng({
        lat: this.data.coordenadas.lat,
        lng: this.data.coordenadas.lng
      })

      this.moverMapaACoordenadas(this.coordenadasDireccion);
      this.direccion = this.data.direccionEscrita
    }
  }


  /**
   * Método encargado de mover centro del mapa a las coordenadas dadas
   * @param coordenadas Coordenadas donde se moverá el mapa
   */
  public moverMapaACoordenadas(coordenadas: google.maps.LatLng): void {

    if (this.ubicacionRestriccion) {
      const objetoAux: InformacionDeUbicacionEds = {
        direccion: this.filtroDireccionesRef.direccion,
        latitud: coordenadas.lat.toString(),
        longitud: coordenadas.lng.toString()
      }
      this.informacionUbicacion = objetoAux;
      this.zoom = 15;
      this.mapa?.panTo(coordenadas);
      this.center = coordenadas;
      this.markerOptions = this.mapConfig.configuracionMarker(true, true);
      this.lastPosicionMarker = coordenadas;
    }

  }

  /**
   * Método que optiene la nueva ubicación después de mover el marcador
   */
  public obtenerUbicacionMarcador(): void {
    let posicion: google.maps.LatLng = this.marker.getPosition();
    const latitud = posicion.lat().toString();
    const longitud = posicion.lng().toString();

    this._modalBuscarDireccionService.obtenerDireccionPorCoordenadas(latitud, longitud).subscribe((response) => {
      const direccionSeleccionada = JSON.parse(response.data);
      this.validarUbicacionMarker(posicion, direccionSeleccionada);
    })
  }

  /**
   * Metodo para buscar la direccion del marcador segun su posicion
   * @param posicion del marcador
   */
  public buscarDireccionPorCoordenadas(posicion: google.maps.LatLng): void {
    const latitud = posicion.lat().toString();
    const longitud = posicion.lng().toString();
    this._modalBuscarDireccionService.obtenerDireccionPorCoordenadas(latitud, longitud).subscribe((response) => {
      const direccion = JSON.parse(response.data);
      this.direccion = direccion.results.length > 0 ? direccion.results[0].formatted_address : ''
      const objetoAux: InformacionDeUbicacionEds = {
        direccion: this.direccion,
        longitud,
        latitud
      }
      this.informacionUbicacion = objetoAux;
    })
  }


  /**
 * Metodo para buscar la direccion del marcador segun su posicion
 * @param posicion del marcador
 * @param direccion seleccionada
 */
  public validarUbicacionMarker(posicion: google.maps.LatLng, direccion: any): void {

    const latitud = posicion.lat().toString();
    const longitud = posicion.lng().toString();

    const nombreDireccion = GeneralUtils.normalizarVocalesConSignos(direccion.results[0].formatted_address);
    const municipio = GeneralUtils.normalizarVocalesConSignos(this.data.ciudadSeleccionada);
    const departamento = GeneralUtils.normalizarVocalesConSignos(this.data.departamentoSeleccionado);

    const dentroCiudad: boolean = nombreDireccion.toLocaleLowerCase().includes(municipio.toLocaleLowerCase());
    const dentroDepartamento: boolean = nombreDireccion.toLocaleLowerCase().includes(departamento.toLocaleLowerCase());
    const marcadorDentroCiudad: boolean = this.boundsRestriccion.contains(posicion);

    if (marcadorDentroCiudad && dentroCiudad && dentroDepartamento) {
      this.lastPosicionMarker = posicion;
      this.direccion = direccion.results.length > 0 ? direccion.results[0].formatted_address : '';

      const objetoAux: InformacionDeUbicacionEds = {
        direccion: this.direccion,
        longitud,
        latitud
      }
      this.center = posicion;
      this.informacionUbicacion = objetoAux;

    } else {
      posicion = this.lastPosicionMarker;
      this.lastPosicionMarker = posicion;
      this.markerOptions = {
        ...this.markerOptions,
        position: posicion
      }
      this.center = posicion;
    }

  }
}
