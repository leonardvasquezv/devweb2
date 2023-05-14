import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { EProceso } from '@core/enum/proceso.enum';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETipo } from '@core/enum/tipo.enum';
import { ETiposUsuarios } from '@core/enum/tipoUsuario.enum';
import { Notificacion } from '@core/interfaces/base/notificacion.interface';
import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjPage, pageDefault } from '@core/interfaces/base/objPage.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { DataEds } from '@core/interfaces/data-eds.interface';
import { Documento } from '@core/interfaces/documento.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { Proceso } from '@core/interfaces/proceso.interface';
import { EdsModel } from '@core/model/eds.model';
import { InitModel } from '@core/model/init.model';
import { NotificacionModel } from '@core/model/notificaciones.model';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { FiltrosUtils } from '@core/utils/filtros-utils';
import { GeneralUtils } from '@core/utils/general-utils';
import { CheckPermissionInit } from '@shared/components/check-permission/check-permission-init';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { ObjLoginUser } from '@shared/models/objLoginUser.model';
import { UtilsService } from '@shared/services/utils.service';

import { ajustesTablas, ObjTabla } from '@core/interfaces/base/objTabla.interface';
import { SortUtils } from '@core/utils/sort-utils';
import { GestionDocumentalModel } from '../../models/gestion-documental.model';
import { CargarArchivoModalComponent } from '../cargar-archivo-modal/cargar-archivo-modal.component';
import CrearProcesoModalComponent from '../crear-proceso-modal/crear-proceso-modal.component';
import { HistorialModalComponent } from '../historial-modal/historial-modal.component';
import { ModalVerResultadosComponent } from '../modal-ver-resultados/modal-ver-resultados.component';

@Component({
  selector: 'app-tabs-proceso',
  templateUrl: './tabs-proceso.component.html',
  styleUrls: ['./tabs-proceso.component.scss']
})
export class TabsProcesoComponent extends CheckPermissionInit implements OnInit, OnDestroy {
  /**
  * Input que establece los inputs en modo consulta
  */
  @Input() modoConsulta: boolean = false;

  /**
   * Referencia al grupo de tabs
   */
  @ViewChild("tabGroup", { static: false }) tabGroup: MatTabGroup;
  
  /**
   * Variable que almacena el id del tipo de usuario administrador
   */
  public idAdministrador: number = ETiposUsuarios.administrador 

  /**
  * Usuario autenticado en el sistema
  */
  public userIdentity: ObjLoginUser;

  /**
   * Array de procesos
   */
  public procesos: Proceso[];
  /**
  * Array de EDS's
  */
  public estacionesServicio: DataEds[];
  /**
   * EDS seleccionada para ver sus documentos
   */
  public edsSeleccionada: DataEds;
  /**
   * Notificacion seleccionada para ver el documento
   */
  public notificacionSeleccionada: Notificacion;
  /**
   * Notificacion que haya sido redireccionada
   */
  public notificacionRedireccionada: boolean = true;
  /**
   * Proceso actual a la hora de elegir EDS
   */
  public procesoActual: Proceso;
  /**
   * EDS que haya sido redireccionada desde dasboard hacia gestion documental
   */
  public edsRedireccionada: boolean;
  /**
   * Limite de paginas en la tabla
   */
  public limitPage: number;
  /**
  * Opcion del limitador por pagina
  */
  public limitOptions: number[];
  /**
 * Variable para manaejar el filtro por categoria
 */
  public TipoDeDocumentos: Object[];
  /**
   * Array con las categorias tipo documento
   */
  public categoriaTipoDocumento: Array<ObjParam>;
  /**
   * Array que contiene los documentos que aparecen en la tabla
   */
  public documentos: Documento[];
  /**
 * Establece los parametros unificados de consulta
 */
  public queryParams: Array<ObjParam> = [];
  /**
   * Establece si el proceso tiene tipos
   */
  public hasTipos: boolean = false;
  /**
   * Variable para manejar el listado de los tipos de documentos que aparecen en el filtro
   */
  public listaTipoDocumentos: Array<TipoDetalle>;
  /**
   * Establece los parametros de un proceso con una EDS
   */
  public parametrosEdsProceso: Array<ObjParam>;
  /**
   * Establece los parametros del componente de filtrado
   */
  public parametrosFiltros: Array<ObjParam> = [];
  /**
 *  Instancia de la clase Subscription para guardar los subscriptions
 */
  private _subscriptions = new Subscription();
  /**
   * Array de filtros habilitados para la tabla
   */
  public arrayFiltros: Array<ObjFiltro> = [];

