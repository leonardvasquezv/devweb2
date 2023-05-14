import { animate, style, transition, trigger } from "@angular/animations";
import { BreakpointObserver } from "@angular/cdk/layout";
import { TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { Router } from "@angular/router";
import { MapConfig } from "@core/classes/mapConfig.class";
import { EPosicionMapa } from "@core/enum/posicionMapa.enum";
import { ETiposError } from "@core/enum/tipo-error.enum";
import { ObjParam } from "@core/interfaces/base/objParam.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { DataEds } from "@core/interfaces/data-eds.interface";
import { Departamento } from "@core/interfaces/departamento.interface";
import { Municipio } from "@core/interfaces/municipio.interface";
import { EdsModel } from "@core/model/eds.model";
import { PermisosUtils } from '@core/utils/permisos-utils';
import { SortUtils } from '@core/utils/sort-utils';
import { Loader } from '@googlemaps/js-api-loader';
import { TranslateService } from "@ngx-translate/core";
import { Enum } from "@shared/global/enum";
import { UtilsService } from "@shared/services/utils.service";
import { Subscription } from "rxjs";
import { GeneralUtils } from "src/app/core/utils/general-utils";
import { MarkerEds } from "src/app/views/pages/dashboard/georeferenciacion/listar-georeferenciacion/interfaces/marker-eds.interface";
import { environment } from 'src/environments/environment';
import { GestionDocumentalModel } from '../../../gestion-documental/models/gestion-documental.model';
import { ListarGeoreferenciacionModel } from './model/listar-georeferenciacion.model';
@Component({
  selector: "app-listar-georeferenciacion",
  templateUrl: "./listar-georeferenciacion.component.html",
  styleUrls: ["./listar-georeferenciacion.component.scss"],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]
    )
  ]
})
export class ListarGeoreferenciacionComponent implements OnInit, OnDestroy {
  /**
   * Referencia al mapa de google
   */
  @ViewChild(GoogleMap) map: GoogleMap;
  /**
   * Ubicación predeterminada si el navegador no puede determinar la ubicación del usuario
   */
  public ubicacionPredeterminada: google.maps.LatLng;
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
   * Variable que contiene el texto predictivo de la barra de busqueda en el mapa
   */
  public textoPredictivo: string = "";
  /**
   * Variable que contiene la vista en la que se encuentra el usuario
   */
  public mapActiveView: number = 1;
  /**
   * Array que contiene los departamentos registrados en el sistema
   */
  public departamentos: Array<Departamento> = [];
  /**
   * Array que contiene los municipios registrados en el sistema filtrados por departamento
   */
  public municipios: Array<Municipio> = [];
  /**
   * Array que contiene las estaciones de servicio registradas en el sistema
   */
  public estacionesServicio: Array<MarkerEds> = [];
  /**
   * Array que contiene las estaciones de servicio cercanas para ubicar en el mapa
   */
  public estacionesServicioCercanas: Array<MarkerEds> = [];
  /**
   * Objeto que contiene el departamento seleccionado para filtrar el mapa
   */
  public departamentoSeleccionado: Departamento;
  /**
   * Objeto que contiene el municipio seleccionado para filtrar el mapa
   */
  public municipioSeleccionado: Municipio;
  /**
   * Contiene la EDS seleccionada
   */
  public edsSeleccionada: MarkerEds;
  /**
   * Clase con configuraciones del mapa
   */
  public mapConfig = new MapConfig();
  /**
   * Opciones del mapa
   */
  public optionsMap: google.maps.MapOptions;
  /**
   * Ubicación central del mapa
   */
  public center: google.maps.LatLng;
  /**
   * Condicional para definir si se está en la barra de busqueda
   */
  public searchBarSelected: boolean;
  /**
   * Coordenadas del usuario
   */
  public ubicacionUsuario: google.maps.LatLng;
  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /**
   * Variable de tipo Loader que permite el cargue de la API de Google Maps
   */
  private _loader: Loader;

  /**
   * Variable que define el estado de cargue del mapa de google
   */
  public mapaCargado: boolean = false;

  /**
   * Variable que contiene solo una parte de las estaciones cercanas
   */
  public estacionesCercanasReducidas: Array<MarkerEds> = [];

  /**
   * Variable que contiene el mensaje de alerta que se muestra al denegar la ubicación
   */
  public ubicacionDenegada: string = '';

  /**
   * Variable que contiene la referencia a la ventana informativa que está abierta
   */
  public infoWindowAbierto: google.maps.InfoWindow;

  /**
   * Variable que contiene la configuración del marcador del usuario
   */
  public marcadorUsuario: google.maps.MarkerOptions;

  /**
   * Variable que contiene el mensaje de la ubicación del usuario
   */
  public mensajeUbicacionUsuario: string ='';

