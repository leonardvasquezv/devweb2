import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CambioVista } from '@core/enum/cambioVista.enum';
import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjPage } from '@core/interfaces/base/objPage.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ajustesTablas, ObjTabla } from '@core/interfaces/base/objTabla.interface';
import { DataEds } from '@core/interfaces/data-eds.interface';
import { EdsModel } from '@core/model/eds.model';
import { FiltrosUtils } from '@core/utils/filtros-utils';
import { GeneralUtils } from '@core/utils/general-utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { CrearEdsModel } from '../../crear-eds/models/crear-eds.model';

@Component({
  selector: 'app-listado-eds',
  templateUrl: './listado-eds.component.html',
  styleUrls: ['./listado-eds.component.scss'],
})
export class ListadoEdsComponent implements OnInit, OnDestroy {
  /**
   * Guarda la metadata de la consulta
   */
  public metadata: ObjPage;

  /**
  * output que define si los campos estan en modo consulta
  */
  @Output() modoConsulta: boolean;
  /**
   * Referencia al enum para cambio de vista
   */
  public cambioVista = CambioVista;
  /**
   * Placeholder del filtro
   */
  public placeholder: string;
  /**
   * Opcion del limitador por pagina
   */
  public limitOptions: number[];
  /**
   * Limite de paginas en la tabla
   */
  public limitPage: number;
  /**
   * Array de filtros habilitados para la tabla
   */
  public arrayFiltros: Array<ObjFiltro> = [];
  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage;
  /**
   * Establece los parametros del componente de filtrado
   */
  public parametrosFiltros: Array<ObjParam>;
  /**
   * Data de listado Eds
   */
  public arrayEds: Array<DataEds>;

  /**
   *Data prueba para consultar una eds
   */
  public arrayCrearEds: Array<DataEds> = [];

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /**
   * Define el index del ultimo Eds que se selecciono al abrir el modal de activar o inactivar
   */
  public indexEdsSelected: number;

  /**
   * Define la ultima eds selecionado en el modal de manera global
   */
  public edsSelected: DataEds;

  /**
   * Variable que guarda la referencia del datatable
   */
  @ViewChild(DatatableComponent) public dataTableComponent: DatatableComponent;

  /**
   * Variable que se encarga de almacenar las criteros de paginacion para el filtro
   */
  public paginationFilter: Array<ObjParam> = [];

  /**
   * Parametros unificados de consulta
   */
  public queryParamsEds: Array<ObjParam> = [];

  /**
   * Variable que se encarga de almacenar el criterio de limite de pagina
   */
  public limitePaginaFiltro: ObjParam;

  /**
   * Variable que contiene medidas y tamaño de las tablas
   */
  public medidasTabla: ObjTabla;


  /**
  * Metodo donde se inyectan los servicios
  * @param _translateService Servicio para traducciones
  * @param _edsModel Modelo para manejar las EDS
  * @param _router Servicio para navegar entre paginas
  * @param _crearEdsModel Define los atributos y propiedades del modelo de crear eds
  * @param _dialog variable para abrir Modal
  */
  constructor(
    private _translateService: TranslateService,
    private _edsModel: EdsModel,
    private _router: Router,
    private _crearEdsModel: CrearEdsModel,
    private _dialog: MatDialog,
  ) { }