  /**
   * Array de criterios de filtros seleccionados
   */
  public arrayCriteriosFiltros: Array<ObjParam> = [];
  
  /**
   * Array de criterios de paginado
   */
  public parametrosPaginado: Array<ObjParam> = [];  
  
  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage = pageDefault;

  /**
   * Define el modo de visualizacion para las columnas de la tabla
   */
  public ColumnMode = ColumnMode;

  /**
   * Control del campo eds
   */
  public edsForm: FormControl;
  /**
   * Define las opciones filtradas para el campo autocomplete de la selecion de eds
   */
  public OpcionesFiltradoEds: Observable<DataEds[]>;

  /**
   * Variable que almace el proceso en el que se encuentre
   */
  public procesoSeleccionado: number;

  /**
   * Variable que almacena los enumerables proceso
   */
  public EProceso = EProceso
  /**
   * Bandera que se activa cuando entra por primera vez al seleccionar tab
   */
  private _banderaEntraTab = false;
  /**
   * Variable que define texto predictivo de documento cunado se redirecciona de una notificación
   */
  public txtPredictivoDocumentoNotificacion: string;

  /**
   * Propiedad que maneja el nav activo por defecto en primer nivel
   */
  public navDefault = 1;
  /**
   * Propiedad que maneja el sub nav activo en el componente
   */
  public subNav = this.navDefault;
  
  /*
   * Variable que contiene medidas y tamaño de las tablas
   */
  public medidasTabla: ObjTabla;

  /**
   * Método para inyectar dependencias
   * @param _gestionDocumentalModel Modelo gestion documental
   * @param _matDialog Define los atributos y las propiedades de los modales
   * @param _edsModel Modelo de eds
   * @param _notificacionModel modelo de notificaciones
   * @param _router Servicio para navegar entre paginas
   * @param _translateService inyeccion de metodos de traduccion
   * @param _utilService Servicio de utilidades
   * @param _tipoParametrizacionModel Modelo de tipo de parametrizacion
   * @param _initModel inyeccion de modelo de inicialización
   */
  constructor(
    private _gestionDocumentalModel: GestionDocumentalModel,
    private _matDialog: MatDialog,
    private _edsModel: EdsModel,
    private _notificacionModel: NotificacionModel,
    private _router: Router,
    private _translateService: TranslateService,
    private _utilService: UtilsService,
    private _tipoParametrizacionModel: TipoParametrizacionModel,
    private _initModel: InitModel
  ) { 
    super();
  }

