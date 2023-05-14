import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { estadoModoForm } from '@core/enum/estadoModo.enum';
import { ObjPage, pageDefaultModal } from '@core/interfaces/base/objPage.interface';
import { ObjTabla, ajustesTablas } from '@core/interfaces/base/objTabla.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { modalCrearProceso } from '@core/interfaces/modalCrearProceso.interface';
import { Proceso } from '@core/interfaces/proceso.interface';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { SeguridadService } from '@core/services/seguridad.service';
import { GeneralUtils } from '@core/utils/general-utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GestionDocumentalModel } from '../../models/gestion-documental.model';

@Component({
  selector: 'app-crear-proceso-modal',
  templateUrl: './crear-proceso-modal.component.html',
  styleUrls: ['./crear-proceso-modal.component.scss'],
})
export default class CrearProcesoModalComponent implements OnInit, OnDestroy {
  /**
   * Formulario para crear acuerdo
   */
  public formCrearProceso: FormGroup;

  /**
   * Variable Icono del Modal
   */
  public icono: string = '';

  /**
   * Formulario del modal editar consignaciones
   */
  public modalForm: FormGroup;
  /**
   * estado de formulario creacion/edicion/consulta
   */
  public estadoFormulario: estadoModoForm;
  /**
   * Listado de procesos
   */
  public procesos: Proceso[];
  /**
   * Listado de procesos a mostrar
   */
  public procesosMostrar: Proceso[];
  /**
   * Listado de perfiles
   */
  public perfiles: Array<Perfil>;
  /**
   * Limite de paginas en la tabla
   */
  public limitPage: number;
  /**
   * Metadata de la tabla
   */
  public metadata: ObjPage = pageDefaultModal;

  /**
   * Define el index del ultimo proceso que se selecciono al abrir el modal de activar o inactivar
   */
  public indexProcesoSelected: number;

  /**
   * Define el proceso selecionado en el modal de manera global
   */
  public procesoSelected: Proceso;
  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();
  /**
   * Define si el formulario está modo edicion  o no
   */
  public modoEdicion: boolean;

  /**
   * Variable que contiene medidas y tamaño de las tablas
   */
  public medidasTabla: ObjTabla;

  /**
   * Metodo para inicializar servicios
   * @param data variable para acceder a la informacion pasada al modal, por medio de la inyeccion MAT_DIALOG_DATA
   * @param _formBuilder servicio para crear y controlar formularios reactivos
   * @param _dialog variable para abrir Modal
   * @param _utilService variable con métodos globales
   * @param _gestionDocumental variable con servicios locales
   * @param _translateService Servicio de traducciones
   * @param _router Servicio para navegar entre paginas
   * @param _gestionDocumentalModel varible para modelos locales
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: modalCrearProceso,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilService: UtilsService,
    private _seguridadService: SeguridadService,
    private _translateService: TranslateService,
    private _router: Router,
    private _gestionDocumentalModel: GestionDocumentalModel
  ) { }

  /**
   * getter para verificar si el formulario está en modo Creación
   * @returns devuelve un booleano
   */
  public get estadoFormularioCreacion(): boolean {
    return this.estadoFormulario == estadoModoForm.creacion
  }

  /**
   * getter para verificar si el formulario está en modo Edición 
   * @returns devuelve un booleano
   */
  public get estadoFormularioEdicion(): boolean {
    return this.estadoFormulario == estadoModoForm.edicion
  }

