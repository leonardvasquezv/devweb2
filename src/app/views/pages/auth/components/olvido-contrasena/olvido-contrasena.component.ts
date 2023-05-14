import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETiposMensajeCodigo } from '@core/enum/tipoMensajeCodigoMovil.enum';
import { SeguridadModel } from '@core/model/seguridad.model';
import { TranslateService } from '@ngx-translate/core';
import { CodigoInputComponent } from '@shared/components/codigo-input/codigo-input.component';
import { UtilsService } from '@shared/services/utils.service';
import { CountdownComponent } from 'ngx-countdown';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-olvido-contrasena',
  templateUrl: './olvido-contrasena.component.html',
  styleUrls: ['./olvido-contrasena.component.scss']
})
export class OlvidoContrasenaComponent implements OnInit, OnDestroy {

  /**
   * Propiedad que define el componente del codigo de entrada
   */
  @ViewChild('codigoInput') codigoInput: CodigoInputComponent;

  /**
   * Propiedad que describe el formulario de restablecer contraseña
   */
  public formGroupRestablecerContrasena: FormGroup

  /**
   * Propiedad que describe la pagina en la que se encuentra el modal
   */
  public pageModal = 1;

  /**
   * define las opciones de envio de codigo de verificacion
   */
  public tiposMensajeCodigo = ETiposMensajeCodigo;

  /**
   * define la opcion seleccionada de envio de codigo de verificacion
   */
  public tipoMensajeCodigoSeleccionado = 0;

  /**
   * define el titulo de la opcion seleccionada
   */
  public opcionSeleccionadaTipoNombre: string;

  /**
   * define el resultado de la opcion seleccionada
   */
  public resultadoOpcionSeleccionada: string;

  /**
   * define si el codigo ingresado es valido
   */
  public codigoIsValid = false;

  /**
   * define el codigo completo de verificacion
   */
  public codigoVerificacion: string;

  /**
   * Propiedad que maneja la visibilidad de la contraseña nueva
   */
  public hideNueva = true;

  /**
   * Propiedad que maneja la visibilidad de la confirmacion de contraseña
   */
  public hideConfirmar = true;

  /**
   * Propiedad que describe los segundo para volver a enviar codigo
   */
  public segValidarCodigoSms = 600;

  /**
   * Propiedad que activa el boton de envio de codigo nuevamente
   */
  public activateButtonSend = true;

  /**
   * define el comportamiento de los campos de codiogo
   */
  public limpiarCampos = false;

  /**
   * define el usuario ingresado
   */
  private username: string;

  /**
   * Captura el array de los diferentes suscripciones que se realizan en el componente
   */
  private _arraySubcriptors: Array<Subscription> = [];

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
   * Define el objeto countdown utilizado en el template
   */
  private countdownPlaceholder: CountdownComponent;
  @ViewChild('countdown') set countdown(_countdown: CountdownComponent) {
    if (_countdown) {
      this.countdownPlaceholder = _countdown;
    }
  }

  /**
   * Metodo contructor del componente de olvido de contraseña
   * @param data accede a la data de angular material
   * @param dialogRef accede a los metodos del modal de angular material
   * @param _formBuilder accede a la construcción del formulario
   * @param _seguridadModel accede a los metodos del modelo de seguridad general
   * @param _utils  accede a los metodos de utilidades
   * @param _translate servicio que contiene las funcionalidades de las traducciones
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OlvidoContrasenaComponent>,
    private _formBuilder: FormBuilder,
    private _seguridadModel: SeguridadModel,
    private _utils: UtilsService,
    private _translate: TranslateService
  ) { }

  /**
   * Metodo encargado de iniciar el componente de olvido de contraseña
   */
  ngOnInit(): void {
    this.iniciarFormularios();
    this.formGroupRestablecerContrasena.get('username').patchValue(this.data.usuario);
  }

  /**
   * Metodo encargado de destruir el componente de agencia
   */
  ngOnDestroy(): void {
    this._arraySubcriptors.forEach(sub => sub.unsubscribe());
  }


    /**
   * Define el formControl para el campo de la contraseña
   */
    public passwordNew!: FormControl;