  /**
   * Variable encargada de decir si el sidebar del mapa está o no desplegado
   */
  public bandera: boolean = true;

  /**
   * Variable encargada de almacenar la respuesta de la comparación de la suscripción del observer de breakpoint
   */
  public resultadoBreakpoint: boolean;

  /**
   * Variable bandera para saber si se limpiaron los filtros de seleccion
   */
  public limpiaFiltros: boolean = false;



  /**
   * Constructor que realiza la inyeccion de los diferentes servicios necesarios
   * @param _utils Servicio para obtener las utilidades
   * @param _breakpointObserver Variable que permite capturar los cambios de ancho en la pantalla
   * @param _router Propiedad para obtener la ruta actual de la página
   * @param _listarGeoreferenciacionModel Modelo para el consumo de datos de georeferenciacion
   * @param _gestionDocumentalModel Modelo de gestion documental
   * @param _edsModel Modelo de eds
   * @param _translateService Servicio de traducciones
   * @param _utilsService utilidades del sistema
   * @param _titleCasePipe Variable que permite utilizar la funcionalidad del Titlecase
   */
  constructor(
    private _utils: UtilsService,
    private _router: Router,
    private _listarGeoreferenciacionModel: ListarGeoreferenciacionModel,
    private _gestionDocumentalModel: GestionDocumentalModel,
    private _edsModel: EdsModel,
    private _translateService: TranslateService,
    private _utilsService: UtilsService,
    private _titleCasePipe: TitleCasePipe,
    private _breakpointObserver: BreakpointObserver
  ) { }

