import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { estadoModoForm } from '@core/enum/estadoModo.enum';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETipoDetallePadre } from '@core/enum/tipoDetallePadre.enum';
import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjPage, pageDefaultModal } from '@core/interfaces/base/objPage.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ajustesTablas, ObjTabla } from '@core/interfaces/base/objTabla.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { ParametrizacionModel } from '@core/model/parametrizacion.model';
import { FiltrosUtils } from '@core/utils/filtros-utils';
import { GeneralUtils } from '@core/utils/general-utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { UtilsService } from '@shared/services/utils.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { ParametrizacionFormularioModel } from '../../../../maestros-generales/components/parametrizacion-form/models/parametrizacion-formulario.model';

@Component({
  selector: 'app-modal-crear-servicio',
  templateUrl: './modal-crear-servicio.component.html',
  styleUrls: ['./modal-crear-servicio.component.scss']
})
export class ModalCrearServicioComponent implements OnInit {

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions: Array<Subscription> = [];

  /**
   * Opcion del limitador por pagina
   */
  public limitOptions: number[];

  /**
   * Limite de paginas en la tabla
   */
  public limitPage: number;

  /**
   * Variable para manaejar el filtro por categoria
   */
  public opcionesEstado: Object;

  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage = pageDefaultModal;

  /**
   * Array de filtros habilitados para la tabla
   */
  public arrayFiltros: Array<ObjFiltro> = [];

  /**
   * Array de criterios de filtros seleccionados
   */
  public arrayCriteriosFiltros: Array<ObjParam> = [];


  /**
   * Variable que almacena la información del formulario para crear una parametrización
   */
  public formularioParametrizacion: FormGroup;

  /**
   * Variabla encargada de contener el listado de los servicios existentes
   */
  public listaServicios: Array<TipoDetalle>;

  /**
   * Define el modo de visualizacion para las columnas de la tabla
   */
  public ColumnMode = ColumnMode;

  /**
   * Define en que estado se encuentra el formulario creacion/edicion/consulta
   */
  public estadoFormulario: estadoModoForm;

  /**
   * Variable que contiene el servicio seleccionado
   */
  public servicioSeleccionado: TipoDetalle;

  /**
   * Variable que contiene el id del tipo detalle padre
   */
  public tipoDetallePadre: ETipoDetallePadre;

  /**
   * Variable que contiene medidas y tamaño de las tablas
   */
  public medidasTabla: ObjTabla;

