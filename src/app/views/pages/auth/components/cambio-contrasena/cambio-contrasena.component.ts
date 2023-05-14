import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { SeguridadModel } from '@core/model/seguridad.model';
import { UtilsService } from '@shared/services/utils.service';
import { SimpleCrypt } from 'ngx-simple-crypt';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.scss']
})
export class CambioContrasenaComponent implements OnInit {

  /**
   * Formulario para crear o editar un modulo
   */
  public formGroupCambioPass: FormGroup;
  /**
   * Maneja la visibilidad en un componente del DOM
   */
  public hideP = true;

  /**
   * Maneja la visibilidad en un componente del DOM
   */
  public hideCP = true;

  /**
   * Codigo unico del usuario conectado
   */
  public idUsuario;

  /**
   * Cuenta de correo del usuario identificado
   */
  public correoUsuario: string;

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
   * Constructor del componente de creacion contraseña
   * @param _formBuilder  variable que accede a todos los metodos de construccion del formulario
   * @param _cambioContrasenaModel accede a los metodos del modelo de cambio de contraseña
   */
  constructor(
    private _utils: UtilsService,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _seguridadModel: SeguridadModel,
    private _router: Router
  ) { }

  /**
   * Metodo encargado de inicializar el componente
   */
  ngOnInit(): void {
    this.decodificarSecreto();
    this.iniciarFormularios();
  }

  /**
   * get utilizado obtener la ruta
   */
  get parametroSecreto() {
    return this._route.snapshot.url[1].path;
  }

  /**
   * Metodo encargado de decodificar el secreto
   */
  private decodificarSecreto() {
    const simpleCrypt = new SimpleCrypt();
    const secreto = simpleCrypt.decode('brasilia-key', this.parametroSecreto);
    const path = secreto.split('|');
    this.idUsuario = path[0];
    this.correoUsuario = path[1];
  }

  /**
   * Inicializa las propiedades de los campos de los formularios utilizados
   */
  private iniciarFormularios(): void {
    this.formGroupCambioPass = this._formBuilder.group({
      username: [{ value: this.correoUsuario, disabled: true }, Validators.compose([Validators.required])],
      passwordNew: ['', Validators.compose([Validators.required])],
      passwordNewConfirm: ['', Validators.compose([])],
      idUsuario: this.idUsuario
    });
  }

  /**
   * metodo encargado de guardar usuario en el sistema
   */
  public guardarUsuario() {
    const { passwordNew, passwordNewConfirm } = this.formGroupCambioPass.value;
    if (this.formGroupCambioPass.valid) {
      if (passwordNew === passwordNewConfirm) {
        this._seguridadModel.reestablecerContrasena(this.formGroupCambioPass.getRawValue()).subscribe(response => {
          if (response.status) {
            this._utils.procesarMessageWebApi('Usuario creado', ETiposError.correcto);
            this._router.navigate(['/auth/login']);
          } else {
            this._utils.procesarMessageWebApi(response.message, ETiposError.error);
          }
        }, error => {
          this._utils.procesarMessageWebApi(error, ETiposError.error);
        });
      } else {
        this.formGroupCambioPass.get('passwordNewConfirm').setErrors({ invalidPass: true });
      }
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
      this.formGroupCambioPass.updateValueAndValidity();
    }

  }

  /**
   * Metodo para validar las politicas de la confirmacion de la contraseña
   */
  validarConfirmContrasena() {
    if (this.formGroupCambioPass.get('passwordNew').value !== this.formGroupCambioPass.get('passwordNewConfirm').value) {
      this.formGroupCambioPass.get('passwordNewConfirm').setErrors({ invalidPass: true });
    }
  }

}
