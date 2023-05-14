import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { UtilsService } from '@shared/services/utils.service';
import { Subscription } from 'rxjs';
import { EmpresaModel } from './../../models/empresa.model';

@Component({
  selector: 'app-formulario-perfil',
  templateUrl: './formulario-perfil.component.html',
  styleUrls: ['./formulario-perfil.component.scss']
})
export class FormularioPerfilComponent implements OnInit, OnDestroy, OnChanges {

  /**
  * Define el form group de informacion del perfil
  */
  public formGroupPerfil: FormGroup;

  /**
  * Define el form group de informacion de la empresa
  */
  public formGroupEmpresa: FormGroup;

  /**
   * Instancia de suscripciones
   */
  private _suscripciones = new Subscription();

  /**
   * Propiedad que describe los perfiles añadidos
   */
  private _perfiles: Array<Perfil> = []

  /**
  * Define el perfil seleccionado
  */
  @Input() perfilSeleccionado: Perfil = null;

  /**
  * Define el perfil creado o editado
  */
  @Output() enviaPerfil: EventEmitter<Perfil> = new EventEmitter();
  /**
   * Evento para enviar cambios de usuarios para el perfil
   */
  @Output() enviaUsuariosPerfil: EventEmitter<Perfil> = new EventEmitter();

  /**
   * Metodo constructor de la clase
   * @param _rootFormGroup define las propiedades y atributos del formulario reactivo
   * @param _empresaModel define las propiedades y atributos del modelo de empresa
   * @param _dialog define las propiedades y atributos  del dialogo de material
   * @param _translateService define las propiedades y atributos  de libreria de traduccion
   * @param _utils define las propiedades y atributos de servicio de utilidades
   * @param _activedRoute define las propiedades y atributos  de la ruta activa
   */
  constructor(
    private _rootFormGroup: FormGroupDirective,
    private _empresaModel: EmpresaModel,
    private _dialog: MatDialog,
    private _translateService: TranslateService,
    private _utils: UtilsService,
    private _activedRoute: ActivatedRoute,
  ) { }

  /**
   * get utilizado para obtener el tipo de operacion
   */
  get tipoOperacion() {
    return this._activedRoute.snapshot.url[0].path;
  }

  /**
   * Metodo donde se inicializa el componente
   */
  ngOnInit(): void {
    this.inicializarFormGroup();
  }

  /**
   * Metodo donde se destruye el componente
   */
  ngOnDestroy(): void {
    this._suscripciones.unsubscribe();
  }

  /**
   * Metodo donde se escuchan los cambios de propiedades de entrada
   * @param changes cambios de propiedades
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.perfilSeleccionado?.currentValue) {
      if (!!!this.formGroupPerfil) this.inicializarFormGroup();
      this._perfiles = [...this.formGroupEmpresa?.get('perfiles')?.value]?.filter(perfil => perfil.nombre !== this.perfilSeleccionado.nombre);
      this.formGroupPerfil.reset();
      if (!this.perfilSeleccionado.temporal) {
        this.formGroupPerfil.patchValue(this.perfilSeleccionado);
      } else {
        this.formGroupPerfil.get('nuevo').setValue(true);
        this.formGroupPerfil.get('temporal').setValue(true);
        this.formGroupPerfil.get('id').setValue(0);
      }
    }
  }

  /*
   * Función para inicializar formgroup
   */
  public inicializarFormGroup(): void {
    this.formGroupPerfil = this._rootFormGroup.control.get('formGroupPerfiles') as FormGroup;
    this.formGroupEmpresa = this._rootFormGroup.control.get('formGroupInformacionEmpresa') as FormGroup;
    if (this.tipoOperacion === ETiposOperacion.consultar) {
      this.formGroupPerfil.disable();
      this.formGroupEmpresa.disable();
    }
    this._cambiosFormulario();
  }

  /*
   * Función para enviar eventos del formulario
   * @param guardar parametro para indicar si guarda o cancela
   */
  public eventoEnviarFormulario(guardar: boolean): void {
    const { valid } = this.formGroupPerfil;
    if (!valid) {
      this.formGroupPerfil.markAllAsTouched();
      return;
    }

    const existeFnc = (perfil: Perfil) => perfil.nombre === this.formGroupPerfil.get('nombre').value;
    const nombreValido = (!this._perfiles?.some(existeFnc)) || !!!this._perfiles;
    if (!nombreValido && guardar) {
      this._utils.procesarMessageWebApi(this._translateService.instant('MENSAJE.NOMBRE_VALIDO'), ETiposError.error);
      return;
    }

    const permisosValido = !!this.formGroupPerfil.get('perfilesPaginasPermisos').value;
    if (!permisosValido) {
      this._utils.procesarMessageWebApi(this._translateService.instant('MENSAJES.PERMISO_ACTIVO'), ETiposError.error);
      return;
    }

    if ((guardar && valid) || !guardar) {
      let value = null;
      let message = 'MENSAJES.PERDER_PROGRESO';
      if (guardar) {
        value = this.formGroupPerfil.value;
        message = 'TITULOS.CONFIRMAR_CREACION_PERFIL';
      }
      const dialogRefSubscription: Subscription = this._modalTipos(message, '15')
        .afterClosed().subscribe((result) => {
          if (!!result) {
            this.enviaPerfil.emit(value);
            this.formGroupPerfil.reset();
          }
        });
      this._suscripciones.add(dialogRefSubscription);
    } else {
      this.formGroupPerfil.markAllAsTouched();
    }
  }

  /**
   * Metodo enargado de escuchar los cambios del formulario
   */
  private _cambiosFormulario(): void {
    this.formGroupPerfil.valueChanges.subscribe(() => this._empresaModel.asignarEstadoFormularioPerfil(this.formGroupPerfil.dirty));
    this.formGroupPerfil.get('usuarios').valueChanges.subscribe((usuarios) => {
      if (usuarios) {
        this.enviaUsuariosPerfil.emit({ ...this.formGroupPerfil.value, arrayUsuarios: usuarios });
      }
    })
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
      disableClose: true,
      panelClass: 'modal-confirmacion',
    });
    return matDialog;
  }

}
