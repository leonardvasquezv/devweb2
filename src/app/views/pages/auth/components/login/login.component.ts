import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ObjFile } from "@core/interfaces/base/objImagenFile.interface";
import { TranslateService } from "@ngx-translate/core";
import { ObjIdioma } from "@shared/models/objIdioma.model";
import { ObjLoginUser } from "@shared/models/objLoginUser.model";
import { AuthModel } from "../../models/auth.model";
import { OlvidoContrasenaComponent } from "../olvido-contrasena/olvido-contrasena.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /**
   * Propiedad que indica el idioma seleccionado
   */
  public idiomaSeleccionado: ObjIdioma;

  /**
   * Formulario para crear o editar un modulo
   */
  public formGroupLogin: FormGroup;

  /**
   * Maneja la visibilidad en un componente del DOM
   */
  public hide = true;

  /**
   * Variable que define el array de imagenes del carrusel
   */
  public arrayImagenes: Array<ObjFile> = [];

  /**
   * Constructor del componente de autenticacion
   * @param _router maneja las propiedades de navegacion del componente
   * @param _route maneja las propiedades de las rutas del componente
   * @param _formBuilder maneja la construccion del componente
   * @param translate maneja las traducciones en el sistema
   * @param _matDialog maneja los modales proporcionados por angular material
   */
  constructor(
    @Inject(DOCUMENT) private translate: TranslateService,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private authModel: AuthModel
  ) { }

  /**
   * Metodo inicial para inicializar el componente de autenticacion
   */
  ngOnInit(): void {
    this.iniciarFormularios();
  }

  /**
   * Inicializa las propiedades de los campos de los formularios utilizados
   */
  private iniciarFormularios(): void {
    this.formGroupLogin = this._formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      recordarContrasena: [false, Validators.compose([])]
    });
  }

  /**
   * metodo encargado de iniciar sesion en el sistema
   * @param event evento capturado al iniciar sesion
   */
  public login(event: any): void {
    event.preventDefault();
    if (this.formGroupLogin.valid) {
      let { username, password, recordarContrasena } = this.formGroupLogin.value;
      password = btoa(password);
      let loginUser: ObjLoginUser = new ObjLoginUser();
      loginUser.username = username;
      loginUser.password = password;
      loginUser.reCaptcha = '';
      loginUser.rememberMe = recordarContrasena;
      loginUser.fechaCreacion = new Date();
      this.authModel.login(loginUser);
    }
  }

  /**
   * Metodo utilizado para cambiar de idioma
   * @param idioma Objeto con el idioma seleccionado
   */
  public cambiarIdioma(idioma: ObjIdioma): void {
    this.idiomaSeleccionado = idioma;
    this.translate.use(idioma.title);
  }

  /**
   * Metodo usado para renderizar el componente de olvido de contraseña en un modal
   */
  public modalOlvidoContrasena(): void {
    this._matDialog.open(OlvidoContrasenaComponent, {
      data: {
        usuario: this.formGroupLogin.get('username').value
      },
      panelClass: 'modal-login'
    });
  }
}
