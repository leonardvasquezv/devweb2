import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ParametrizacionModel } from '@core/model/parametrizacion.model';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '@shared/services/utils.service';

import { ETiposError } from '@core/enum/tipo-error.enum';
import { Parametrizacion } from '@core/interfaces/maestros-del-sistema/parametrizacion.interface';

import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { GeneralUtils } from '@core/utils/general-utils';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { ParametrizacionFormComponent } from '../components/parametrizacion-form/parametrizacion-form.component';

import { ETipo } from '@core/enum/tipo.enum';
import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjPage, pageDefault } from '@core/interfaces/base/objPage.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { FiltrosUtils } from '@core/utils/filtros-utils';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-parametrizacion-tipo-detalle',
  templateUrl: './parametrizacion-tipo-detalle.component.html',
  styleUrls: ['./parametrizacion-tipo-detalle.component.scss'],
})
export class ParametrizacionTipoDetalleComponent implements OnInit, OnDestroy {
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
   * Variable para manejar el listado de los tipos de parametrizacion que aparecen en el filtro
   */
  public listaTipoParametrizacion: Array<TipoDetalle>;

  /**
   * Variabla encargada de contener el listado de las parametrizaciones
   */
  public listaParametrizaciones: Array<TipoDetalle>;

  /**
   * Define el index de la última parametrización que se seleccionada al abrir el modal de activar o inactivar
   */
  public indexParametrizacionSeleccionada: number;

  /**
   * Define la parametrización selecionada en el modal de manera global
   */
  public parametrizacionSeleccionada: Parametrizacion;

  /**
   * Define si una parametrizacion está o no siendo editada
   */
  public editar: boolean;

  /**
   * Variable que almacena la paramtrizacion que se va a editar
   */
  public codParametrizacionAEditar: string;

  /**
   * Define el modo de visualizacion para las columnas de la tabla
   */
  public ColumnMode = ColumnMode;

  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage = pageDefault;

  /**
   * Array de filtros habilitados para la tabla
   */
  public arrayFiltros: Array<ObjFiltro> = [];

  /**
   * Array de criterios de filtros seleccionados
   */
  public arrayCriteriosFiltros: Array<ObjParam> = [];

  /**
   * Bandera que abre una sola vez el modal para consulta
   */
  private _banderaAbreModalConsulta = false;

