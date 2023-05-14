import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { Subscription } from 'rxjs';
import { ParametrizacionFormularioModel } from './models/parametrizacion-formulario.model';
@Component({
  selector: 'app-parametrizacion-form',
  templateUrl: './parametrizacion-form.component.html',
  styleUrls: ['./parametrizacion-form.component.scss']
})
export class ParametrizacionFormComponent implements OnInit, OnDestroy {

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions: Array<Subscription> = [];

  /**
   * Variable que almacena la información del formulario para crear una parametrización
   */
  public formularioParametrizacion: FormGroup;

  /**
   * Bandera para saber si el formulario se encuentra en modo consulta
   */
  public banderaConsulta = false;

  /**
   * Método donde se inyectan las dependencias
   * @param _dialogRef Inyección propiedades matDialog
   * @param _formBuilder Variable para guardar los parametros de un formulario
   * @param _matDialog Define los atributos y las propiedades de los modales
   * @param _parametrizacionFormModel Servicio para crear una parametrización
   * @param _translateService Servicio para traducciones
   * @param MAT_DIALOG_DATA Inyección del servicio de modales
   */
  constructor(
    private _dialogRef: MatDialogRef<ParametrizacionFormComponent>,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _parametrizacionFormModel: ParametrizacionFormularioModel,
    private _translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: {
      idTipoDetallePadre: number,
      editar: boolean,
      objetoTipoDetalle: TipoDetalle
    }
  ) { }

  /**
   * Método que se ejecuta la iniciar el componente
   */
  ngOnInit(): void {
    this._inicializarValores();
    if (!!this.data.editar) {
      this.formularioParametrizacion.patchValue(this.data.objetoTipoDetalle);
      this.formularioParametrizacion.disable();
      this.banderaConsulta = true;
    }
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
    this.formularioParametrizacion = this._formBuilder.group({
      idTipo: [null],
      idTipoDetallePadre: [this.data.idTipoDetallePadre],
      nomenclatura: ['', Validators.required],
      nombre: ['', Validators.required],
      idTipoDetalle: [null]
    });
  }

  /**
   * Método para validar si existe o no un código de parametrización
   */
  public validarCodigoParametrizacion(): void {
    const { idTipoDetallePadre, nomenclatura } = this.formularioParametrizacion.value;
    if (!!nomenclatura) {
      if (!this.banderaConsulta || (this.banderaConsulta && nomenclatura !== this.data.objetoTipoDetalle.nomenclatura)) {
        const arrayValidacion: Array<ObjParam> = [
          { campo: 'idTipoDetallePadre', valor: idTipoDetallePadre },
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
   * Método para abrir el modal de confirmación para guardar una parametrización
   */
  public abrirModalConfirmacionGuardar(): void {
    if (this.formularioParametrizacion.valid) {
      const mensaje = this._translateService.instant('TITULOS.VALIDACION_GUARDAR_REGISTRO');
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
        }
      })
      this._despuesCerrarModalGuardarParametrizacion(dialogRef);
    }
  }


  /**
   * Método que realiza las acciones al cierre del modal de validación para guardar una parametrización
   * @param dialogRef parametros seleccionados en el modal
   */
  private _despuesCerrarModalGuardarParametrizacion(dialogRef: MatDialogRef<ModalTiposComponent>): void {
    const dialogRefSubscription: Subscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { nombre, idTipo, idTipoDetallePadre, nomenclatura, idTipoDetalle } = this.formularioParametrizacion.value;
        const objetoRespuesta = {
          idTipo,
          idTipoDetallePadre,
          nombre,
          nomenclatura,
          idTipoDetalle,
          esEditar: this.banderaConsulta
        }
        this._dialogRef.close(objetoRespuesta);
      }
    })
    this._subscriptions.push(dialogRefSubscription);
  }

  /**
   * Método encargado de editar una parametrizacion
   */
  public editarParametrizacion(): void {
    this.data.editar = false;
    this.formularioParametrizacion.enable();
  }


}
