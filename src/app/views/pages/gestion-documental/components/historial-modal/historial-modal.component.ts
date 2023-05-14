import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EEstadoRegistro } from "@core/enum/estadoRegistro.enum";
import { Archivo } from "@core/interfaces/archivo.interface";
import { ObjPage, pageDefaultModal } from '@core/interfaces/base/objPage.interface';
import { ajustesTablas, ObjTabla } from "@core/interfaces/base/objTabla.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { Documento } from "@core/interfaces/Documento.interface";
import { GeneralUtils } from "@core/utils/general-utils";
import { TranslateService } from "@ngx-translate/core";
import { ModalTiposComponent } from "@shared/components/modal-tipos/modal-tipos.component";
import { UtilsService } from "@shared/services/utils.service";
import { Subscription } from "rxjs";
import { GestionDocumentalModel } from "../../models/gestion-documental.model";

@Component({
  selector: "app-historial-modal",
  templateUrl: "./historial-modal.component.html",
  styleUrls: ["./historial-modal.component.scss"],
})
export class HistorialModalComponent implements OnInit {
  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();
  /**
   * Define el estado de consulta del formulario
   */
  public modoConsulta = false;
  /**
   * Define el contenido de la tabla que llevara el componente
   */
  public archivos: Array<Archivo> = [];
  /**
   * Define el documento seleccionado desde el componente desde donde se llama el presente componente
   */
  public documentoSelected: Documento;
  /**
   * Define el limite de los items del contenido de la tabla
   */
  public limitPage: ObjPage;
  /**
   * Define el index del ultimo Archivo que se selecciono al abrir el modal de activar o inactivar
   */
  public indexArchivoSelected: number;
  /**
   * Define el archivo selecionado en el modal de manera global
   */
  public archivoSelected: Archivo;

  /**
   * Variable que contiene medidas y tamaño de las tablas
   */
  public medidasTabla: ObjTabla;

  /**
   * Metodo para inicializar servicios
   * @param data variable para acceder a la informacion pasada al modal, por medio de la inyeccion MAT_DIALOG_DATA
   * @param _translateService Servicio de traducciones
   * @param _dialog variable para abrir Modal
   * @param _utilService variable con métodos globales
   * @param _gestionDocumentalModel modelo de gestion documental
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Documento,
    private _translateService: TranslateService,
    private _dialog: MatDialog,
    private _utilService: UtilsService,
    private _gestionDocumentalModel: GestionDocumentalModel
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this._utilService.refreshViewPage();
    }, 200);
    
    this.medidasTabla = ajustesTablas;
    this.documentoSelected = this.data;
    this.initDataArchivos();
  }
  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._gestionDocumentalModel.cleanAllArchivoList();
    this._subscriptions.unsubscribe();
  }
  /**
   * Método para iniciar data gestion documental
   */
  public initDataArchivos(): void {
    this.limitPage = pageDefaultModal;
    this.suscribirArchivos();
  }
  /**
   * Método para obtener Subscripcion  de procesos
   */
  public suscribirArchivos(): void {
    const subscripcionArchivos =
      this._gestionDocumentalModel.consultarHistorialArchivosDocumento(this.documentoSelected.idDocumento).subscribe(
        ({ data }: ResponseWebApi) => {  
          this.archivos = GeneralUtils.cloneObject(data);
        }
      );
    this._subscriptions.add(subscripcionArchivos);
  }
  /**
   * Método utilizado para abrir el modal de validación del cambio de estado
   * @param archivo objeto seleccionado para cambiar el estado
   * @param rowIndex Posicion del minorista en el array
   * @param event Eventos de la funcionalidad del switch
   */
  public cambiarEstado(
    archivo: Archivo,
    rowIndex: number,
    event: any
  ): void {
    this.indexArchivoSelected = rowIndex;
    this.archivoSelected = archivo;
    this.archivoSelected.activo = event;

    let mensaje = event
      ? this._translateService.instant("TITULOS.SOLICITUD_ACTIVAR_REGISTRO")
      : this._translateService.instant("TITULOS.SOLICITUD_DESACTIVAR_REGISTRO");
    const dialogRef = this._dialog.open(ModalTiposComponent, {
      data: {
        titulo: "",
        descripcion: mensaje,
        icon: "6",
        button1: true,
        button2: true,
        txtButton1: "Confirmar",
        txtButton2: "Cancelar",
        activarFormulario: false,
      },
      panelClass: "modal-confirmacion",
    });

    this.afterCloseModalCambiarEstado(dialogRef, archivo);
  }

  /**
   * Método para ejecutar las acciones después de cerrar el modal
   * @param dialogRef variable que contiene los eventos del modal
   * @param archivo variable que contiene el objeto archivo que se está manipulando
   */
  public afterCloseModalCambiarEstado(dialogRef: any, archivo: Archivo): void {
    const dialogRefSubscription: Subscription = dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (!!result) {
          this.archivos[this.indexArchivoSelected].activo = archivo.activo;
          this._gestionDocumentalModel.actualizarArchivo(this.archivos[this.indexArchivoSelected])
        } else {
          this.archivos[this.indexArchivoSelected].activo = !archivo.activo;
        }
      });
    this._subscriptions.add(dialogRefSubscription);
  }

  /**
   * Método que dispara el SweetAlert de confirmación
   * @param event boolean para controlar el mensaje que se va a dar
   */
  public confirmarCambioEstadoSweetAlert(event: boolean): void {
    let mensaje = event
      ? this._translateService.instant("TITULOS.REGISTRO_ACTIVADO")
      : this._translateService.instant("TITULOS.REGISTRO_DESACTIVADO")
    this._utilService.procesarMessageWebApi(mensaje, "Correcto");
  }
  /**
   * Método para descargar archivo
   * @param documento objeto que contiene la url
   */
  public descargarArchivo(documento: Documento): void {
    window.open(documento.urlArchivo, "_blank");
  }
  /**
   * Método para seleccionar la clase un componente
   * @param archivo objeto  de tipo archivo donde de va
   * @returns retorna el etiqueta de la clase de css dependiendo del estado
   */
  public estadoClase(archivo: Archivo): string {
    if (archivo.estadoRegistro == 'a') {
      return 'cw-estado-activo'
    }
    if (archivo.estadoRegistro == 'i') {
      return 'cw-estado-inactivo'
    }
  }
  /**
   * Método para devolver la variable de traducción
   * @param estado caracter que me indica el estado a traducir
   * @returns retorna el string llave para la traducción del estado
   */
  public obtenerEstado(estado: string): string {
    let traduccion: string;
    switch (estado) {
      case EEstadoRegistro.activo:
        traduccion = 'PALABRAS.ACTIVO'
        break;
      case EEstadoRegistro.inactivo:
        traduccion = 'PALABRAS.INACTIVO'
        break;
    }
    return traduccion
  }
}
