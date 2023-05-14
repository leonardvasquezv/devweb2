import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EEstadosRegistro } from '@core/enum/estadoRegistro.enum copy';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ObjFile } from '@core/interfaces/base/objImagenFile.interface';
import { ArchivoEvidencia } from '@core/interfaces/plan-mejoramiento/archivoEvidencia.interface';
import { ResultadosEvaluacion } from '@core/interfaces/resultados-evaluacion.interface';
import { FileUtils } from '@core/utils/file-utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { UtilsService } from '@shared/services/utils.service';
import { Subscription } from 'rxjs';
import { GeneralUtils } from 'src/app/core/utils/general-utils';
import { ModalVerResultadosModel } from '../../../../models/modal-ver-resultados.model';

@Component({
  selector: 'app-modal-registrar',
  templateUrl: './modal-registrar.component.html',
  styleUrls: ['./modal-registrar.component.scss']
})
export class ModalRegistrarComponent implements OnInit {

  /**
   *  Instancia de la clase Subscription para guardar las suscripciones
   */
  private _subscriptions = new Subscription();

  /**
   * Variable que almacena la información del formulario para crear la evidencia de un indicador
   */
  public formularioRegistroIndicadores: FormGroup;

  /**
   * Lista de archivos de evidencia de un item del plan de mejoramiento
   */
  public listaArchivosEvidencia: Array<ArchivoEvidencia> = [];


  /**
   * Variable que contiene los resultados de la evaluación
   */
  public resultadoEvaluacion: ResultadosEvaluacion;

  /**
   * Id de la evidencia criterio
   */
  public idEvidenciaCriterio: number = 0;


  /**
   * Método donde se inyectan las dependencias
   * @param MAT_DIALOG_DATA Inyección del servicio de modales
   * @param _formBuilder Variable para guardar los parametros de un formulario
   * @param _modalVerResultadosModel Modelo del modal de ver resultados
   * @param _matDialog Define los atributos y las propiedades de los modales
   * @param _registrarModalRef Variable para almacenar la referencia al modal de registrar evidencia
   * @param _translateService Servicio para traducciones
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _modalVerResultadosModel: ModalVerResultadosModel,
    private _translateService: TranslateService,
    private _utilService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private data: { idEvaluacionCriterio: number },
    private _registrarModalRef: MatDialogRef<ModalRegistrarComponent>
  ) { }


  /**
   * Método que se ejecuta al inciar el componente
   */
  ngOnInit(): void {
    this._inicializarValores();
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }


  /**
   * Método para inicializar los valores del componente
   */
  private _inicializarValores(): void {
    this.formularioRegistroIndicadores = this._formBuilder.group({
      responsable: ['', Validators.required],
      fechaEvidencia: ['', Validators.required],
      recurso: [''],
    });

    this._modalVerResultadosModel.obtenerEvidenciaCriterio(this.data.idEvaluacionCriterio).subscribe(({ data }) => {
      if (data.idEvidenciaCriterio > 0) {
        this.idEvidenciaCriterio = data.idEvidenciaCriterio
        this.formularioRegistroIndicadores.get('responsable').setValue(data.responsable);
        this.formularioRegistroIndicadores.get('fechaEvidencia').setValue(data.fechaEvidencia);
        this.formularioRegistroIndicadores.get('recurso').setValue(data.recurso);
        this.listaArchivosEvidencia = data?.archivosEvidencia ? data?.archivosEvidencia : [];
      }
    })
  }


  /**
   * Método para abrir el modal de confirmación para guardar una evidencia
   */
  public _abrirModalConfirmacionGuardar(): void {
    if (this.formularioRegistroIndicadores.valid) {
      const mensaje = this._translateService.instant('TITULOS.VALIDACION_GUARDAR_REGISTRO');

      this._modalTipos(mensaje).afterClosed().subscribe((result) => {
        if (!!result) {
          this.armarObjetoEvidencia();
        }
      })

    }
  }

  /**
   * Metodo para armar el opbjeto de la evidencia criterio
   */
  public armarObjetoEvidencia(): void {
    const archivos: Array<ArchivoEvidencia> = this.listaArchivosEvidencia.filter((archivo) => archivo.estadoRegistro === EEstadosRegistro.activo || archivo.idArchivoEvidenciaCriterio > 0);
    const evidenciaCriterio = {
      idEvidenciaCriterio: this.idEvidenciaCriterio,
      idEvaluacionCriterio: this.data.idEvaluacionCriterio,
      ... this.formularioRegistroIndicadores.value,
      archivosEvidencia: [...archivos]
    }

    this._modalVerResultadosModel.crearEvidenciaCriterio(evidenciaCriterio).subscribe((response) => {
      let descripcion = this._translateService.instant('TITULOS.SOLICITUD_EXISTOSA');
      let tipoError = ETiposError.correcto;
      if (!response.status) {
        descripcion = this._translateService.instant('TITULOS.SOLICITUD_FALLIDA');
        tipoError = ETiposError.error;
      }

      this._utilService.procesarMessageWebApiV2(descripcion, descripcion, tipoError).then((result) => {
        if (result.isDismissed) {
          this._registrarModalRef.close();
        }
      })
    })
  }

  /**
   * Metodo para abrir el modal confirmar de tipos
   * @param mensaje a mostrar
   * @returns referencia al modal
   */
  public _modalTipos(mensaje: string): MatDialogRef<ModalTiposComponent> {
    return this._matDialog.open(ModalTiposComponent, {
      data: {
        titulo: '',
        descripcion: mensaje,
        icon: '15',
        button1: true,
        button2: true,
        txtButton1: this._translateService.instant("TITULOS.CONFIRMAR"),
        txtButton2: this._translateService.instant("TITULOS.CANCELAR"),
        activarFormulario: false
      }
    })
  }


  /**
 * Metodo utilizado para manejar la imagen de logo
 * @param files archivo generado en el evento de file
 */
  public agregarArchivoEvidencia(files: any): void {
    FileUtils.previewFile(files[0], [], true).subscribe((file) => {
      const archivoEvidencia = this.parseArchivoEvidencia(file);
      this.listaArchivosEvidencia.push(GeneralUtils.cloneObject(archivoEvidencia));
    });
  }

  /** 
   * Metodo para convertir los archivos en la interfaz necesaria
   * @param objFile base 64
   * @returns archivo parseado
   */
  public parseArchivoEvidencia(objFile: ObjFile): ArchivoEvidencia {
    return {
      idArchivoEvidenciaCriterio: 0,
      IdEvidenciaCriterio: 0,
      nombreArchivo: objFile.nombre || 'default',
      archivo: objFile.archivo,
      estadoRegistro: 'A',
      tamanoArchivo: +objFile.size.toFixed(2)
    }
  }

  /**
   * Método que modifica inactiva el archvio
   * @param indexArchivo Id del archivo de evidencia que va a ser eliminado de la lista de archivos de evidencia adjuntos
   */
  public inactivarArchivoEvidencia(indexArchivo: number): void {
    this.listaArchivosEvidencia[indexArchivo] = { ...this.listaArchivosEvidencia[indexArchivo], estadoRegistro: 'I' }
  }

  /**
   * Metodo para filtrar los archivos no eliminados por el usuario
   * @returns archivos activos
   */
  public archivosActivos(): ArchivoEvidencia[] {
    return this.listaArchivosEvidencia.filter(archivo => archivo.estadoRegistro === EEstadosRegistro.activo);
  }


}
