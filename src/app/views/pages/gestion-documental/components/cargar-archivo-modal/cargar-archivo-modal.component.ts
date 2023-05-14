import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EClaseRiesgo } from '@core/enum/claseRiesgo.enum';
import { ENombreExcel } from '@core/enum/nombreExcel.enum';
import { ERangoTrabajador } from '@core/enum/rangoTrabajadores.enum';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETipo } from '@core/enum/tipo.enum';
import { ETipoDetalle } from '@core/enum/tipoDetalle.enum';
import { Alerta } from '@core/interfaces/Alerta.interface';
import { Archivo } from '@core/interfaces/archivo.interface';
import { ObjPage, pageDefault } from '@core/interfaces/base/objPage.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Documento } from '@core/interfaces/Documento.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { Plantilla } from '@core/interfaces/plantilla.interface';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { DateUtils } from '@core/utils/date-utils';
import { FileUtils } from '@core/utils/file-utils';
import { GeneralUtils } from '@core/utils/general-utils';
import { SortUtils } from '@core/utils/sort-utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { UtilsService } from '@shared/services/utils.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { forkJoin, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { GestionDocumentalModel } from '../../models/gestion-documental.model';

@Component({
  selector: 'app-cargar-archivo-modal',
  templateUrl: './cargar-archivo-modal.component.html',
  styleUrls: ['./cargar-archivo-modal.component.scss'],

})
export class CargarArchivoModalComponent implements OnInit, OnDestroy {

  /**
   * Variable Enumerable tipo detalle
   */
  public ETipoDetalle = ETipoDetalle;

  /**
   * Define el color de menu por defecto
   */
  public colorSelected: string;

  /**
   * Bandera para editar alerta
   */
  public banderaEditarAlerta = false;

  /**
   * Define el estado de la seccion de alerta
   */
  public alertaValida = false;

  /**
   * Define el estado de consulta del formulario
   */
  public modoConsulta = false;

  /**
   * Define el contenido de la tabla de alertas del componente
   */
  public alertas: Array<Alerta> = [];

  /**
   * Variable que contiene array de alertas a enviar
   */
  public arrayAlertas: Array<Alerta> = [];

  /**
   * Define el limite de los items del contenido de la tabla
   */
  public limitPage = 3;

  /**
   * Formulario cargar archivo
   */
  public formGroupCargarArchivo: FormGroup;

  /**
   * listado de periodos
   */
  public arrayPeriodicidad: Array<TipoDetalle>;

  /**
   * listado de dias de semena
   */
  public arrayDiaSemana: Array<TipoDetalle>;

  /**
   * Componente de  html para realizar segumiento
   */
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef<HTMLInputElement>;

  /**
   * Arhivos en temporal
   */
  public files;

  /**
   * Archivo selecionado
   */
  public file: File;

  /**
   * Control de archivo
   */
  public fileControl: FormControl;

  /**
   * Documento seleccionado desde la vista  padre
   */
  public documentoSelected: Documento;

  /**
   *  Array para guardar los subscriptions
   */
  private _subscriptions: Array<Subscription> = [];

  /**
   * Nombre del archivo que se realiza la subida a travez
   */
  public fileName: string;

  /**
   * Variable que almacena el tamaño del documento
   */
  public tamanoDocumento: number;

  /**
   * Fecha de vencimiento en formato Date
   */
  public fechaVencimiento: Date;
  /**
   * Define el perioriodo selecionado que tiene el documento
   */
  public periodicidadSelected: string;
  /**
   * Define el dia de semana selecionado que tiene el documento
   */
  public diaSemanaSelected: string;

  /**
   * Define el modo de visualizacion para las columnas de la tabla
   */
  public ColumnMode = ColumnMode;

  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage = pageDefault;

  /**
   * Bandera array alerta
   */
  private _banderaAlertas = false;

  /**
   * Variable que almacena objeto documento
   */
  public documento: Documento;
  
  /**
   * Variable boleana para saber si el acordeon de alertas está expadido
   */
  public panelExpandido:boolean;

  /**
   * Metodo para inicializar servicios
   * @param data variable para acceder a la informacion pasada al modal, por medio de la inyeccion MAT_DIALOG_DATA
   * @param _formBuilder servicio para crear y controlar formularios reactivos
   * @param _utilService variable con métodos globales
   * @param _translateService Servicio de traducciones
   * @param _dialog variable para abrir Modal
   * @param _dialogRefCargarArchivo referencia el modal actual
   * @param _gestionDocumentalModel modelo de gestion documental
   * @param _tipoParametrizacionModel inyeccion de los servicios de TipoParametrizacionModel
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Documento,
    private _formBuilder: FormBuilder,
    private _utilService: UtilsService,
    private _translateService: TranslateService,
    private _dialog: MatDialog,
    private _dialogRefCargarArchivo: MatDialogRef<CargarArchivoModalComponent>,
    private _gestionDocumentalModel: GestionDocumentalModel,
    private _tipoParametrizacionModel: TipoParametrizacionModel
  ) { }

  /**
   * Metodo para inicializar componente
   * Inicializa las variables con los establecidos anteriormente
   */
  ngOnInit(): void {
    this._obtenerDatosIniciales();
    this.initForms();
    this.bloquearDia(null);
    this.panelExpandido=true;
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._gestionDocumentalModel.cleanAllAlertasList();
    this._subscriptions.forEach(res => res.unsubscribe());
  }

  /**
   * Inicializacion de formularios del componente
   */
  public initForms(): void {
    this.formGroupCargarArchivo = this._formBuilder.group({
      fechaVencimiento: [Validators.required],
      idPeriodicidadNotificacion: [Validators.required],
      idDiaNotificacion: [Validators.required],
      idDocumento: [this.data.idDocumento],
      urlArchivo: [],
      nombreArchivo: [],
      archivo: [],
      idAlertaDocumento: [],
      color: [null],
      tiempoMeses: [null],
      index: [],
      plantilla: [],
      validarPlantilla: false
    });
  }



  /**
   * Método para inicializar Documento seleccionado dentro del componente presente
   */
  public initDocumentoSelected(): void {
    this.documentoSelected = this.data;
    if (this.documentoSelected.fechaVencimiento) this.fechaVencimiento = DateUtils.stringToDate(this.documentoSelected.fechaVencimiento, 'DD/MM/YYYY')
    // TODO ajaner descomentar cuando se implementen las notificaciones
    // if (this.documentoSelected.notificacion) {
    //   this.periodicidadSelected = this.documentoSelected.notificacion.periodicidad
    //   this.diaSemanaSelected = this.documentoSelected.notificacion.diaSemana
    // }
  }

  /**
   * Método para obtener Subscripcion  de procesos
   */
  public suscribirAlertas(): void {
    const subscripcionAlertas =
      this._gestionDocumentalModel.entitiesAlertas$.subscribe((alerta: Array<Alerta>) => {
        if (!!alerta) {
          this.alertas = GeneralUtils.cloneObject(alerta);
          if (this.alertas.length === 0) {
            this.formGroupCargarArchivo.get('color').setErrors({ required: true });
            this.formGroupCargarArchivo.get('tiempoMeses').setErrors({ required: true });
          }

        }
      }
      );
    this._subscriptions.push(subscripcionAlertas);
  }

  /**
   * Metodo para realizar la confirmacion de guardado de formularios
   * @param bandera para confirmar o cancelar
   */
  public lanzarModalConfirmacion(bandera: boolean): void {

    const mensaje = bandera ?
      this._translateService.instant('TITULOS.VALIDACION_GUARDAR_REGISTRO') :
      this._translateService.instant('TITULOS.VALIDACION_CANCELAR_REGISTRO');

    const dialogRefSubscription: Subscription = this._modalTipos(mensaje, '15').afterClosed().subscribe((result) => {
      if (result) {
        if (!bandera) {
          this._cerrarComponente();
          return;
        };
        if (!this.documento.aplicaVencimiento) {
          this._guardarArchivo();
          return;
        }
        if (!!!this.formGroupCargarArchivo.get('nombreArchivo').value) {
          this._utilService.procesarMessageWebApi(this._translateService.instant('MENSAJES.SUBIR_DOCUMENTO'), ETiposError.error);
          return;
        }
        const { fechaVencimiento, idPeriodicidadNotificacion } = this.formGroupCargarArchivo.value;
        if (!!!fechaVencimiento || !!!idPeriodicidadNotificacion) {
          ['fechaVencimiento', 'idPeriodicidadNotificacion',].forEach(control => {
            if (!!!this.formGroupCargarArchivo.get(control).value) this.formGroupCargarArchivo.get(control).setErrors({ required: true });
          });
          this.formGroupCargarArchivo.markAllAsTouched();
          return;
        };
        if (this.alertas.length === 0) {
          this.formGroupCargarArchivo.get('color').setErrors({ required: true });
          this.formGroupCargarArchivo.get('tiempoMeses').setErrors({ required: true });
          this.formGroupCargarArchivo.markAllAsTouched();
          return;
        };
        this._guardarArchivo();
      }
    });
    this._subscriptions.push(dialogRefSubscription);
  }

  /**
   * Metodo para guardar un archivo
   */
  private _guardarArchivo(): void {
    const { fechaVencimiento, idPeriodicidadNotificacion, idDiaNotificacion, archivo,
      nombreArchivo, idDocumento, plantilla, validarPlantilla } = this.formGroupCargarArchivo.value;
    const objetoCargarArchivo: Archivo = {
      alertas: this.arrayAlertas,
      fechaVencimiento,
      idPeriodicidadNotificacion,
      idDiaNotificacion,
      archivo,
      nombreArchivo,
      idDocumento,
      plantilla,
      validarPlantilla
    }
    this._gestionDocumentalModel.actualizarArchivo(objetoCargarArchivo).subscribe(({ status, message }: ResponseWebApi) => {
      if (status) this._cerrarComponente(true);
      this._utilService.procesarMessageWebApi(message, status ? ETiposError.correcto : ETiposError.error);
    }, (err) =>
      this._utilService.procesarMessageWebApi(this._translateService.instant('TITULOS.ERROR_INESPERADO'), ETiposError.error));
  }

  /**
   * Método que dispara el SweetAlert de confirmación
   */
  public confirmarCreacionRegistroSweetAlert(): void {
    const mensaje = this._translateService.instant('TITULOS.REGISTRO_CREADO_EXITO');
    this._utilService.procesarMessageWebApi(mensaje, 'Correcto');
    this._cerrarComponente();
  }

  /**
   * Cerrar componente presente
   * @param banderaGuardarCorrecto bandera para confirmar que se guardo documento
   */
  private _cerrarComponente(banderaGuardarCorrecto: boolean = false): void {
    this._dialogRefCargarArchivo.close(banderaGuardarCorrecto ? true : false);
  }

  /**
   * Metodo para obtener los valores iniciales
   */
  private _obtenerDatosIniciales(): void {
    const datosInicialesSubscription: Subscription = forkJoin([
      this._tipoParametrizacionModel.obtenerTiposParametrizacion([{ campo: 'idTipo', valor: ETipo.tipoPeriodicidad }]).
        pipe(tap(({ data }: ResponseWebApi) => this.arrayPeriodicidad = SortUtils.getSortJson(data, 'nombre', 'STRING'))),
      this._tipoParametrizacionModel.obtenerTiposParametrizacion([{ campo: 'idTipo', valor: ETipo.tipoDiaSemana }]).
        pipe(tap(({ data }: ResponseWebApi) => this.arrayDiaSemana = SortUtils.getSortJson(data, 'orden', 'NUMBER'))),
    ]).subscribe();

    this._gestionDocumentalModel.obtenerAlertasPorDocumento(this.data.idDocumento);
    const obtenerAlertasubscripcion: Subscription = this._gestionDocumentalModel.entitiesAlertas$.subscribe((data: Array<Alerta>) => {
      if (data.length > 0) {
        this.alertas = GeneralUtils.cloneObject(data);
        const hayAlertas=this.alertas.length>0
        this.panelExpandido=hayAlertas ? true :this.panelExpandido
        if (!this._banderaAlertas) {
          this.arrayAlertas = this.alertas;
          this._banderaAlertas = true;
        }
      }else{
        this.panelExpandido=false
      }
    });

    const obtenerDocumentoSubscripcion: Subscription = this._gestionDocumentalModel.
      obtenerDocumentoPorId(this.data.idDocumento).subscribe(({ data }: ResponseWebApi) => {
        if (!!data) {
          this.documento = data;
          this.formGroupCargarArchivo.patchValue(data);
          this.fileName = !!this.documento.nombreArchivo ? this.documento.nombreArchivo : null;
          if (!!this.documento.idPeriodicidadNotificacion) {
            this.bloquearDia(this.documento.idPeriodicidadNotificacion);
          } else this.formGroupCargarArchivo.get('idDiaNotificacion').disable();
        };
      })

    this._subscriptions.push(datosInicialesSubscription, obtenerAlertasubscripcion, obtenerDocumentoSubscripcion);
  }

  /**
   * Metodo para bloquear el cambio día
   * @param idPeriodicidad seleccionada
   */
  public bloquearDia(idPeriodicidad: number): void {
    if (!!idPeriodicidad) {
      idPeriodicidad !== ETipoDetalle.semanal ?
        this.formGroupCargarArchivo.get('idDiaNotificacion').disable() :
        this.formGroupCargarArchivo.get('idDiaNotificacion').enable();

      if (idPeriodicidad === ETipoDetalle.semanal) this.formGroupCargarArchivo.get('idDiaNotificacion').setErrors({ required: true });
    }
  }

  /**
   * Metodo para cargar Archivo desde el componente
   * @param event evento de cargue de archivo
   */
  public cargarArchivo(event: any): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.file = files[0];
    this.fileName = this.file.name;
    this.tamanoDocumento = Math.round(this.file.size * 0.001);
    const mimeType = files[0].type;
    const extension = mimeType.substring(mimeType.lastIndexOf('.')).toUpperCase();
    if (this.data.aplicaEvaluacion) {
      this._validacionesPorPlantillas(extension, event);
      this.formGroupCargarArchivo.get('validarPlantilla').patchValue(true);
    } else {
      this._obtenerRutaArchivo(event);
    }
  }

  /**
     * Metodo para validar si la plantilla cumple con las condiciones
     * @param extension del documento
     */
  private _validacionesPorPlantillas(extension: string, event: any): void {
    if (!['.XLS', '.XLSX', '.MS-EXCEL', '.SHEET'].includes(extension)) {
      this._mensajeErrorSubirMensaje();
      return;
    }
    let riesgoBajoMedio: boolean = this.validarClaseRiesgo(this.documento.nomenclaturaClaseRiesgo)
    if (riesgoBajoMedio && ERangoTrabajador.mayorIgual50 !== this.documento.nomenclaturaRangoTrabajador) {
      if (ERangoTrabajador.menorIgual10 === this.documento.nomenclaturaRangoTrabajador) {
        this._armarObjetoExcel(ENombreExcel.plantilla1);
      } else {
        this._armarObjetoExcel(ENombreExcel.plantilla2);
      }
    } else {
      this._armarObjetoExcel(ENombreExcel.plantilla3);
    }
  }
  
  /**
   * Método para validar la clase de riesgo se encuentra entre los valores minimo - medioo
   * @param ClaseRiesgo Nomenclatura de la clase de riesgo
   * @returns booleano con la validación 
   */
  private validarClaseRiesgo(ClaseRiesgo: string): boolean {
    let riesgoBajoMedio: boolean
    switch (ClaseRiesgo) {
      case EClaseRiesgo.minimo: riesgoBajoMedio = true
        break;
      case EClaseRiesgo.bajo: riesgoBajoMedio = true
        break;
      case EClaseRiesgo.medio: riesgoBajoMedio = true
        break;
      default: riesgoBajoMedio = false
        break;
    }
    return riesgoBajoMedio
  }

  /**
   * Metodo para armarel objeto excel
   * @param nombrePlantilla a subir
   */
  private _armarObjetoExcel(nombrePlantilla: string): void {
    const objetoEvaluacion: Array<Plantilla> = [];
    FileUtils.excelFileToJSON(this.file)?.pipe(take(1)).subscribe((json: Array<any>) => {
      if (json[1]?.sheetName === nombrePlantilla) {
        json.forEach(filas => {
          const key = 'RESOLUCIÓN_0312_DE_2019';
          const calificacion = '__EMPTY_3';
          const observacion = '__EMPTY_4';
          const items = filas[key]?.split('.');
          if (items?.length === 3) {
            objetoEvaluacion.push({
              numeral: items.join('.'),
              calificacion: !!filas[calificacion] ? filas[calificacion]?.toString() : null,
              observacion: !!filas[observacion] ? filas[observacion]?.toString() : null
            });
          }
        });
        this.formGroupCargarArchivo.get('plantilla').patchValue(objetoEvaluacion);
        this._obtenerRutaArchivo(this.file, true);
      } else {
        this._mensajeErrorSubirMensaje();
      }
    });
  }

  /**
   * Metodo para mostrar mensaje al subir un documento erroneo
   */
  private _mensajeErrorSubirMensaje(): void {
    this._utilService.procesarMessageWebApi('No es posible subir este documento', ETiposError.error);
    this.borrarArchivo();
  }

  /**
   * Metodo para obtener la ruta de un archivo
   * @param event cargar archivo
   * @param banderaDiferenteRuta cargar archivo
   */
  private _obtenerRutaArchivo(event: any, banderaDiferenteRuta = false): void {
    const ruta = banderaDiferenteRuta ? event : event.target.files[0];
    FileUtils.previewFile(ruta, [], true).pipe(take(1))
      .subscribe(result => {
        this.formGroupCargarArchivo.get('archivo').patchValue(result.archivo);
        this.formGroupCargarArchivo.get('urlArchivo').patchValue(result.url);
        this.formGroupCargarArchivo.get('nombreArchivo').patchValue(result.nombre);
      });
  }

  /**
   * Metodo para borrar el archivo cargado
   */
  public borrarArchivo(): void {
    this.fileName = null;
    this.tamanoDocumento = null;
    this.file = null;
    this.formGroupCargarArchivo.get('archivo').patchValue(null);
  }

  /**
   * Metodo para descargar el archivo cargado
   */
  public descargarArchivo(): void {
    window.open(this.formGroupCargarArchivo.get('urlArchivo').value);
  }

  /**
   * Metodo para agregar las alertas
   */
  public agregarAlertas(): void {
    const { tiempoMeses, color, index, idDocumento } = this.formGroupCargarArchivo.value;
    if (!!tiempoMeses && !!color) {
      if (this.banderaEditarAlerta) {
        this.alertas[index].color = color;
        this.alertas[index].tiempoMeses = +tiempoMeses;
        this.arrayAlertas[index].color = color;
        this.arrayAlertas[index].tiempoMeses = +tiempoMeses;
        this.banderaEditarAlerta = false;
      } else {
        const objetoAlerta: Alerta = {
          tiempoMeses: +tiempoMeses,
          color,
          estadoRegistro: 'A',
          idDocumento
        }
        this.alertas = [objetoAlerta,...this.alertas];
        this.arrayAlertas = [ objetoAlerta,...this.arrayAlertas];
      }
      this.resetFormAlertas();
      this.borrarColor();
      this.panelExpandido=true
    } else {
      ['idAlertaDocumento', 'color', 'tiempoMeses'].forEach(control => {
        this.formGroupCargarArchivo.get(control).setErrors({ required: true });
      });
    }
  }

  /**
   * Metodo para seleccionar color del input
   * @param color El color en Hexadecimal
   */
  public seleccionarColor(color: string): void {
    this.formGroupCargarArchivo.get('color').patchValue(color);
  }

  /**
   * Metodo para limpiar el color seleccionado
   */
  public borrarColor(): void {
    this.formGroupCargarArchivo.get('color').setValue(null);
    this.colorSelected = null;
  }

  /**
   * Método para resetear formulario de alertas
   */
  public resetFormAlertas(): void {
    ['idAlertaDocumento', 'color', 'tiempoMeses', 'index'].forEach(control => {
      this.formGroupCargarArchivo.get(control).patchValue(null);
      this.formGroupCargarArchivo.get(control).clearValidators();
      this.formGroupCargarArchivo.get(control).updateValueAndValidity();
    });
  }

  /**
   * Método para editar alerta seleccionada
   * @param alerta objeto seleccionado a editar
   */
  public editarAlerta(alerta: Alerta): void {
    this.formGroupCargarArchivo.patchValue({
      idAlertaDocumento: alerta.idAlertaDocumento,
      color: alerta.color,
      tiempoMeses: alerta.tiempoMeses,
      index: alerta.index
    })
    this.banderaEditarAlerta = true;
    this.colorSelected = alerta.color;
    this.panelExpandido=true
  }

  /**
   * Método para eliminar la alerta seleccionada
   * @param alertaEliminada objeto de tipo Alerta que se debe eliminar
   */
  public eliminarAlerta(alertaEliminada: Alerta): void {
    let registroEliminado: boolean = false;
    const cerrarDialogSuscripcion: Subscription = this._modalTipos('TITULOS.CONFIRMAR_ELIMINAR_ALERTA', '15').afterClosed()
      .subscribe(result => {
        if (!result) return;

        if (!!alertaEliminada.idAlertaDocumento) {
          this.arrayAlertas.forEach((alerta, i) => {
            if (alerta.idAlertaDocumento == alertaEliminada.idAlertaDocumento) {
              this.arrayAlertas[i].estadoRegistro = 'I';
              registroEliminado = true
            }
          })
        } else {
          this.arrayAlertas.forEach((alerta, i) => {
            if ((!!!alerta.idAlertaDocumento) && (alerta.color == alertaEliminada.color) &&
              (alerta.tiempoMeses == alertaEliminada.tiempoMeses) &&
              (!registroEliminado) && (alerta.estadoRegistro == 'A')) {
              this.arrayAlertas[i].estadoRegistro = 'I';
              registroEliminado = true
            }
          })
        }

        this.alertas = [];
        this.arrayAlertas.forEach(alerta => { if (alerta.estadoRegistro === 'A') this.alertas.push(alerta) });
      });
    this._subscriptions.push(cerrarDialogSuscripcion);
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

}
