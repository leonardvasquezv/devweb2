import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subject, Subscription } from 'rxjs';

import { estadoModoForm } from '@core/enum/estadoModo.enum';
import { EProceso } from '@core/enum/proceso.enum';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETipo } from '@core/enum/tipo.enum';
import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjPage, pageDefault } from '@core/interfaces/base/objPage.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { DataEds } from '@core/interfaces/data-eds.interface';
import { Documento } from '@core/interfaces/documento.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { Proceso } from '@core/interfaces/proceso.interface';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { FiltrosUtils } from '@core/utils/filtros-utils';
import { GeneralUtils } from '@core/utils/general-utils';
import { SortUtils } from '@core/utils/sort-utils';
import { FiltrosComponent } from '@shared/components/filtros/filtros.component';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { UtilsService } from '@shared/services/utils.service';

import { ajustesTablas, ObjTabla } from '@core/interfaces/base/objTabla.interface';
import { GestionDocumentalModel } from '../../models/gestion-documental.model';

@Component({
  selector: 'app-crear-documento',
  templateUrl: './crear-documento.component.html',
  styleUrls: ['./crear-documento.component.scss']
})
export class CrearDocumentoComponent implements OnInit, OnDestroy {
  /**
 * Input que establece los inputs en modo consulta
 */
  @Input() modoConsulta: boolean = false;
  /**
   * Formulario de crear documento
   */
  public formCrearDocumento: FormGroup;
  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();
  /**
  * estado de formulario creacion/edicion
  */
  public estadoFormulario: estadoModoForm
  /**
   * Variable encargada de crear un Observer
   */
  private _debouncer: Subject<string> = new Subject();

  /**TODO - mpadilla: Borrar lista temporal
   * Lista de codigos de ejemplo
   */
  public listaCodigo: string[];
  /**
 * Establece los parametros unificados de consulta
 */
  public queryParams: Array<ObjParam> = [];
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
  public arrayTiposDocumento: Array<TipoDetalle>;

  /**
   * Array con las categorias tipo documento
   */
  public categoriaTipoDocumento: Array<ObjParam>;
  /**
   * Establece si el proceso tiene tipos
   */
  public hasTipos: boolean = false;
  /**
   * Proceso actual a la hora de elegir EDS
   */
  public procesoActual: Proceso;
  /**
   * Establece los parametros de un proceso con una EDS
   */
  public parametrosEdsProceso: Array<ObjParam>;
  /**
   * Establece los parametros del componente de filtrado
   */
  public parametrosFiltros: Array<ObjParam> = [];

  /**
  * Array de filtros habilitados para la tabla
  */
  public arrayFiltros: Array<ObjFiltro> = [];

  /**
   * Array de criterios de filtros seleccionados
   */
  public arrayCriteriosFiltros: Array<ObjParam> = [];

  /**
   * Array que contiene los documentos que aparecen en la tabla
   *
   */
  public arrayDocumentos: Array<Documento> = [];

  /**
   * Array que contiene los documentos temporales que aparecen en la tabla
   *
   */
  public arrayDocumentosTemporal: Array<Documento> = [];

  /**
   * Array con los nuevos documentos a agregar temporales a la EDS
   */
  public nuevoDocTemp: Documento
  /**
   * Proceso Seleccionado
   */
  public procesoSeleccionado: Proceso;

  /**
   * Eds Seleccionada
   */
  public edsSeleccionada: DataEds;

  /**
   * Variable para manejar el filtro por categoría
   */
  public documentoEstadosOption: Object;

  /**
   * Define el index de la última parametrización que se seleccionada al abrir el modal de activar o inactivar
   */
  public indexDocumentoSeleccionada: number;

  /**
   * Define la parametrización selecionada en el modal de manera global
   */
  public DocumentoSeleccionada: Documento;

  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage = pageDefault;

  /**
   * Define el modo de visualizacion para las columnas de la tabla
   */
  public ColumnMode = ColumnMode;


  /**
   * Variable que almacena el texto predictivo
   */
  private _filtroTexto = '';

  /**
   * Variable que contiene medidas y tamaño de las tablas
   */
  public medidasTabla: ObjTabla;


  /**
   * Referencia del elemento del filtro
   */
  @ViewChild(FiltrosComponent) filtros: FiltrosComponent;