  /**
   * Metodo usado para iniciar todos los formularios del componente
   */
  public iniciarFormularios(): void {
    
    this.passwordNew = new FormControl("", [Validators.required]);

    this.formGroupRestablecerContrasena = this._formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      passwordNew: this.passwordNew,
      passwordNewConfirm: [''],
    });
  }

  /**
   * Metodo utilizado para enviar codigo de verificacion
   * @param tipo de via donde se envia el código
   */
  public generarCodigoVerificacion(reenvio: boolean = false, tipo: number = this.tipoMensajeCodigoSeleccionado) {
    const { valid, value } = this.formGroupRestablecerContrasena.get('username');
    if (valid) {
      if (reenvio) this.codigoInput.formGroupCodigo.reset();
      this.username = value;
      this.tipoMensajeCodigoSeleccionado = tipo;
      this._seguridadModel.generarCodigo({ username: value, tipo });
      const responseCodigoSubscription: Subscription = this._seguridadModel.responseCodigoGenerar$.subscribe(res => {
        if (!!res && Object.keys(res).length > 0) {
          this.resultadoOpcionSeleccionada = tipo === this.tiposMensajeCodigo.correo ? res.email : res.numeroCelular;
          this.pageModal = 2;
          this.restartSendVerificationCode();
        }
      });
      this._arraySubcriptors.push(responseCodigoSubscription);
    }
  }

  /**
   * Metodo utilizado para validar el codigo de verificacion
   */
  public validarCodigo(): void {
    this.countdownPlaceholder.pause();
    if (!!this.codigoVerificacion) {
      const request = { username: this.username, tipo: this.tipoMensajeCodigoSeleccionado, codigoVerificacionGenerado: this.codigoVerificacion };
      const responseCodigoSubscription: Subscription = this._seguridadModel.validarCodigoEager(request).subscribe(({ status, data, message }) => {
        if (status) {
          this.codigoIsValid = data;
          if (this.codigoIsValid) {
            this.pageModal = 3;
          } else {
            this._utils.procesarMessageWebApi(this._translate.instant('PALABRAS.ERROR_CODIGO_VERIFICACION'), ETiposError.error);
          }
        } else {
          this.pageModal = 1;
          this._utils.procesarMessageWebApi(message, ETiposError.error);
        }
        this.countdownPlaceholder.resume();
      });
      this._arraySubcriptors.push(responseCodigoSubscription);
    } else {
      this._utils.procesarMessageWebApi('Escriba un código valido', ETiposError.info);
      this.countdownPlaceholder.resume();
    }
  }

  /**
   * metodo para cambiar contraseña
   */
  public cambiarContrasena(): void {
    if (this.formGroupRestablecerContrasena.valid) {
      this._seguridadModel.reestablecerContrasena(this.formGroupRestablecerContrasena.value).subscribe(response => {
        if (response.status) {
          this._utils.procesarMessageWebApi('Contraseña cambiada', ETiposError.correcto);
          this.dialogRef.close();
        } else {
          this._utils.procesarMessageWebApi(response.message, ETiposError.error);
        }
      }, error => {
        this._utils.procesarMessageWebApi(error, ETiposError.error);
      });
    }
  }

  /**
   * Metodo usado para manejar los eventos del conteo regresivo
   * @param $event que maneja el tiempo de recuperacion de contraseña
   */
  public handleEvent($event): void {
    if ($event.left === 0) {
      this.activateButtonSend = false;
    }
  }

  /**
   * Metodo encargado de recibir el codigo generado en el input del mismo
   * @param event que maneja la obtencion del codigo de verificacion
   */
  public recibeCodigo(event): void {
    this.codigoVerificacion = event;
  }

  /**
   * Método encargado de resetear el estado del countdown y botón de envío de código
   */
  private restartSendVerificationCode(): void {
    if (this.countdownPlaceholder)
      this.countdownPlaceholder.restart();
    this.activateButtonSend = true;
  }

  /**
   * Metodo para validar las politicas de la contraseña
   */
  public validarContrasena(): void {
    const pass = this.formGroupRestablecerContrasena.get('passwordNew').value;
    // Que tenga mayuscula
    const mayuscula: RegExp = /[A-Z]+/
    // Que tenga minuscula
    const minuscula: RegExp = /[a-z]+/
    // Que tenga numero
    const numero: RegExp = /[0-9]+/
    // Que tenga caracter especial
    const caracter: RegExp = /[^A-Za-z0-9]/
    // Que tenga longitud mayor o igual a 6
    const longitud: RegExp = /.{6,}/

    this.objValidaPass = {
      mayuscula: mayuscula.test(pass),
      minuscula: minuscula.test(pass),
      numero: numero.test(pass),
      caracter: caracter.test(pass),
      longitud: longitud.test(pass)
    };

    if (pass !== '') {
      if (this.objValidaPass.minuscula === false) {
        this.formGroupRestablecerContrasena.get('passwordNew').setErrors({ noTieneMinuscula: true });
      }
      if (this.objValidaPass.mayuscula === false) {
        this.formGroupRestablecerContrasena.get('passwordNew').setErrors({ noTieneMayuscula: true });
      }
      if (this.objValidaPass.numero === false) {
        this.formGroupRestablecerContrasena.get('passwordNew').setErrors({ noTieneNumero: true });
      }
      if (this.objValidaPass.caracter === false) {
        this.formGroupRestablecerContrasena.get('passwordNew').setErrors({ noTieneCaracter: true });
      }
      if (this.objValidaPass.longitud === false) {
        this.formGroupRestablecerContrasena.get('passwordNew').setErrors({ noTieneLongitud: true });
      }
    }
    this.validarConfirmContrasena();
    this.formGroupRestablecerContrasena.updateValueAndValidity();
  }

  /**
   * Metodo para validar las politicas de la confirmacion de la contraseña
   */
  public validarConfirmContrasena(): void {
    this.formGroupRestablecerContrasena.get('passwordNewConfirm').setErrors({ invalidPass: null });
    this.formGroupRestablecerContrasena.get('passwordNewConfirm').setErrors({ empty: null });
    this.formGroupRestablecerContrasena.get('passwordNewConfirm').updateValueAndValidity();
    if (this.formGroupRestablecerContrasena.get('passwordNew').value !== this.formGroupRestablecerContrasena.get('passwordNewConfirm').value) {
      this.formGroupRestablecerContrasena.get('passwordNewConfirm').setErrors({ invalidPass: true });
    }
    if (!!!this.formGroupRestablecerContrasena.get('passwordNewConfirm').value) {
      this.formGroupRestablecerContrasena.get('passwordNewConfirm').setErrors({ empty: true });
    }
  }
}
