import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETiposUsuarios } from '@core/enum/tipoUsuario.enum';
import { InitModel } from '@core/model/init.model';
import { SeguridadModel } from '@core/model/seguridad.model';
import { ObjLoginUser } from '@shared/models/objLoginUser.model';
import { UtilsService } from '@shared/services/utils.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  /**
   * Atributo que contiene el formulario de estado de registro
   */
  public formGroupCambioPass: FormGroup;

  /**
   * Tipos de usuarios del sistema
   */
  public tiposUsuarios = ETiposUsuarios;

  /**
   * Variable que contiene la informacion del usuario registrado
   */
  public userIdentity: ObjLoginUser;

  /**
   * Variable que determina el origen desde donde fue llamado el modal.
   */
  public esMisDatos = false;
  /**
   * Maneja la visibilidad en un componente del DOM
   */
  public hide = true;

  /**
   * Maneja la visibilidad en un componente del DOM para la confirmacion de la contraseña
   */
  public hideConfirm = true;

  /**
   * Maneja la visibilidad en un componente del DOM para la contraseña actual
   */
  public hideActual = true;

  /**
   * Objeto contiene las politicas para validar la contraseña
   */
  public objValidaPass: any = {
    mayuscula: false,
    minuscula: false,
    numero: false,
    caracter: false,
    longitud: false,
  };

  /**
   * Metodo constructo encargado de construir el componente de estado de registro
   * @param _formBuilder define las configuraciones de la construccion del formulairo
   * @param data enviada desdel llamado padre
   * @param dialogRef hace referencia a las configuraciones del dialogoF
   * @param _seguridadModel hace referencia a las model de seguridad
   * @param _utils hace referencia a las funcionalidades de utilidades
   * @param _initModel hace referencia al model de inicio.
   */
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private _seguridadModel: SeguridadModel,
    private _utils: UtilsService,
    private _initModel: InitModel,
  ) { }

  /**
   * metodo encargado de inicializar el componente de modal de estado de regustro
   */
  ngOnInit(): void {
    this.esMisDatos = this.data.esMisDatos;
    this._initModel.userIdentity$.subscribe(user => {
      this.userIdentity = user
      this.iniciarFormularios();
    });
  }

  /**
   * Metodo encargado de emitir el valor al componente padre una vez validado el formulario
   */
  public guardar(): void {
    if (this.formGroupCambioPass.valid) {
      const { passwordNew, passwordNewConfirm, passwordActual } = this.formGroupCambioPass.value;
      if (passwordNew === passwordNewConfirm) {
        if (this.data.username === null && this.data.idUsuario === null) {
          this._seguridadModel.actualizarPassword(this.formGroupCambioPass.getRawValue()).subscribe(response => {
            if (response.status) {
              this._utils.procesarMessageWebApi('Contraseña cambiada correctamente', ETiposError.correcto);
              this.dialogRef.close({ data: this.formGroupCambioPass.value });
            } else {
              this._utils.procesarMessageWebApi(response.message, ETiposError.error);
            }
          }, error => {
            this._utils.procesarMessageWebApi(error, ETiposError.error);
          });
        } else {
          const body = {
            passwordActual,
            passwordNewConfirm,
            passwordNew,
            username: this.data.username,
            idUsuario: this.data.idUsuario
          };
          if (this.userIdentity.idTipoUsuario !== this.tiposUsuarios.administrador) {
            this._seguridadModel.actualizarPasswordUser(body).subscribe(response => {
              if (response.status) {
                this._utils.procesarMessageWebApi('Contraseña cambiada correctamente', ETiposError.correcto);
                this.dialogRef.close({ data: this.formGroupCambioPass.value });
              } else {
                this._utils.procesarMessageWebApi(response.message, ETiposError.error);
              }
            });
          } else {
            this._seguridadModel.reestablecerContrasena(body).subscribe(response => {
              if (response.status) {
                this._utils.procesarMessageWebApi('Contraseña cambiada correctamente', ETiposError.correcto);
                this.dialogRef.close({ data: this.formGroupCambioPass.value });
              } else {
                this._utils.procesarMessageWebApi(response.message, ETiposError.error);
              }
            }, error => {
              this._utils.procesarMessageWebApi(error, ETiposError.error);
            });
          }
        }
      } else {
        this.formGroupCambioPass.get('passwordNewConfirm').setErrors({ invalidPass: true });
      }
    } else {
      this.formGroupCambioPass.markAllAsTouched();
    }
  }


  /**
   * Inicializa las propiedades de los campos de los formularios utilizados
   */
  private iniciarFormularios(): void {
    this.formGroupCambioPass = this._formBuilder.group({
      passwordActual: ['', Validators.compose([])],
      passwordNew: ['', Validators.compose([Validators.required])],
      passwordNewConfirm: ['', Validators.compose([Validators.required])]
    });
    if (this.userIdentity.idTipoUsuario !== this.tiposUsuarios.administrador || this.esMisDatos === true) {
      this.formGroupCambioPass.get('passwordActual').setValidators([Validators.required]);
    }
  }

  /**
   * Metodo para validar las politicas de la contraseña
   */
  validarContrasena() {
    const pass = this.formGroupCambioPass.get('passwordNew').value;
    // Que tenga mayuscula
    const mayuscula = new RegExp('[A-Z]+');
    // Que tenga minuscula
    const minuscula = new RegExp('[a-z]+');
    // Que tenga numero
    const numero = new RegExp('[0-9]+');
    // Que tenga caracter especial
    const caracter = new RegExp('[^A-Za-z0-9]');
    // Que tenga longitud mayor o igual a 6
    const longitud = new RegExp('.{6,}');

    this.objValidaPass = {
      mayuscula: mayuscula.test(pass),
      minuscula: minuscula.test(pass),
      numero: numero.test(pass),
      caracter: caracter.test(pass),
      longitud: longitud.test(pass)
    };

    if (pass !== '') {
      if (this.objValidaPass.minuscula === false) {
        this.formGroupCambioPass.get('passwordNew').setErrors({ noTieneMinuscula: true });
      }
      if (this.objValidaPass.mayuscula === false) {
        this.formGroupCambioPass.get('passwordNew').setErrors({ noTieneMayuscula: true });
      }
      if (this.objValidaPass.numero === false) {
        this.formGroupCambioPass.get('passwordNew').setErrors({ noTieneCaracter: true });
      }
      if (this.objValidaPass.caracter === false) {
        this.formGroupCambioPass.get('passwordNew').setErrors({ noTieneCaracter: true });
      }
      if (this.objValidaPass.longitud === false) {
        this.formGroupCambioPass.get('passwordNew').setErrors({ noTieneLongitud: true });
      }
      this.validarConfirmContrasena();
      this.formGroupCambioPass.updateValueAndValidity();
    }

  }

  /**
   * Metodo para validar las politicas de la confirmacion de la contraseña
   */
  public validarConfirmContrasena(): void {
    this.formGroupCambioPass.get('passwordNewConfirm').setErrors({ invalidPass: null });
    this.formGroupCambioPass.get('passwordNewConfirm').setErrors({ empty: null });
    this.formGroupCambioPass.get('passwordNewConfirm').updateValueAndValidity();
    if (this.formGroupCambioPass.get('passwordNew').value !== this.formGroupCambioPass.get('passwordNewConfirm').value) {
      this.formGroupCambioPass.get('passwordNewConfirm').setErrors({ invalidPass: true });
    }
    if (!!!this.formGroupCambioPass.get('passwordNewConfirm').value) {
      this.formGroupCambioPass.get('passwordNewConfirm').setErrors({ empty: true });
    }
  }

}