  /**
   * Metodo donde se inyectan las dependencias
   * @param _translateService Servicio para traducciones
   * @param _formBuilder Servicio para crear formularios
   * @param _router Servicio para navegar entre paginas
   * @param _dialog Servicio que permite abrir un modal
   * @param _utilService servicio de utilidades
   * @param _gestionDocumentalModel Modelo de eds
   * @param _tipoParametrizacionModel inyeccion de los servicios de TipoParametrizacionModel
   */
  constructor(
    private _translateService: TranslateService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _dialog: MatDialog,
    private _utilService: UtilsService,
    private _gestionDocumentalModel: GestionDocumentalModel,
    private _tipoParametrizacionModel: TipoParametrizacionModel
  ) { }

  /**
   * Método de inicialización de componentes
   */
  ngOnInit(): void {
    this.estadoFormulario = estadoModoForm.creacion;
    this.medidasTabla = ajustesTablas;
    this._initForms();
    this._obtenerDatosIniciales();
    this._armaFiltros();
    this.obtenerDocumentos();
    this._utilService.setBreadCrumb('crear', null, true, this._translateService.instant('TITULOS.CREAR_DOCUMENTO'));
    this.pageTable.pageNumber=0;
  }
  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
    this._debouncer.unsubscribe();
  }


  /**
   * Get utilizado para saber si se usará la información de crear documento auxiliar o no
   */
  get bandera(){
    return !localStorage.getItem('idEds') && !localStorage.getItem('eds') && !localStorage.getItem('idProceso') && !localStorage.getItem('proceso')
  }


  /**
   * Get utilizado para obtener el id de la eds seleccionada
   */
  get idEds() {
    return  this.bandera ? JSON.parse(localStorage.getItem('crearDocumentoAux'))?.idEds : +localStorage.getItem('idEds');
  }

  /**
  * Get utilizado para obtener la eds seleccionada
  */
  get obtenerEds() {
    return this.bandera ? {nombre: JSON.parse(localStorage.getItem('crearDocumentoAux'))?.nombreEds} : JSON.parse(localStorage.getItem('eds'))
  }


  /**
  * Get utilizado para obtener el nombre proceso seleccionado
  */
  get obtenerProceso() {
    return this.bandera ? { nombre:JSON.parse(localStorage.getItem('crearDocumentoAux'))?.nombreProceso} : JSON.parse(localStorage.getItem('proceso'))
  }

  /**
   * Get utilizado para obtener el id del proceso seleccionado
   */
  get idProceso() {
    return this.bandera ? JSON.parse(localStorage.getItem('crearDocumentoAux'))?.idProceso : +localStorage.getItem('idProceso');
  }

  /**
   * Get utilizado para obtener bandera de tipos
   */
  get tieneTipos() {
    return this.bandera ? +JSON.parse(localStorage.getItem('crearDocumentoAux'))?.tieneTipos : +localStorage.getItem('tieneTipos') === 1 ? true : false;
  }
  
  /**
   * Get Define si el formulario está modo edición  o no
   */
  get modoEdicion():boolean {
   return this.estadoFormulario === estadoModoForm.edicion;
  }
  
  /**
   * Metodo que inicializa los formularios
   */
  private _initForms(): void {
    this.formCrearDocumento = this._formBuilder.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      idTipoDocumento: [],
      nombreTipoDocumento: [],
      aplicaEvaluacion: [false],
      aplicaVencimiento: [false],
      responsabilidadSocial: [false],
      obligatorio: [false],
      estadoRegistro: ['A'],
      estado: [true],
      index: [],
      idDocumento: null
    });
  }

  /**
   * Arma los filtros manuales para ser visualizados en el componente de app-filtros-tablas.
   */
  private _armaFiltros(): void {
    const filtrosTemp = FiltrosUtils.armarFiltrosGenericos(false);
    this.arrayFiltros = GeneralUtils.cloneObject(filtrosTemp);
    if (this.idProceso === EProceso.ambiental) {
      this._tipoParametrizacionModel.obtenerTiposParametrizacion([{ campo: 'idTipo', valor: ETipo.tipoDocumentosTipo }])
        .subscribe(({ data }: ResponseWebApi) => {
          this.arrayFiltros = [...this.arrayFiltros, FiltrosUtils.armaFiltroDinamico(data, 'Tipo de documento', 'idTipoDocumento', 'idTipoDetalle', 'nombre', true)];
        });
    }
  }

  /**
   * Método para obtener los datos iniciales
   */
  private _obtenerDatosIniciales(): void {
    this._tipoParametrizacionModel.obtenerTiposParametrizacion([{ campo: 'idTipo', valor: ETipo.tipoDocumentosTipo }])
      .subscribe(({ data }: ResponseWebApi) => this.arrayTiposDocumento = SortUtils.getSortJson(data, 'nombre', 'STRING'));
  }

  /**
   * Método para obtener suscripción de Documentos
   */
  public suscribirDocumentos(): void {
    const subscripcionDocumentos = this._gestionDocumentalModel.entitiesDocumentos$.subscribe(
      (documentos: Array<Documento>) => {

        this.arrayDocumentos = GeneralUtils.cloneObject(documentos);
      }
    )
    this._subscriptions.add(subscripcionDocumentos);
  }


  /**
   * Método para validar si existe o no un código de parametrización
   */
  public validarCodigodocumento(): void {
    this._debouncer.next(this.formCrearDocumento.get('codigo').value)
  }

  /**
   * Método encargado de buscar el código ingresado en la lista de documentos
   * @param codigo Codigo tomado del formulario para validar ya existe
   */
  public buscarCodigo(codigo: string): void {
    if (this.listaCodigo.includes(codigo)) this.formCrearDocumento.get('codigo').setErrors({ repetido: true })
  }

  /**
   * Método donde validamos si el código del formulario ya existe
   * @returns  true --> Es Valido El codigo(No existe) /  false --> No es valido el codigo (Si existe)
   */
  public codigoDocumentoValido(): void {
    if (this.formCrearDocumento.get('codigo').value) {
      const objetoValidacion = [{ campo: 'idProceso', valor: this.idProceso },
      { campo: 'idEds', valor: this.idEds },
      { campo: 'codigo', valor: this.formCrearDocumento.get('codigo').value }];
      const documentos:Documento=this.arrayDocumentos.find(x=>x.codigo==this.formCrearDocumento.get('codigo').value)
      const documentoArrayTemporal:Documento=this.arrayDocumentosTemporal.find(x=>x.codigo==this.formCrearDocumento.get('codigo').value)
      if (documentos||documentoArrayTemporal) {
        this.formCrearDocumento.get('codigo').setErrors({ duplicado: true });
      }
      else{
        const result = this._gestionDocumentalModel.validaCodigoDocumento(objetoValidacion).subscribe(({ data }: ResponseWebApi) => {
          if (data >= 1) this.formCrearDocumento.get('codigo').setErrors({ duplicado: true });
        });
      }
    }
  }

  /**
   * Metodo para editar procesos
   * @param row Fila del documento seleccionado
   * @param index posicion array
   */
  public editarDocumentoSelecionado(row: Documento, index: number): void {
    this.formCrearDocumento.patchValue(row);
    this.formCrearDocumento.get('index').setValue(index);
    this.DocumentoSeleccionada = row;
    this.estadoFormulario = estadoModoForm.edicion;
  }

  /**
   * Metodo para cancelar Edicion de proceso
   */
  public cancelarEdicionDocumento(): void {
    this.formCrearDocumento.reset();
    this.estadoFormulario = estadoModoForm.creacion;
  }


  /**
   * Metodo para realizar la solitud de guardado
   */
  public guardarDocumento(): void {
    if (!this.formCrearDocumento.valid) {
      this.formCrearDocumento.markAllAsTouched();
      return;
    };
    const { nombre, codigo, aplicaEvaluacion, aplicaVencimiento, idDocumento, idTipoDocumento,
      nombreTipoDocumento } = this.formCrearDocumento.value;
    if (this.estadoFormulario === estadoModoForm.creacion) {
      const nuevoDocumento: Documento = {
        nombre,
        codigo,
        idProceso: this.idProceso,
        idEds: this.idEds,
        estadoRegistro: 'A',
        aplicaEvaluacion: aplicaEvaluacion ?? false,
        aplicaVencimiento: aplicaVencimiento ?? false,
        idDocumento,
        idTipoDocumento,
        nombreTipoDocumento
      }
      this.arrayDocumentos = [nuevoDocumento, ...this.arrayDocumentos];
      this.arrayDocumentosTemporal = [nuevoDocumento, ...this.arrayDocumentosTemporal];
    } else {
      this._editarDocumentoCreado();
      this._editarDocumentoTemporalCreado();
      this.estadoFormulario = estadoModoForm.creacion
    }
    ['nombre', 'codigo', 'estadoRegistro', 'aplicaEvaluacion', 'aplicaVencimiento', 'obligatorio', 'idDocumento'
      , 'index', 'idTipoDocumento', 'nombreTipoDocumento'].forEach(control => this.formCrearDocumento.get(control).reset());
  }

  /**
   * Metodo para editar un documento que ya esta creado
   */
  private _editarDocumentoCreado(): void {
    const { nombre, codigo, estadoRegistro, aplicaEvaluacion, aplicaVencimiento,
      idDocumento, index, idTipoDocumento, nombreTipoDocumento } = this.formCrearDocumento.value;
    this.arrayDocumentos[index].nombre = nombre;
    this.arrayDocumentos[index].codigo = codigo;
    this.arrayDocumentos[index].aplicaEvaluacion = aplicaEvaluacion;
    this.arrayDocumentos[index].aplicaVencimiento = aplicaVencimiento;
    this.arrayDocumentos[index].idDocumento = idDocumento;
    this.arrayDocumentos[index].estadoRegistro = estadoRegistro;
    this.arrayDocumentos[index].idTipoDocumento = idTipoDocumento;
    this.arrayDocumentos[index].nombreTipoDocumento = nombreTipoDocumento;

  }

  /**
   * Metodo para editar un documento temporal que ya esta creado
   */
  private _editarDocumentoTemporalCreado(): void {
    const { nombre, codigo, estadoRegistro, aplicaEvaluacion, aplicaVencimiento,
      idDocumento, index, idTipoDocumento, nombreTipoDocumento } = this.formCrearDocumento.value;
    this.arrayDocumentosTemporal[index].nombre = nombre;
    this.arrayDocumentosTemporal[index].codigo = codigo;
    this.arrayDocumentosTemporal[index].aplicaEvaluacion = aplicaEvaluacion;
    this.arrayDocumentosTemporal[index].aplicaVencimiento = aplicaVencimiento;
    this.arrayDocumentosTemporal[index].idDocumento = idDocumento;
    this.arrayDocumentosTemporal[index].estadoRegistro = estadoRegistro;
    this.arrayDocumentosTemporal[index].idTipoDocumento = idTipoDocumento;
    this.arrayDocumentosTemporal[index].nombreTipoDocumento = nombreTipoDocumento;

  }

  /**
   * Método para enviar el request para guardar los documentos nuevos
   */
  public submitDocumentos(): void {
    const modalSuscription: Subscription =
      this._modalTipos('TITULOS.VALIDACION_GUARDAR_REGISTRO', '15').afterClosed().subscribe((result) => {
        if (!!result) {
          const documento: Documento = { documentos: this.arrayDocumentos }
          const guardarSuscription: Subscription =
            this._gestionDocumentalModel.crearDocumento(documento).subscribe(({ status, message }: ResponseWebApi) => {
              if (status) this._router.navigateByUrl('home/gestion-documental');
              this._utilService.procesarMessageWebApi(message, ETiposError.correcto);
            }, (err) =>
              this._utilService.procesarMessageWebApi(this._translateService.instant('TITULOS.ERROR_INESPERADO'), ETiposError.error));
          this._subscriptions.add(guardarSuscription);
        }
      });
    this._subscriptions.add(modalSuscription);
  }

  /**
   * Función para regresar a la pagina anterior y validación con modal
   */
  public goToBack(): void {
    const modalSuscription: Subscription =
      this._modalTipos('TITULOS.INFORMACION_NO_SE_GUARDARA', '15').afterClosed().subscribe((data) => {
        if (!!data) this._router.navigateByUrl('home/gestion-documental');
      });
    this._subscriptions.add(modalSuscription);
  }

  /**
   * Metodo para cambiar el estado del documento
   * @param documento a modificar
   * @param event estado
   */
  public cambiarEstadoDocumento(documento: Documento, event: boolean) {
    documento.estadoRegistro = event ? 'A' : 'I';
    documento.checked = event;
  }

  /**
   * Metodo usado para obtener los filtros seleccionados y
   * utilizarlos como criterios de busqueda
   * @param event Eventos del filtro
   * @param bandera usada en el filtro
   */
  public recibeFiltrosDinamico(event: any, bandera = false): void {
    this.parametrosFiltros = []
    const filtro = bandera ? event : event.filtros;
    this.arrayCriteriosFiltros = this._obtenerFiltros(filtro);
    this.pageTable.pageNumber = 0;
    this.filtrarTexto(this._filtroTexto, true);
    this.arrayCriteriosFiltros.forEach(filtro => {
      this.arrayDocumentosTemporal = this.arrayDocumentosTemporal
        .filter(res => {
          return !!res[filtro.campo] ? res[filtro.campo].toString().includes(filtro.valor) : null
        })
    });
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
        case 'estadoRegistro': {
          criterios = FiltrosUtils.obtenerCriteriosEstadoRegistro(item, criterios);
          break;
        }
        case 'textoPredictivo': {
          criterios = FiltrosUtils.obtenerCriteriosTextoPredictivo(item, criterios);
          break;
        }
        case 'idTipoDocumento': {
          criterios = FiltrosUtils.obtenerCriteriosDinamico(item, criterios, 'idTipoDocumento');
          break;
        }
      }
    });
    return criterios;
  }

  /**
   * Metodo generico para modal tipo
   * @param descripcion a mostrar
   * @param icon a mostrar
   * @returns Respuesta matdialog
   */
  private _modalTipos(descripcion: string, icon: string): MatDialogRef<ModalTiposComponent> {
    const matDialog = this._dialog.open(ModalTiposComponent, {
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
   * Metodo para obtener el nombre del tipo de documento seleccionado
   * @param evento seleccionado
   */
  public obtenerNombreTipoDocumento(evento: any): void {
    this.formCrearDocumento.get('nombreTipoDocumento').patchValue(evento.source.triggerValue);
  }

  /**
   * Método encargado de filtrar las parametrizaciones por el tipo de parametrizacion seleccionado
   * @param pagina filtro pagina
   * @param pageSize tamaño
   */
  public obtenerDocumentos(pagina = null, pageSize = null): void {
    let criteriosFinal = [
      { campo: 'idEds', valor: this.idEds },
      { campo: 'idProceso', valor: this.idProceso }];
    this._gestionDocumentalModel.obtenerAllDocumentos(criteriosFinal);

    const subscripcionDocumentos = this._gestionDocumentalModel.obtenerDocumentos(criteriosFinal).subscribe(
      ({ data, meta }: ResponseWebApi) => {
        if (!!data) {
          this.arrayDocumentos = GeneralUtils.cloneObject(data);
          this.arrayDocumentos.forEach(res => res.checked = res.estadoRegistro === 'A' ? true : false);
          this.arrayDocumentosTemporal = this.arrayDocumentos;
        }
      });
    this._subscriptions.add(subscripcionDocumentos);
  }

  /**
   * Metodo para filtrar el texto
   * @param texto a filtrar
   * @param bandera para volver a filtrar
   */
  public filtrarTexto(texto: string, bandera = false): void {
    this._filtroTexto = !!texto ? texto : null;
    this.arrayDocumentosTemporal = this.arrayDocumentos;
    if (!!texto) this.arrayDocumentosTemporal = this.arrayDocumentosTemporal
      .filter(res => res.nombre?.toLowerCase().includes(texto?.toLowerCase()) || res.codigo?.toLowerCase().includes(texto?.toLowerCase()));
    if (!bandera) this.recibeFiltrosDinamico(this.arrayCriteriosFiltros, true);
  }

  /**
   * Metodo para filtrar el texto
   * @param pageSize pagina a filtrar
   */
  public cambioPaginado(pageSize: number): void {
    this.pageTable.size = pageSize ? pageSize : this.pageTable.size;
    const metadataSuscripcion: Subscription = this._gestionDocumentalModel.metadataDocumentos$.subscribe(meta => {
      this.pageTable.totalElements = !!meta ? this.pageTable.totalElements = meta.totalElements : null;
    });
    this._subscriptions.add(metadataSuscripcion);
  }
}