  /**
   * Método de inicialización de componentes
   */
  ngOnInit(): void {
    setTimeout(() => {
      this._utilService.refreshViewPage();
    }, 300);
    this.medidasTabla = ajustesTablas;
    this.modalForm = this._formBuilder.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      estado: [true],
      idPerfil: ['', Validators.required]
    });
    this.estadoFormulario = estadoModoForm.creacion;
    this.obtenerDatosIniciales();
    this.modoEdicion = false;
    this.suscribirMetadataProceso();
    this.limitPage = 4;
    this.metadata = {
      size: this.metadata.size,
      pageNumber: 1,
      totalElements: this.metadata.totalElements,
      totalPages: this.metadata.totalPages
    }
    this.filtrarProcesosMostrar();
  }
  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
  /**
   * Metodo para inicializar valores
   */
  private obtenerDatosIniciales(): void {
    this.obtenerProcesos();
    this.obtenerPerfiles();
  }
  /**
   * Método para obtener Subscripcion  de procesos
   */
  public obtenerProcesos(): void {
    const subscripcionProcesos =
      this._gestionDocumentalModel.entitiesProcesos$.subscribe(
        (procesos: Array<Proceso>) => {
          this.procesos = GeneralUtils.cloneObject(procesos)
          this.procesos.forEach(x => {
            x.fechaModificacion = new Date(x.fechaModificacion)
            x.fechaCreacion = new Date(x.fechaCreacion)
          });
          this.procesos.sort((a, b) => b.fechaModificacion.getTime() - a.fechaModificacion.getTime());
          this.procesos.forEach(res => res.checked = res.estadoRegistro === 'A' ? true : false);
          this.filtrarProcesosMostrar()
        }
      );
    this._subscriptions.add(subscripcionProcesos);
  }

  /**
   * Metodo usado para escuchar  el numero  limite de item de la tabla
   * @param event numero limite de pagina recibido del Output
   */
  public cambiarPagina(event: any): void {
    this.metadata = {
      size: this.limitPage,
      pageNumber: event.page,
      totalElements: this.metadata.totalElements,
      totalPages: this.metadata.totalPages
    }
    this.filtrarProcesosMostrar()
  }

  /**
   * Metodo para  filtrar  los procesos  a mostrar en la tabla
   */
  public filtrarProcesosMostrar(): void {
    this.procesosMostrar = this.procesos.filter((x, index) => {
      const indexInicial = (this.limitPage * this.metadata.pageNumber) - this.limitPage - 1
      const indexFinal = (this.limitPage * this.metadata.pageNumber) - 1
      return indexInicial < index && index <= indexFinal
    })
  }
  /**
   * Subscripción de la metadata de la entidad proceso desde el store
   */
  private suscribirMetadataProceso(): void {
    const metadataSubscription =
      this._gestionDocumentalModel.metadataProcesos$.subscribe((metadata) => (this.metadata = metadata));
    this._subscriptions.add(metadataSubscription);
  }

  /**
   * Metodo para obtener perfiles
   */
  public obtenerPerfiles(): void {
    const subscripcionPerfiles =
      this._seguridadService.obtenerPerfiles([]).subscribe(
        (perfiles: ResponseWebApi) => {
          this.perfiles = GeneralUtils.cloneObject(perfiles.data);
        }
      );
    this._subscriptions.add(subscripcionPerfiles);
  }
  /**
   * Método donde validamos si el código del formulario ya existe
   * @returns  true --> Ya existe un codigo /  false --> No existe codigo
   */
  public existeCodigoProceso(): Observable<boolean> {
    let _result: Proceso
    var codigo: string = this.modalForm.get('codigo').value;
    return this._gestionDocumentalModel.obtenerProcesoPorCodigo(codigo)
      .pipe(
        map((res: ResponseWebApi): boolean => {
          if (res.status) {
            _result = res.data
            if (_result.nombre) {
              this.codigoProcesoEncontrado(_result.nombre);
              return true;
            }
            return false
          } else {
            _result = null
            return true
          }
        })
      );
  }
  /**
   * Método para entrar a modo de edición desde formulario de proceso
   * @param proceso Proceso seleccionado
   */
  public editarProcesoSelecionado(proceso: Proceso): void {
    this.modalForm.get('codigo').setValue(proceso.codigo);
    this.modalForm.get('nombre').setValue(proceso.nombre);
    this.modalForm.get('estado').setValue(proceso.estadoRegistro);
    this.modalForm.get('idPerfil').setValue(proceso.idPerfil);
    this.procesoSelected = proceso;
    this.modoEdicion = true
    this.estadoFormulario = estadoModoForm.edicion;
  }
  /**
   * Método para cancelar Edicion de proceso
   */
  public cancelarEdicionProceso(): void {
    this.modalForm.get('codigo').setValue('');
    this.modalForm.get('nombre').setValue('');
    this.modalForm.get('estado').setValue(true);
    this.modalForm.get('idPerfil').setValue('');
    this.modalForm.markAsUntouched();
    this.estadoFormulario = estadoModoForm.creacion;
    this.modoEdicion = false
  }
  /**
   * Método para guardar Un proceso que esté en el formulario
   */
  public guardarProceso(): void {
    if (!this.modalForm.valid) return;
    const estado: boolean = this.modalForm.get('estado').value;
    const { codigo, nombre, idPerfil } = this.modalForm.value;
    const proceso: Proceso = {
      codigo,
      estadoRegistro: estado ? 'A' : 'I',
      nombre,
      idPerfil
    }
    if (this.estadoFormulario == estadoModoForm.creacion) {
      const subs = this.existeCodigoProceso().subscribe((result: boolean) => {
        if (result) return;
        this._gestionDocumentalModel.addProceso(proceso)
      })
      this._subscriptions.add(subs)
    } else if (this.estadoFormulario == estadoModoForm.edicion) {
      proceso.idProceso = this.procesoSelected.idProceso;
      this.modificarProceso(proceso)
    }
    this.cancelarEdicionProceso()
  }
  /**
   * Método para escuchar Output de directiva del componente  en el campo codigo 
   * @param event string que envía la directiva despues de escuchar cambios en el componente imput 
   */
  public listenOnchangeDebuncer(event: string): void {
    this.modalForm.get('codigo').setValue(event);
    this.existeCodigoProceso()
  }
  /**
   * Método que realiza las acciones al cierre del modal
   * @param dialogRef parametros seleccionados en el modal
   */
  public afterCloseTerminar(
    dialogRef: MatDialogRef<ModalTiposComponent>
  ): void {
    const dialogRefSubscription: Subscription = dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (!!result) {
          this.confirmarCrearProceso();
        }
      });
    this._subscriptions.add(dialogRefSubscription);
  }

  /**
   * Método que dispara el SweetAlert de confirmación
   */
  public confirmarCrearProceso(): void {
    const mensaje = '¡Su proceso ha sido creado con exito!';
    this._utilService.procesarMessageWebApi(mensaje, 'Correcto');

    setTimeout(() => {
      this._router.navigate(['home/dashboard']);
    }, 2000);
  }

  /**
   * Método que dispara el SweetAlert de Error
   * @param nombreProceso cadena de string que indica el nombre del proceso existente 
   */
  public codigoProcesoEncontrado(nombreProceso: string): void {
    let mensaje = this._translateService.instant('TITULOS.CODIGO_EXISTENTE_PROCESO');
    this._utilService.procesarMessageWebApi(mensaje + ' "' + nombreProceso + '"', 'Error');
  }

  /**
   * Método utilizado para abrir el modal de validación del cambio de estado
   * @param proceso objeto seleccionado para cambiar el estado
   * @param rowIndex Posicion del minorista en el array
   * @param event Eventos de la funcionalidad del switch
   */
  public abrirModalCambiarEstado(
    proceso: Proceso,
    rowIndex: number,
    event: boolean
  ): void {
    this.indexProcesoSelected = rowIndex;
    this.procesoSelected = proceso;
    this.procesoSelected.estadoRegistro = event ? 'A' : 'I';
    this.procesoSelected.checked = event;

    let mensaje = event
      ? this._translateService.instant('TITULOS.SOLICITUD_ACTIVAR_REGISTRO')
      : this._translateService.instant('TITULOS.SOLICITUD_DESACTIVAR_REGISTRO');
    const dialogRef = this._dialog.open(ModalTiposComponent, {
      data: {
        titulo: '',
        descripcion: mensaje,
        icon: '15',
        button1: true,
        button2: true,
        txtButton1: this._translateService.instant('BOTONES.CONFIRMAR'),
        txtButton2: this._translateService.instant('BOTONES.CANCELAR'),
        activarFormulario: false,
      },
      panelClass: 'modal-confirmacion',
    });

    this.accionDeConfirmarCambioEstado(dialogRef, proceso);
  }

  /**
   * Método para ejecutar las acciones después de cerrar el modal
   * @param dialogRef variable que contiene los eventos del modal
   * @param proceso variable que contiene el objeto proceso que se está manipulando
   */
  public accionDeConfirmarCambioEstado(dialogRef: any, proceso: Proceso): void {
    const dialogRefSubscription: Subscription = dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (!!result) {
          this.actualizarEstadoProceso(proceso)
        } else {
          this.procesos[this.indexProcesoSelected].estadoRegistro = proceso.estadoRegistro === 'A' ? 'I' : 'A';
          this.procesos[this.indexProcesoSelected].checked = !proceso.checked;
        }
      });
    this._subscriptions.add(dialogRefSubscription);
  }

  /**
   * Método para modificar el objeto de tipo proceso seleccionado
   * @param proceso objeto de tipo proceso a modificar 
   */
  public modificarProceso(proceso: Proceso): void {
    this._gestionDocumentalModel.actualizarProceso(proceso)
  }
  /**
   * Método para modificar el estado del  proceso seleccionado
   * @param proceso objeto de tipo proceso a modificar 
   */
  public actualizarEstadoProceso(proceso: Proceso): void {
    this._gestionDocumentalModel.actualizarEstadoProceso(proceso)
  }
}