  /**
   *  Método de inicialización de componentes
   */
  ngOnInit(): void {
    const traduccionSubs = this._translateService.get(
      'MENSAJES.PLACEHOLDER_FILTRO_CONSULTA'
    ).subscribe(mensaje => this.placeholder = mensaje)
    this._subscriptions.add(traduccionSubs)
    this.parametrosFiltros = []
    this.limitPage = 5;
    this.limitOptions = [5, 7, 10]
    const filtroTexto = FiltrosUtils.armaFiltroTextoPredictivo();
    const filtroEstado = FiltrosUtils.armaFiltroEstadoRegistro()
    this.arrayFiltros = [filtroTexto, filtroEstado];
    this.pageTable = {
      size: 5,
      totalElements: 0,
      totalPages: 0,
      pageNumber: 0,
    };
    this.medidasTabla = ajustesTablas;
    this.obtenerParametrosIniciales();
    this.suscribirMetadataEds()
    this.suscribirEds();
    this._crearEdsModel.cleanCrearEdsList();
  }
  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._edsModel.cleanAllEdsList();
    this._subscriptions.unsubscribe();
  }
  /**
   * Metodo usado para escuchar  el numero  limite de item de la tabla
   * @param event numero limite de pagina recibido del Output
   */
  public actualizarLimiteDePagina(event: number): void {
    this.limitPage = event
    this.limitePaginaFiltro = { campo: 'size', valor: this.limitPage };
    this.pageTable.pageNumber = 1
    this.obtenerParametrosIniciales()
    this.obtenerEdsPorCriterios();
  }

  /**
   * Metodo usado para obtener los filtros seleccionados y
   * utilizarlos como criterios de busqueda
   * @param event Eventos del filtro
   */
  public recibeFiltros(event: any): void {
    this.parametrosFiltros = []
    const filtro = event.filtros;
    this.parametrosFiltros = FiltrosUtils.obtenerCriteriosTextoPredictivo(filtro[0], this.parametrosFiltros);
    this.parametrosFiltros = FiltrosUtils.obtenerCriteriosEstadoRegistro(filtro[1], this.parametrosFiltros)
    this.pageTable.pageNumber = 1;
    this.obtenerEdsPorCriterios();
  }
  /**
 * Método para obtener los parametros de busqueda de la data
 */
  private obtenerParametrosIniciales(): void {
    this.paginationFilter = [{ campo: 'pageNumber', valor: this.pageTable.pageNumber }];
  }

  /**
   * Método para actualizar el listado de Eds a partir de los nuevos parametros
   */
  public obtenerEdsPorCriterios(): void {
    this.queryParamsEds = [
      ...this.parametrosFiltros,
      ...this.paginationFilter,
      this.limitePaginaFiltro
    ];
    this._edsModel.obtenerEdsPorCriterios([...this.queryParamsEds]);
  }

  /**
   * Método para obtener subscripcion a las eds
   */
  public suscribirEds() {
    const subscripcionEds = this._edsModel.entities$.subscribe(
      (eds: Array<DataEds>) => {
        this.arrayEds = GeneralUtils.cloneObject(eds);
        this.arrayEds.forEach(x => {
          x.fechaModificacion = new Date(x.fechaModificacion)
          x.fechaCreacion = new Date(x.fechaCreacion)
        });
        this.arrayEds.sort((a, b) => b.fechaModificacion.getTime() - a.fechaModificacion.getTime());
        this.arrayEds.forEach(res => res.checked = res.estadoRegistro === 'A' ? true : false);
      }
    );
    this._subscriptions.add(subscripcionEds);
  }

  /**
   * Subscripción de la metadata de la entidad Eds desde el store
   */
  private suscribirMetadataEds(): void {
    const metadaSubscription =
      this._edsModel.metadata$.subscribe((metadata) => (this.metadata = metadata));
    this._subscriptions.add(metadaSubscription);
  }

  /**
   * Metodo  que se encarga de controlar el cambio de pagina
   * @param event evento de paginado donde tiene el número de pagina
   */
  public cambiarPagina(event): void {
    this.dataTableComponent.onFooterPage(event);
    this.paginationFilter = [{ campo: 'pageNumber', valor: event.page }];
    this.obtenerEdsPorCriterios();
  }

  /**
   * Método utilizado para abrir el modal de validación del cambio de estado
   * @param eds objeto seleccionado a cambiar el estado
   * @param rowIndex Posicion del minorista en el array
   * @param event Eventos de la funcionalidad del switch
   */
  public cambiarEstado(eds: DataEds, rowIndex: number, event: boolean): void {
    this.indexEdsSelected = rowIndex;
    this.edsSelected = eds;
    this.edsSelected.estadoRegistro = event ? 'A' : 'I';
    this.edsSelected.checked = event;

    let mensaje = event
      ? this._translateService.instant("TITULOS.SOLICITUD_ACTIVAR_REGISTRO")
      : this._translateService.instant("TITULOS.SOLICITUD_DESACTIVAR_REGISTRO");
    const dialogRef = this._dialog.open(ModalTiposComponent, {
      data: {
        titulo: "",
        descripcion: mensaje,
        icon: "15",
        button1: true,
        button2: true,
        txtButton1: "Confirmar",
        txtButton2: "Cancelar",
        activarFormulario: false,
      },
      panelClass: "modal-confirmacion",
    });

    this.accionDeConfirmarCambioEstado(dialogRef, eds);
  }

  /**
   * Método para ejecutar las acciones después de cerrar el modal
   * @param dialogRef variable que contiene los eventos del modal
   * @param eds variable que contiene el objeto eds que se está manipulando
   */
  public accionDeConfirmarCambioEstado(dialogRef: any, eds: DataEds): void {
    const dialogRefSubscription: Subscription = dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (!!result) {
          this.disparoAccionCambioEstado()
        } else {
          this.arrayEds[this.indexEdsSelected].estadoRegistro = eds.estadoRegistro === 'A' ? 'I' : 'A';
          this.arrayEds[this.indexEdsSelected].checked = !eds.checked;
        }
      });
    this._subscriptions.add(dialogRefSubscription);
  }
  /**
   * Método  para cambio de estado de eds hacia redux y db
   */
  public disparoAccionCambioEstado() {
    let params: Array<ObjParam> = [
      { campo: 'IdEds', valor: this.arrayEds[this.indexEdsSelected].idEds },
      { campo: 'EstadoRegistro', valor: this.arrayEds[this.indexEdsSelected].estadoRegistro },
    ]
    this._edsModel.actualizarEstadoEds(params)
  }
  /**
  * Metodo que se encarga de redirigir a vista crear eds
  */
  public botonCrearEds(): void {
    this._router.navigate(['home/dashboard/eds/crear']);
  }

  /**
   * Metodo que se encarga de agregar el id de la página en la ruta
   * @param idEds Codigo de la eds a consultar
   */
  public botonConsultarEds(idEds: number): void {

    this._router.navigate(['home/dashboard/eds/consultar', idEds]);
  }
}