  /**
   * Método para inicializar datos del mapa
   */
  ngOnInit(): void {
    this.establecerTraducciones();
    this._cargarApiKey();
    this._iniciarBreakpointObserver();
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
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
      this.mapaCargado = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ubicacionPredeterminada = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.marcadorUsuario = {
            icon: 'assets/images/svg/pointOnMap.svg'
          }
          this.instanciarOpcionesMapa();
          this.buscarDatosIniciales();
        },
        () => {
          alert(this.ubicacionDenegada);
          this.buscarDatosIniciales();
          this.obtenerEstacionesDeServicio();
          this.searchBarSelected = true;
        });
    })
  }


  /**
   * Obtener posición actual del navegador
   */
  private obtenerPosicionActual(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.ubicacionUsuario = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.obtenerEstacionesDeServicio();
      },
      () => {
        this.obtenerEstacionesDeServicio();
      }, {
      enableHighAccuracy: true
    });
  }
  /**
   * Inicializa los marcadores iniciales
   * @param ubicacionInicial define la ubicacion inicial de donde se sacaran los marcadores cercanos
   */
  public initMarkersIniciales(ubicacionInicial: google.maps.LatLng): void {
    this.estacionesServicioCercanas = this._listarGeoreferenciacionModel.distanciasMasCortas(ubicacionInicial, [...this.estacionesServicio], this.mapConfig, false);
    this.estacionesCercanasReducidas = [...this.estacionesServicioCercanas];
    this.estacionesServicio = [...this.estacionesServicioCercanas];
    this.edsSeleccionada = this.estacionesServicio[0];
    this.instanciarOpcionesMapa(this.escogerUbicacion(this.edsSeleccionada));
    if(this.ubicacionPredeterminada && !this.departamentoSeleccionado && !this.municipioSeleccionado && !this.textoPredictivo){
      this.seleccionarEDS(this.estacionesServicio[0]);
      this.mapActiveView = 2;
    }
    if(this.limpiaFiltros){
      this.mapActiveView = 1;
      this.limpiaFiltros = false;
    }
  }


  /**
   * Inicializar opciones del mapa
   * @param latLng latitud-longitud del centro inicial del mapa, por defecto es la ubicación predeterminada
   */
  private instanciarOpcionesMapa(latLng: google.maps.LatLng = this.ubicacionPredeterminada): void {
    this.optionsMap = {
      center: { lat: latLng.lat(), lng: latLng.lng() },
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
    };
  }

  /**
   * Método para buscar datos iniciales de la pagina
   */
  private buscarDatosIniciales(): void {
    this.obtenerPosicionActual();
    this.obtenerDepartamentos();
  }

  /**
   * Obtiene el listado de estaciones de servicio registradas en el sistema.
   */
  public obtenerEstacionesDeServicio(): void {
    const queryParams: Array<ObjParam> = [
      { campo: "textoPredictivo", valor: this.textoPredictivo },
      {
        campo: "idDepartamento",
        valor: this.departamentoSeleccionado?.idDepartamento || ""
      },
      {
        campo: "idMunicipio",
        valor: this.municipioSeleccionado?.idMunicipio || "",
      },
      {
        campo: "LatitudUsuario",
        valor: this.ubicacionUsuario?.lat() || ""
      },
      {
        campo: "LongitudUsuario",
        valor: this.ubicacionUsuario?.lng() || ""
      }
    ];
    const suscripcionEds = this._listarGeoreferenciacionModel.obtenerEds(queryParams).subscribe(
      (response: ResponseWebApi) => {
        if (response.status) {
          this.estacionesServicio = response.data;

          if(!(this.departamentoSeleccionado && this.estacionesServicio.length === 0)) this.initMarkersIniciales(this.ubicacionUsuario);

        } else {
          this._utils.procesarMessageWebApi(response.message, ETiposError.error);
        }
      },
      (error) => {
        this._utils.procesarMessageWebApi(error, Enum.tipoError.error);
      }
    );
    this._subscriptions.add(suscripcionEds);
  }

  /**
   * Obtiene los departamentos registradas en el sistema.
   */
  private obtenerDepartamentos(): void {
    const suscripcionDepartamentos = this._listarGeoreferenciacionModel.obtenerDepartamentos().subscribe(
      (response: ResponseWebApi) => {
        if (response.status) {
          this.departamentos = response.data;
          this.departamentos = SortUtils.getSortJsonV2(this.departamentos,'nombre','asc');
        } else {
          this._utils.procesarMessageWebApi(response.message, ETiposError.error);
        }
      },
      (error) => {
        this._utils.procesarMessageWebApi(error, Enum.tipoError.error);
      }
    );
    this._subscriptions.add(suscripcionDepartamentos);
  }
  /**
   * Obtiene los municipios a partir de un departamento.
   * @param idDepartamento El id del departamento para filtrar los municipios
   */
  public obtenerMunicipios(idDepartamento: number): void {
    const queryParams: Array<ObjParam> = [{
      campo: 'idDepartamento',
      valor: idDepartamento
    }]
    const suscripcionMunicipios = this._listarGeoreferenciacionModel.obtenerMunicipios(queryParams).subscribe(
      (response: ResponseWebApi) => {
        if (response.status) {
          this.municipios = response.data;
          this.municipios = SortUtils.getSortJsonV2(this.municipios,'nombre','asc');
          
        } else {
          this._utils.procesarMessageWebApi(response.message, ETiposError.error);
        }
      },
      (error) => {
        this._utils.procesarMessageWebApi(error, Enum.tipoError.error);
      }
    );
    this._subscriptions.add(suscripcionMunicipios);
  }

  /**
   * Filtra el Mapa por Departamento.
   * @param departamento contiene el departamento seleccionado
   */
  public filtrarPorDepartamento(departamento: Departamento): void {
    this.departamentoSeleccionado = departamento
    this.municipioSeleccionado = null;
    this.obtenerEstacionesDeServicio();
  }
  /**
   * Filtra el Mapa por Municipio.
   * @param municipio contiene el municipio seleccionado
   */
  public filtrarPorMunicipio(municipio: Municipio): void {
    this.municipioSeleccionado = municipio;
    this.obtenerEstacionesDeServicio();
  }

  /**
   * Método para cargar la info de la eds seleccionada y sus EDS cercanas y moverla en el mapa, si la EDS es nula es porque no hay estaciones cercanas
   * @param infoEdsSeleccionada Eds seleccionada de la lista
   */
  public seleccionarEDS(infoEdsSeleccionada: MarkerEds): void {
    if (infoEdsSeleccionada) {
      this.edsSeleccionada = this.estacionesServicio.find(
        (eds) => eds.idEds === infoEdsSeleccionada.idEds
      );

      this.zoom = 15;
      this.map.panTo(GeneralUtils.cloneObject({
        lat: this.edsSeleccionada.latitud,
        lng: this.edsSeleccionada.longitud
      }));

      const latLngEdsSeleccionada = new google.maps.LatLng(+this.edsSeleccionada.latitud, +this.edsSeleccionada.longitud);

      this._listarGeoreferenciacionModel.obtenerEds([{
        campo: "LatitudUsuario",
        valor: latLngEdsSeleccionada.lat() || ""
      },
      {
        campo: "LongitudUsuario",
        valor: latLngEdsSeleccionada.lng() || ""
      }]).subscribe(response => {
        this.estacionesServicio = response.data;
        this.estacionesServicioCercanas = this._listarGeoreferenciacionModel.distanciasMasCortas(latLngEdsSeleccionada, response.data, this.mapConfig, true);
        this.estacionesCercanasReducidas = [...this.estacionesServicioCercanas];
      })
      this.searchBarSelected = true;
    } else {
      this.estacionesServicioCercanas = []
      this.estacionesCercanasReducidas = []
    }
  }

  /**
   * Método que toma el evento del componente de busqueda, a partir del cual se selecciona la EDS
   * @param event Contiene el evento del texto predictivo
   */
  public obtenerTextoPredictivo(event: Array<ObjParam>): void {
    this.textoPredictivo = event[1].valor;
    this.obtenerEstacionesDeServicio();
    this.mapActiveView = 1;
  }

  /**
   * Limpia el filtro de texto predictivo.
   */
  public limpiarDepartamentoSeleccionado(): void {
    this.limpiaFiltros = true;
    this.departamentoSeleccionado = null;
    this.municipioSeleccionado = null;
    this.municipios = [];
    this.obtenerEstacionesDeServicio();
  }

  /**
   * Método para redireccionar a gestión documental
   * @param edsSeleccionada Eds seleccionada
   */
  public redireccionarGestionDocumental(edsSeleccionada: DataEds): void {
    this._gestionDocumentalModel.redireccionarEds(edsSeleccionada.idEds);
    this._edsModel.selecionarEds(edsSeleccionada);
    const url = '/home/gestion-documental';
    this._utilsService.getPaginaUrl(url).then(pagina => {
      if (!!pagina?.id) {
        PermisosUtils.GuardarPagina(pagina?.id);
        this._router.navigate([url]);
        localStorage.setItem('eds', JSON.stringify(this.edsSeleccionada));
        localStorage.removeItem('indexProceso')
      }
    });
  }


  /**
   * Metodo encargado de cargar las traducciones
   */
  public establecerTraducciones(): void {
    this._translateService.get(this.ubicacionDenegada || 'TITULOS.UBICACION_DENEGADA').subscribe((text: string) => this.ubicacionDenegada = text);
    this._translateService.get(this.mensajeUbicacionUsuario || 'TITULOS.MI_UBICACION').subscribe((text: string) => this.mensajeUbicacionUsuario = text);
  }

  /**
   * Método encargado de mostrar un mensaje sobre un marcador al cual se le posiciona el cursor encima
   * @param texto Texto que aparecerá en el pop-up del marcador
   * @param marcador Referencia al marcador seleccionado
   */
  public mostrarMensajeMarcador(texto: string,marcador: MapMarker): void{
    const mensajeTitleCase: string = this._titleCasePipe.transform(texto);
    const contenido: string =
    '<div id="content">' +
      `<span id="firstHeading" class="firstHeading">${mensajeTitleCase}</span>` +
    "</div>";

    const infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow({
      content: contenido,
    })

    this.infoWindowAbierto = infoWindow;
    infoWindow.open(null,marcador.marker);
  }

  /**
   * Método encargado de cerrar la ventana informativa de un maracador
   */
  public cerrarNombreEds(): void{
    this.infoWindowAbierto.close();
    this.infoWindowAbierto = null;
  }

  /**
   * Método para saber que ubicación se va a devolver
   * @param edsSeleccionada Eds de la cual se tomará su ubicación para centrar el mapa
   * @returns La ubicación hacia la que se centrará el mapa
   */
  public escogerUbicacion(edsSeleccionada: MarkerEds): google.maps.LatLng {
    return edsSeleccionada ? new google.maps.LatLng(+edsSeleccionada.latitud,+edsSeleccionada.longitud) : new google.maps.LatLng(EPosicionMapa.latitudDefault, EPosicionMapa.longitudDefault)
  }


  /**
   * Método encargado de inicializar y realizar la suscripción al observer de breakpoint
   */
  private _iniciarBreakpointObserver(): void{
    const breakpointSuscription: Subscription = this._breakpointObserver.observe('(max-width: 430px)').subscribe((res) => {
      this.resultadoBreakpoint= res.matches;
    })
    this._subscriptions.add(breakpointSuscription);
  }

  /**
   * Método encargado de ocultar o mostrar el slide
   */
  public ocultarSlide(): void{

    if(this.bandera == true){
      document.getElementById('barra-lateral-mapa').classList.add('mostrar-barra');
      document.getElementById('boton-desplegable').classList.add('boton-desplegable-rotado');
      this.bandera = false;
    }else if(this.bandera == false){
      document.getElementById('barra-lateral-mapa').classList.remove('mostrar-barra');
      document.getElementById('boton-desplegable').classList.remove('boton-desplegable-rotado');
      this.bandera = true;
    }
    


  }

  /**
   * Método para validar la ancho de la pantalla
   */
  public toggleSearchBarSelected(): void {
    if (!this.resultadoBreakpoint) {
      this.searchBarSelected = false;
      document.getElementById('barra-lateral-mapa').classList.remove('mostrar-barra');
      document.getElementById('boton-desplegable').classList.add('mostrar-barra');
      document.getElementById('boton-desplegable').classList.add('boton-desplegable');
    }else{
      this.searchBarSelected = true;
      document.getElementById('boton-desplegable').classList.remove('mostrar-barra');
    }
  }
}