  /**
   * Método donde se inyectan las dependencias
   * @param _formBuilder Variable para guardar los parametros de un formulario
   * @param _matDialog Define los atributos y las propiedades de los modales
   * @param _parametrizacionModel Variable encargada de manejar el modelo de las parametrizaciones
   * @param _parametrizacionFormModel Servicio para crear una parametrización
   * @param _translateService Servicio para traducciones
   * @param _utilService  Define los atributos y propiedades del servicio de utilidades
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _parametrizacionModel: ParametrizacionModel,
    private _parametrizacionFormModel: ParametrizacionFormularioModel,
    private _translateService: TranslateService,
    private _utilService: UtilsService
  ) { }

  /**
   *  Getter Indica si el formulario del componente está en modo de edición
   * @returns retorna un boleano
   */
  public get estadoEdicionForm():boolean{
    return this.estadoFormulario ===estadoModoForm.edicion
  }
  /**
   *  Getter indica si el formulario del componente está en modo de creación
   * @returns retorna un boleano
   */
  public get estadoCreacionForm():boolean{
    return this.estadoFormulario ===estadoModoForm.creacion
  }
  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {

    setTimeout(() => {
      this._utilService.refreshViewPage();
    }, 500);
    
    this._inicializarValores();
    this.armaFiltros();
  }

  
  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.forEach(res => res.unsubscribe());
  }


  /**
   * Método de cargar los valores iniciales del componente
   */
  private _inicializarValores(): void {
    this.medidasTabla = ajustesTablas;
    this.estadoFormulario = estadoModoForm.creacion;
    this.tipoDetallePadre = ETipoDetallePadre.servicios;
    this.formularioParametrizacion = this._formBuilder.group({
      idTipo: [null],
      idTipoDetallePadre: [this.tipoDetallePadre],
      nomenclatura: ['', Validators.required],
      nombre: ['', Validators.required],
      idTipoDetalle: [null]
    });
    this.obtenerServicios(this.tipoDetallePadre);
  }


  /**
   * Arma los filtros manuales para ser visualizados en el componente de app-filtros-tablas.
   */
  private armaFiltros(): void {
    const filtrosTemp = FiltrosUtils.armarFiltrosGenericos(false);
    this.arrayFiltros = GeneralUtils.cloneObject(filtrosTemp);
  }


  /**
   * Metodo usado para obtener los filtros seleccionados y
   * utilizarlos como criterios de busqueda
   * @param event Eventos del filtro
   */
  public recibeFiltrosDinamico(event: any): void {
    const filtro = event.filtros;
    this.arrayCriteriosFiltros = this._obtenerFiltros(filtro);
    this.pageTable.pageNumber = 0;
    this.obtenerServicios(this.tipoDetallePadre);
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
      }
    });
    return criterios;
  }


  /**
   * Método encargado de obtener los servicios
   * @param tipoDetallePadre Id del tipo detalle padre
   * @param pagina Filtro pagina
   * @param pageSize Tamaño de la pagina
   */
  public obtenerServicios(tipoDetallePadre: number, pagina = null, pageSize = null): void{
    this.pageTable.pageNumber = pagina ? pagina.offset : 0;
    this.pageTable.size = pageSize ? pageSize : this.pageTable.size;
    const params = GeneralUtils.setPaginacion(this.pageTable);
    let criteriosFinal = this.arrayCriteriosFiltros.concat(params);

    criteriosFinal = [...criteriosFinal, { campo: 'idTipoDetallePadre', valor: tipoDetallePadre }];
    this._parametrizacionModel.obtenerListaParametrizaciones(criteriosFinal);
    const vinculacionSuscripcion: Subscription = this._parametrizacionModel.parametrizaciones$.subscribe(response => {
      if (!!response) {
        if (response.length > 0) {
          this.listaServicios = GeneralUtils.cloneObject(response);
          this.listaServicios.forEach(res => res.checked = res.estadoRegistro === 'A' ? true : false);
        }
      }
    });

    const metadataSuscripcion: Subscription = this._parametrizacionModel.metadata$.subscribe(meta => {
      if (!!meta) {
        this.pageTable.totalElements = meta.totalElements;
      }
    });
    
    this._subscriptions.push(vinculacionSuscripcion, metadataSuscripcion);
  }

  /**
   * Metodo encargado de abrir el modal de validacion de cambio de estado
   * @param tipoDetalle Objeto seleccionada para cambiar el estado
   * @param event Evento de la funcionalidad del switch de estado en la tabla
   */
  public abrirModalCambiarEstado(tipoDetalle: TipoDetalle, event: boolean): void {

    tipoDetalle.estadoRegistro = event ? 'A' : 'I';
    tipoDetalle.checked = event;

    const mensaje = event
      ? this._translateService.instant('TITULOS.SOLICITUD_ACTIVAR_REGISTRO')
      : this._translateService.instant('TITULOS.SOLICITUD_DESACTIVAR_REGISTRO');

    const dialogRef: MatDialogRef<ModalTiposComponent> = this._matDialog.open(ModalTiposComponent, {
      data: {
        titulo: '',
        descripcion: mensaje,
        icon: '15',
        button1: true,
        button2: true,
        txtButton1: this._translateService.instant('TITULOS.CONFIRMAR'),
        txtButton2: this._translateService.instant('TITULOS.CANCELAR'),
        activarFormulario: false
      },
      panelClass: 'modal-confirmacion'
    })

    this.despuesCerrarModalCambiarEstado(dialogRef, tipoDetalle);
  }

  /**
   * Método encargado de ejecutar las acciones después de cerrar el modal
   * @param dialogRef variable que permite hacer referencia a los eventos del modal
   * @param tipoDetalle variable que contiene el objeto parametrizaciaón que se está manipulando
   */
  public despuesCerrarModalCambiarEstado(dialogRef: MatDialogRef<ModalTiposComponent>, tipoDetalle: TipoDetalle): void {
    const dialogRefSubscription: Subscription = dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this._parametrizacionModel.cambioEstadoParametrizacion(tipoDetalle);
      } else {
        const index = this.listaServicios.findIndex(res => res.idTipoDetalle === tipoDetalle.idTipoDetalle);
        this.listaServicios[index].estadoRegistro = tipoDetalle.estadoRegistro === 'A' ? 'I' : 'A';
        this.listaServicios[index].checked = !tipoDetalle.checked;
      }
    });
    this._subscriptions.push(dialogRefSubscription);
  }
  
  /**
   * Método para validar si existe o no un código de parametrización
   */
  public validarCodigoParametrizacion(): void {
    const { nomenclatura } = this.formularioParametrizacion.value;
    
    if(!!nomenclatura){
      if(this.estadoFormulario !== estadoModoForm.edicion || (this.estadoFormulario === estadoModoForm.edicion && nomenclatura !== this.servicioSeleccionado.nomenclatura)){
        const arrayValidacion: Array<ObjParam> = [
          { campo: 'idTipoDetallePadre', valor: this.tipoDetallePadre },
          { campo: 'nomenclatura', valor: nomenclatura }
        ];
        const validarNomenclaturaSuscricion: Subscription =
          this._parametrizacionFormModel.validarNomenclatura(arrayValidacion).subscribe(({ data, status }: ResponseWebApi) => {
            if (data !== 0 || !status) {
              this.formularioParametrizacion.get('nomenclatura').setErrors({ repetido: true })
            }
          });
        this._subscriptions.push(validarNomenclaturaSuscricion);
      }
    }
  }

  /**
   * Método para crear un servicio
   */
  public guardarServicio(): void {
    if(this.formularioParametrizacion.valid){
      const { nombre, idTipo, nomenclatura, idTipoDetalle } = this.formularioParametrizacion.value;
      const objetoParametrizcion: TipoDetalle = {
        idTipo: idTipo,
        idTipoDetallePadre: this.tipoDetallePadre,
        nombre: nombre,
        nomenclatura: nomenclatura,
        idTipoDetalle: idTipoDetalle
      }
      
      if(this.estadoFormulario === estadoModoForm.creacion){
        this._parametrizacionModel.crearParametrizacion(objetoParametrizcion).subscribe(({ status }: ResponseWebApi) => {
          if (status) {
            this.confirmarSweetAlert('crear',status);
            this.formularioParametrizacion.reset();
            this._limpiarCampos();
            this.obtenerServicios(this.tipoDetallePadre);
          }else{
            this.confirmarSweetAlert('crear',status);
          }
        });
      }else if(this.estadoFormulario === estadoModoForm.edicion){
        this._parametrizacionModel.editarParametrizacion(objetoParametrizcion);
        this.formularioParametrizacion.reset();
        this._limpiarCampos();
        this.estadoFormulario = estadoModoForm.creacion;
      }

    }
  }

  /**
   * Método para confirmar si un servicio fue creado correctamente
   * @param accion Accion que determina que mensaje se va a mostrar
   * @param estado Variable que dice si hubo o no un error
   */
  public confirmarSweetAlert(accion: string, estado: boolean): void{
    let mensaje: string;
    switch(accion){
      case 'crear':
        mensaje = estado 
          ? this._translateService.instant('TITULOS.REGISTRO_CREADO_EXITO')
          : this._translateService.instant('TITULOS.REGISTRO_CREADO_ERROR');

        this._utilService.procesarMessageWebApi(mensaje, ETiposError.correcto);
        break;
      case 'editar':
        mensaje = estado 
        ? this._translateService.instant('TITULOS.REGISTRO_ACTUALIZADO_EXITO')
        : this._translateService.instant('TITULOS.REGISTRO_ACTUALIZADO_ERROR');

      this._utilService.procesarMessageWebApi(mensaje, ETiposError.correcto);
    }
      
  }


  /**
   * Método para colocar el formulario en modo edición
   * @param servicio Servicio seleccionado
   */
  public editarServicioSeleccionado(servicio: TipoDetalle): void{
    this.formularioParametrizacion.patchValue(servicio);
    this.estadoFormulario = estadoModoForm.edicion;
    this.servicioSeleccionado = servicio;
  }

  /**
   * Método para cancelar la edición
   */
  public cancelarEdicionServicio(): void {
    this.formularioParametrizacion.get('nombre').setValue('');
    this.formularioParametrizacion.get('nomenclatura').setValue('');
    this.estadoFormulario = estadoModoForm.creacion;
    this.servicioSeleccionado = null;
  }

  /**
   * Método encargado de limpiar los campos del formulario 
   */
  private _limpiarCampos(): void{
    let control: AbstractControl = null;
    Object.keys(this.formularioParametrizacion.controls).forEach((name) => {
      control = this.formularioParametrizacion.controls[name];
      control.setErrors(null);
    });
  }
}