  /**
   * Metodo que se ejecuta al empezar el componente
   */
  ngOnInit(): void {
    this._utilService.setBreadCrumb(null ,null, false, this._translateService.instant('BOTONES.GESTION_DOCUMENTAL'));
    this.medidasTabla = ajustesTablas;
    this._obtenerDatosIniciales();
  }
  
  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._gestionDocumentalModel.cleanAllProcesosList();
    this._edsModel.cleanAllEdsList();
    this._gestionDocumentalModel.cleanAllDocumentosList();
    this._gestionDocumentalModel.cleanEdsRedireccionada();
    this._subscriptions.unsubscribe();
    this._notificacionModel.cleanNotificacionSeleccionada();
  }

  /**
   * Get utilizado para obtener el id del proceso seleccionado
   */
  get idProceso() {
    return +localStorage.getItem('idProceso');
  }

  /**
   * Get utilizado para obtener el id de la eds seleccionada
   */
  get idEds() {
    return +localStorage.getItem('idEds');
  }

  /**
   * Get utilizado para obtener tiene tipos
   */
  get tieneTipos() {
    return +localStorage.getItem('tieneTipos');
  }

  /**
   * Get utilizado para obtener la eds seleccionada
   */
  get eds() {
    return JSON.parse(localStorage.getItem('eds'));
  }

  /**
   * Get utilizado para validar que el tipo de usuario autenticado
   */
  get usuarioEsAdministrador(){
    return this.userIdentity?.idTipoUsuario == this.idAdministrador ? true : false 
  }

  /**
   * Método utilizado para obtener los datos del userIdentity
   */
  public cargarUserIdentity(): void {
    const subscribcionUserEntity=this._initModel.userIdentity$.subscribe(user => {
      if (!!user) {
        this.userIdentity = GeneralUtils.cloneObject(user)
      }
    });
    this._subscriptions.add(subscribcionUserEntity)
  }

  /**
   * Metodo para otener los datos iniciales
   */
  private _obtenerDatosIniciales(): void {
    this.cargarUserIdentity();
    this.obtenerListadoTipoDocumentos();
    this.subscripcionDocumentos();
    this.subscripcionMetadataDocumentos();
    this.suscribirProcesos();
    this._obtenerEds();
    this.initDataProcesos();
    this.suscribirEdsSeleccionada();
    this._edsSeleccionarAutocomplete();
  }

  /**
   * Metodo para filtrar la lista desplegable
   */
  private _edsSeleccionarAutocomplete(): void {

    this.edsForm = new FormControl();
    this.OpcionesFiltradoEds = this.edsForm.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filtrarEds(name as string) : GeneralUtils.cloneObject(this.estacionesServicio);

      })
    );
  }

  /**
   * Función para filtrar Eds Del Listado
   * @param nombre nombre de la eds que se está filtrando
   * @returns array filtro
   */
  private _filtrarEds(nombre: string): DataEds[] {
    const filterValue = nombre.toLowerCase();
    return this.estacionesServicio.filter(eds => eds.nombre.toLowerCase().includes(filterValue));
  }
  /**
   * Método para iniciar data gestion documental
   */
  public initDataProcesos(): void {
    this.limitPage = 5;
    this.limitOptions = [5]
    this.armarFiltros();
    this.edsRedireccionada = false
  }
  /**
   * Método para armar filtros de tabla
   */
  public armarFiltros(): void {
    const filtrosTemp = FiltrosUtils.armarFiltrosGenericos(false, false);
    this.arrayFiltros = GeneralUtils.cloneObject(filtrosTemp);
    this.arrayFiltros = [
      ...this.arrayFiltros,
      FiltrosUtils.armaFiltroFechaPosteriorAnterior('Fecha de vencimiento', 'rangoFechaVencimiento')
    ]
    this.arrayCriteriosFiltros=[]
    if (this.idProceso === EProceso.ambiental) {
      this._tipoParametrizacionModel.obtenerTiposParametrizacion([{ campo: 'idTipo', valor: ETipo.tipoDocumentosTipo }])
        .subscribe(({ data }: ResponseWebApi) => {
          if (data) {
            this.arrayFiltros = [...this.arrayFiltros, FiltrosUtils.armaFiltroDinamico(data, 'Tipo de documento', 'idTipoDocumento', 'idTipoDetalle', 'nombre', true)];
          }
        });
    }
  }
  /**
   * Metodo para obtener el listado de tipos de parametrizacion
   */
  private obtenerListadoTipoDocumentos(): void {
    this._tipoParametrizacionModel.obtenerTiposParametrizacion();
    const criterios = [{ campo: 'idTipo', valor: ETipo.tipoDocumentosTipo }];
    const suscripcionTiposDocumentos: Subscription =
      this._tipoParametrizacionModel.obtenerTiposParametrizacion(criterios).subscribe(({ data }: ResponseWebApi) => {
        this.listaTipoDocumentos = GeneralUtils.cloneObject(data);
      });

    this._subscriptions.add(suscripcionTiposDocumentos);
  }

  /**
   * Método para obtener subscripcion a las eds
   */
  private _obtenerEds(): void {
    this._edsModel.obtenerEdsPorCriterios([{ campo: 'EstadoRegistro', valor: 'A' }]);
    const subscripcionEds = this._edsModel.entities$.subscribe((eds: Array<DataEds>) => {
      if (eds.length > 0) {
        {
          this.estacionesServicio = GeneralUtils.cloneObject(SortUtils.getSortJsonV2(eds,'nombre','asc'));
          this._edsSeleccionarAutocomplete()
        }
        if (this.edsSeleccionada && this.procesos.length > 0) {

          if (!this.existeInformacionLocal()) {
            this.seleccionarProceso(this.procesos[0]);
            this.seleccionarEds(this.edsSeleccionada);
            this.edsForm.patchValue(this.edsSeleccionada);
          }
        }
        this.validacionNotificacion();
      }

    });
    this._subscriptions.add(subscripcionEds);
  }

  /**
   * Método utilizado para validar la existencia de data en el localStorage
   * @returns existencia de data
   */
  private existeInformacionLocal(): boolean {
    let indexProceso: number = (+localStorage.getItem('indexProceso'))
    let idEds: number = (+localStorage.getItem('idEds'))
    return (!!indexProceso && !!idEds) ? true : false
  }

  /**
   * Método para obtener suscripción de la eds redireccionada
   */
  public suscribirEdsSeleccionada(): void {
    this._edsModel.cleanOneEds();
    if (!!this.eds && this.eds.idEds) this._edsModel.selecionarEds(this.eds);
    const subscripcionEdsSeleccionada = this._edsModel.edsSeleccionada$.subscribe(
      (eds: DataEds) => {
        this.edsSeleccionada = GeneralUtils.cloneObject(eds);
        if (this.edsSeleccionada) this.edsRedireccionada = true;
      }
    )
    this._subscriptions.add(subscripcionEdsSeleccionada);
  }
  /**
   * Método para obtener susbcripcion de la notificacion redireccionada
   */
  public suscribirNotificacionSeleccionada(): void {
    const subscripcionNotificacionSeleccionada = this._notificacionModel.notificacionSeleccionada$.subscribe(
      (notificacion: Notificacion) => {
        if (!!notificacion ) {
          if (this.notificacionSeleccionada?.idNotificacion!==notificacion.idNotificacion ) {
            
            this.notificacionSeleccionada = GeneralUtils.cloneObject(notificacion);
            this.notificacionRedireccionada=true;
          }else{
            this.notificacionRedireccionada=false;
          }
          if (this.notificacionSeleccionada && this.notificacionRedireccionada) {
            this.notificacionRedireccionada = true;
            this.validacionNotificacion();
          }
        }
      }
    )
    this._subscriptions.add(subscripcionNotificacionSeleccionada);
  }

  /**
   * Validar si llega una notificacion
   */
  public validacionNotificacion(): void {
    if (this.notificacionSeleccionada && this.procesos?.length > 0 && this.estacionesServicio?.length > 0) {
      const procesoNotificacion = this.procesos.find((proceso) => {
        return proceso.idProceso == this.notificacionSeleccionada.detalleContenido.idProceso
      })
      const procesoNotificacionindex = this.procesos.findIndex((proceso) => {
        return proceso.idProceso == this.notificacionSeleccionada.detalleContenido.idProceso
      })
      this.seleccionarProceso(procesoNotificacion);
      const edsNotificacion = this.estacionesServicio.find((eds) => {
        return eds.idEds == this.notificacionSeleccionada.detalleContenido.idEds
      })
      setTimeout(() => {
        this.edsForm.patchValue(edsNotificacion);
        this.txtPredictivoDocumentoNotificacion = this.notificacionSeleccionada.detalleContenido.nombreDocumento;

      }, 1);
      this.procesoSeleccionado = procesoNotificacionindex;

    }
  }

  /**
   * Método para obtener Subscripcion  de procesos
   */
  public suscribirProcesos(): void {
    this._gestionDocumentalModel.obtenerAllProcesos([{ campo: 'estadoRegistro', valor: 'A' }]);
    const subscripcionProcesos = this._gestionDocumentalModel.entitiesProcesos$.subscribe(
      (procesos: Array<Proceso>) => {
        this.procesos = GeneralUtils.cloneObject(procesos.filter(
          (proceso) => proceso.estadoRegistro === 'A'
        ));
        this.procesos.forEach(x => {
          x.tieneTipos = Boolean(x.tieneTipos || false)
        });
        this.procesoActual = this.procesos[0];
        this.suscribirNotificacionSeleccionada();
      }
    )
    this._subscriptions.add(subscripcionProcesos);
  }

  /**
   * Metodo que escucha los cambios del valor del campo del listado de eds
   * @param event Evento del input
   */
  public escucharCambiosEdsSeleccion(event: DataEds): void {
    if (!!event && typeof (event) === 'object') {
      this.edsSeleccionada = event;
      if (this.idProceso == this.procesoActual.idProceso || !this.existeInformacionLocal()) {
        this.seleccionarEds(this.edsSeleccionada);
        localStorage.setItem('eds', JSON.stringify(this.edsSeleccionada));
      }
    }
  }

  /**
   * Método utilizado la existencia de un proceso en el localStorage
   */
  private validarProceso(): void {
    let indexProceso: number = (+localStorage.getItem('indexProceso'))
    let idEds: number = (+localStorage.getItem('idEds'))
    let edsLocaleStorage = JSON.parse(localStorage.getItem('eds'))

    if ((!!indexProceso ||indexProceso==0) && !!idEds) {
      this.procesoSeleccionado = indexProceso
      this.edsForm.patchValue(edsLocaleStorage)
    }

  }

  /**
   * Método para seleccionar El proceso
   * @param proceso Proceso actual
   */
  public seleccionarProceso(proceso: Proceso): void {
    this.procesoActual = proceso;
  }

  /**
   * Método para seleccionar EDS y poblar el array de documentos
   * @param eds objeto de eds seleccionada
   */
  public seleccionarEds(eds?: DataEds): void {
    if (eds) { this.edsSeleccionada = eds }
    this.parametrosEdsProceso = [
      { campo: 'idEds', valor: this.edsSeleccionada?.idEds },
      { campo: 'idProceso', valor: this.procesoActual.idProceso },
      { campo: 'estadoRegistro', valor: 'A' }
    ]
    localStorage.setItem('idEds', JSON.stringify(this.edsSeleccionada?.idEds));
    if (this.pageTable &&this.pageTable?.pageNumber) {
      this.pageTable.pageNumber=0;
    }
    this.parametrosPaginado = GeneralUtils.setPaginacion(this.pageTable);
    this.obtenerDocumentos();
  }
  
  /**
   * Método para escuchar Los cambios del paginado del filtro
   * @param pagina filtro pagina
   * @param pageSize tamaño
   */
  public escuchaEventoTamanioPagina(pagina = null, pageSize = null):void{
    if ((pagina!==null &&this.pageTable.pageNumber===pagina.offset)) {
      return
    }  
    if ((pageSize!==null && this.pageTable.size===pageSize)) {
      return
    }
    this.pageTable.pageNumber = pagina ? pagina.offset : 0;
    this.pageTable.size = pageSize ? pageSize : this.pageTable.size;
    this.parametrosPaginado = GeneralUtils.setPaginacion(this.pageTable);
    if (!!pagina ||!!pageSize) {
      this.obtenerDocumentos()
    }
  }


  /**
   * Método para obtener el listado de documentos a partir de unos parametros
   */
  public obtenerDocumentos(): void {
    let criteriosFinal = this.arrayCriteriosFiltros.concat(this.parametrosPaginado);

    criteriosFinal = [...criteriosFinal, ...this.parametrosEdsProceso != null ? this.parametrosEdsProceso : []];
    this._gestionDocumentalModel.obtenerAllDocumentos(criteriosFinal);
  }
  
  /**
   * Subscripción a cambios en el store de los metadatos de los documentos 
   */
  public subscripcionMetadataDocumentos():void{
    const metadataSuscripcion: Subscription = this._gestionDocumentalModel.metadataDocumentos$.subscribe(meta => {
      this.pageTable.totalElements = !!meta ? this.pageTable.totalElements = meta.totalElements : null;
    });
    this._subscriptions.add(metadataSuscripcion);
  }
  
  /**
   * Subscripción a cambios en el store de los documentos 
   */
  public subscripcionDocumentos():void{
    const vinculacionSuscripcion: Subscription = this._gestionDocumentalModel.entitiesDocumentos$.subscribe(response => {
      if (!!response) {
        if (response.length > 0) {
          this.documentos = GeneralUtils.cloneObject(response);
        }
      }
    });
    this._subscriptions.add(vinculacionSuscripcion);
  }

  /**
   * Método para limpiar data una vez se cambie de tab, no se limpia la EDS
   * ni los documentos en el caso que se mantenga la EDS redireccionada en el caso que haya
   * @param event Evento que contiene el tab al que fue cambiado
   */
  public cambiarTab(event: any): void {
    this.seleccionarProceso(this.procesos[event.index])

    if (this.edsRedireccionada) {
      this.seleccionarEds()
      this.edsRedireccionada = false
    } 
    this.hasTipos = false;
    this.parametrosFiltros = [];
    this.parametrosEdsProceso = [];
    this.queryParams = [];
    this.txtPredictivoDocumentoNotificacion = '';
    this.pageTable.pageNumber = 0;

    if (this._banderaEntraTab) {
      if (this.idProceso !== this.procesos[event.index].idProceso) {
        localStorage.setItem('indexProceso', JSON.stringify(event.index));
        localStorage.setItem('idProceso', JSON.stringify(this.procesos[event.index].idProceso));
        localStorage.setItem('proceso', JSON.stringify(this.procesos[event.index]));
        localStorage.setItem('tieneTipos', JSON.stringify(this.procesos[event.index].tieneTipos ? 1 : 0));
      }
    } else {
      this._banderaEntraTab = true;
    }

    this.validarProceso();
    this.armarFiltros();
  }

  /**
   * Metodo usado para obtener los filtros seleccionados y
   * utilizarlos como criterios de busqueda
   * @param event Eventos del filtro
   */
  public recibeFiltrosDinamico(event: any): void {
    this.parametrosFiltros = []
    const filtro = event.filtros;
    this.arrayCriteriosFiltros = this._obtenerFiltros(filtro);
    this.pageTable.pageNumber = 0;
    this.obtenerDocumentos();
  }

  /**
   * Metodo utilizado para obtener los filtros seleccionados
   * @param filtro enviados
   * @returns array con los filtros seleccionados
   */
  private _obtenerFiltros(filtro: Array<ObjFiltro>): Array<ObjParam> {
    let criterios: Array<ObjParam> = [];
    filtro.forEach(item => {
      switch (item.nombreApi) {
        case 'textoPredictivo': {
          criterios = FiltrosUtils.obtenerCriteriosTextoPredictivo(item, criterios);
          break;
        }
        case 'idTipoDocumento': {
          criterios = FiltrosUtils.obtenerCriteriosDinamico(item, criterios, 'idTipoDocumento');
          break;
        }
        case 'rangoFechaVencimiento': {
          criterios = FiltrosUtils.obtenerCriteriosRangoFechas(item, criterios, 'fechaInicioVencimiento', 'fechaFinVencimiento');
          break;
        }
      }
    });
    return criterios;
  }

  /**
   * Método encargado de abrir el modal con los resultados de una evaluación
   * @param documento Documento al cual se le está revisando la evaluación
   */
  public abrirModalVerResultados(documento: Documento): void {
    this._matDialog.open(ModalVerResultadosComponent, {
      data: {
        documento
      },
      panelClass: 'modal-ver-resultados'
    })
  }

  /**
   * Método para abrir modal de Cargar Archivo desde las opciones dependiendo del documento seleccionado
   * @param documento Documento al cual se le desea cargar archivo, ver alertas, y fecha de vencimiento
   */
  public OpenModalCargarArchivo(documento: Documento): void {
    const dialogRef = this._matDialog.open(CargarArchivoModalComponent, {
      data: documento,
      id: 'modal-cargar-archivo',
    });
    const subs: Subscription = dialogRef.afterClosed().subscribe(subs => {
      if (subs) this.obtenerDocumentos();
    });
    this._subscriptions.add(subs);
  }

  /**
   * Método para abrir modal de Historial
   * @param documento objeto al cual se le desea ver el historial de archivos cargados
   */
  public OpenModalHistorial(documento: Documento): void {
    const dialogRef = this._matDialog.open(HistorialModalComponent, {
      data: documento,
      panelClass: 'modal-confirmacion',
      id: 'model-crear-proceso'
    });
  }

  /**
   *  Método que redirecciona a la vista de crear documento y dispara la acción que envía la eds y el proceso actual
   */
  public botonCrearDocumento(): void {
    this._gestionDocumentalModel.redireccionarEdsProceso(this.edsSeleccionada, this.procesoActual)
    this._router.navigate([
      'home/gestion-documental/crear-documento'
    ]);
    if (!!!localStorage.getItem('idProceso')) {
      localStorage.setItem('indexProceso', JSON.stringify(0));
      localStorage.setItem('idProceso', JSON.stringify(this.procesos[0].idProceso));
      localStorage.setItem('proceso', JSON.stringify(this.procesos[0]));
    }
  }

  /**
   * Abrir modal de confirmación para la creacion de la EDS
   */
  public OpenModelCrearProceso(): void {
    this._matDialog.open(CrearProcesoModalComponent, {
      panelClass: 'modal-confirmacion',
      id: 'model-crear-proceso'
    });

  }

  /**
   * Método para descargar archivo
   * @param urlArchivo objeto  de tipo archivo donde de va tomar la url a redireccionar
   */
  public descargarArchivo(urlArchivo: string): void {
    window.open(urlArchivo, '_blank');
  }

  /**
   * Metodo para eliminar archivo
   * @param idDocumento seleccionado
   */
  public esEliminarArchivo(idDocumento: number): void {
    this._modalTipos('TITULOS.CONFIRMAR_ELIMINAR', '15').afterClosed().subscribe((result) => {
      if (!!result) {
        this._gestionDocumentalModel.eliminarArchivoDocumento(idDocumento).subscribe(({ message, status }: ResponseWebApi) => {
          if (status) this.obtenerDocumentos();
          this._utilService.procesarMessageWebApi(message, ETiposError.correcto);
        }, (err) =>
          this._utilService.procesarMessageWebApi(this._translateService.instant('TITULOS.ERROR_INESPERADO'), ETiposError.error));
      }
    });
  }

  /**
   * Metodo generico para modal tipo
   * @param descripcion a mostrar
   * @param icon a mostrar
   * @returns Respuesta matdialog
   */
  private _modalTipos(descripcion: string, icon: string): MatDialogRef<ModalTiposComponent> {
    const matDialog = this._matDialog.open(ModalTiposComponent, {
      data: {
        descripcion: this._translateService.instant(descripcion),
        icon,
        txtButton1: this._translateService.instant('BOTONES.CONFIRMAR'),
        txtButton2: this._translateService.instant('BOTONES.CANCELAR'),
      },
      panelClass: 'modal-confirmacion',
    });
    return matDialog;

  }

  /**
   * Muestra nombre de eds en el filtro de autoselect
   * @param eds objeto selecionado
   * @returns nombre de eds
   */
  public mostrarNombreEds(eds: DataEds): string {
    return eds && eds.nombre ? eds.nombre : '';
  }



  /**
   * Metodo Utilizado para traducir los estados de las notificacion de los documentos
   * @param valor recibimos el valor del que queremos traducir
   * @returns candena traducida
   */
  public traducirEstadoNotificacion(valor: boolean): string {
    return valor ? this._translateService.instant('MENSAJES.SI_NOTIFICACION') : this._translateService.instant('MENSAJES.NO_NOTIFICACION')
  }

}