  /**
   * Método donde se inyectan las dependencias
   * @param _matDialog Define los atributos y las propiedades de los modales
   * @param _parametrizacionModel Variable encargada de manejar el modelo de las parametrizaciones
   * @param _tipoParametrizacionModel Variable encargada de manejar el modelo de tipos de parametrizacion
   * @param _translateService Servicio para traducciones
   * @param _utilService  Define los atributos y propiedades del servicio de utilidades
   */
  constructor(
    private _matDialog: MatDialog,
    private _parametrizacionModel: ParametrizacionModel,
    private _tipoParametrizacionModel: TipoParametrizacionModel,
    private _translateService: TranslateService,
    private _utilService: UtilsService
  ) { }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.obtenerListadoTipoParametrizacion();
    this.armaFiltros();
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
    localStorage.removeItem('tipoParametrizacion');
  }

  /**
   * Get utilizado para obtener el tipo de parametrizacion
   */
  get tipoParametrizacion() {
    return +localStorage.getItem('tipoParametrizacion');
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
    this.obtenerParametrizacionesPorTipo(this.tipoParametrizacion);
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
   * Metodo para obtener el listado de tipos de parametrizacion
   */
  private obtenerListadoTipoParametrizacion(): void {
    this._tipoParametrizacionModel.obtenerTiposParametrizacion();
    const criterios = [{ campo: 'idTipo', valor: ETipo.tipoParametrizacion }];
    const suscripcionTiposParametrizacion: Subscription =
      this._tipoParametrizacionModel.obtenerTiposParametrizacion(criterios).subscribe(({ data }: ResponseWebApi) => {
        this.listaTipoParametrizacion = GeneralUtils.cloneObject(data);
      });

    this._subscriptions.push(suscripcionTiposParametrizacion);
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
   * Método encargado de ejecutar las accionjes después de cerrar el modal
   * @param dialogRef variable que permite hacer referencia a los eventos del modal
   * @param tipoDetalle variable que contiene el objeto parametrizaciaón que se está manipulando
   */
  public despuesCerrarModalCambiarEstado(dialogRef: MatDialogRef<ModalTiposComponent>, tipoDetalle: TipoDetalle): void {
    const dialogRefSubscription: Subscription = dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this._parametrizacionModel.cambioEstadoParametrizacion(tipoDetalle);
      } else {
        const index = this.listaParametrizaciones.findIndex(res => res.idTipoDetalle === tipoDetalle.idTipoDetalle);
        this.listaParametrizaciones[index].estadoRegistro = tipoDetalle.estadoRegistro === 'A' ? 'I' : 'A';
        this.listaParametrizaciones[index].checked = !tipoDetalle.checked;
      }
    });
    this._subscriptions.push(dialogRefSubscription);
  }

  /**
   * Método que dispara el SweetAlert de confirmación
   * @param estado boolean para controlar el mensaje que se va a dar
   */
  public confirmarCambioEstadoSweetAlert(estado: boolean): void {
    const mensaje = estado
      ? this._translateService.instant('TITULOS.REGISTRO_ACTIVADO')
      : this._translateService.instant('TITULOS.REGISTRO_DESACTIVADO');
    this._utilService.procesarMessageWebApi(mensaje, ETiposError.correcto);
  }

  /**
   * Método encargado de abrir el modal para crear una parametrización
   * @param objetoTipoDetalle para edicion
   * @param esEditar bandera para edicion
   */
  public abrirModalCrearParametrizacion(objetoTipoDetalle: TipoDetalle = null, esEditar = false): void {
    const matDialog = this._matDialog.open(ParametrizacionFormComponent, {
      width: '40%',
      data: {
        idTipoDetallePadre: this.tipoParametrizacion,
        editar: esEditar,
        objetoTipoDetalle
      },
    });
    this._closedDialog(matDialog);
  }

  /**
   * Metodo cuando se selecciona una opcion del modal
   * @param matDialog opcion cerrar modal
   */
  private _closedDialog(matDialog: MatDialogRef<any>): void {
    const dialogRefSubscription: Subscription = matDialog.afterClosed().subscribe(result => {
      if (result) {
        const objetoParametrizcion: TipoDetalle = {
          idTipo: result.idTipo,
          idTipoDetallePadre: result.idTipoDetallePadre,
          nombre: result.nombre,
          nomenclatura: result.nomenclatura,
          idTipoDetalle: result.idTipoDetalle
        }
        if (result.esEditar) {
          this._parametrizacionModel.editarParametrizacion(objetoParametrizcion);
        } else {
          this._parametrizacionModel.crearParametrizacion(objetoParametrizcion).subscribe(({ status }: ResponseWebApi) => {
            if (status) {
              this.obtenerParametrizacionesPorTipo(this.tipoParametrizacion);
            }
          });
        }
      }
    });
    this._subscriptions.push(dialogRefSubscription);
  }

  /**
   * Metodo encargado de editar una parametrizacion
   * @param row Parametrizacion que va a ser editada
   */
  public editarParametrizacion(row: TipoDetalle): void {
    this._banderaAbreModalConsulta = false;
    this._parametrizacionModel.selected(row.idTipoDetalle);
    const parametrizacionSubscription: Subscription = this._parametrizacionModel.parametrizacion$.subscribe((data: TipoDetalle) => {
      if (!!data && !!data.idTipoDetalle && !this._banderaAbreModalConsulta) {
        this._banderaAbreModalConsulta = true;
        this.abrirModalCrearParametrizacion(data, true);
      }
    })
    this._subscriptions.push(parametrizacionSubscription);
  }

  /**
   * Método encargado de filtrar las parametrizaciones por el tipo de parametrizacion seleccionado
   * @param tipoParametrizacion idTipo
   * @param pagina filtro pagina
   * @param pageSize tamaño
   */
  public obtenerParametrizacionesPorTipo(tipoParametrizacion: number, pagina = null, pageSize = null): void {
    localStorage.setItem('tipoParametrizacion', JSON.stringify(tipoParametrizacion));

    this.pageTable.pageNumber = pagina ? pagina.offset : 0;
    this.pageTable.size = pageSize ? pageSize : this.pageTable.size;
    const params = GeneralUtils.setPaginacion(this.pageTable);
    let criteriosFinal = this.arrayCriteriosFiltros.concat(params);

    criteriosFinal = [...criteriosFinal, { campo: 'idTipoDetallePadre', valor: tipoParametrizacion }];
    this._parametrizacionModel.obtenerListaParametrizaciones(criteriosFinal);
    const vinculacionSuscripcion: Subscription = this._parametrizacionModel.parametrizaciones$.subscribe(response => {
      if (!!response) {
        if (response.length > 0) {
          this.listaParametrizaciones = GeneralUtils.cloneObject(response);
          this.listaParametrizaciones.forEach(res => res.checked = res.estadoRegistro === 'A' ? true : false);
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
}
