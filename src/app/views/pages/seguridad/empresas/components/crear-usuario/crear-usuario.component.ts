import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ECamposValidar, ObjCamposValidar } from '@core/enum/CamposValidar.enum';
import { EMensajeModal } from '@core/enum/mensajeModal.enum';
import { EModalSize } from '@core/enum/modalSize.enum';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETipo } from '@core/enum/tipo.enum';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { Departamento } from '@core/interfaces/departamento.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { Municipio } from '@core/interfaces/municipio.interface';
import { Usuario } from '@core/interfaces/seguridad/usuario.interface';
import { UsuariosEds } from '@core/interfaces/seguridad/usuarioEds.inteface';
import { GlobalModel } from '@core/model/global.model';
import { ParametrizacionModel } from '@core/model/parametrizacion.model';
import { GeneralUtils } from '@core/utils/general-utils';
import { SortUtils } from '@core/utils/sort-utils';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordComponent } from '@shared/components/change-password/change-password.component';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { Barrio } from '@shared/models/database/barrio.model';
import { Pais } from '@shared/models/database/pais.model';
import { UtilsService } from '@shared/services/utils.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UsuarioModel } from '../../../usuarios/models/usuario.model';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {

  /**
  * Define el form group de informacion del perfil
  */
  public formGroupPerfil: FormGroup;
  /**
   * Define el id de la usuario a consultar
   */
  public idUsuario = 0;
  /**
   * Define si el formulario se puede editar
   */
  public habilitarEditar = true;
  /**
   * Define el formulario para editar o crear la usuario
   */
  public formGroupUsuario: FormGroup;
  /**
   * Array de tipos de usuarios
   */
  public tiposUsuarios: Array<TipoDetalle> = [];
  /**
   * Array de los tipos de identificacion
   */
  public tiposIdentificacion: Array<TipoDetalle> = [];
  /**
   * Array de tipos de identificacion para una persona
   */
  public paises: Array<Pais> = [];
  /**
   * Array de los departamentos registrados
   */
  public departamentos: Array<Departamento> = [];

  /**
   * Array de los municipios registradas
   */
  public municipios: Array<Municipio> = [];

  /**
   * Array de los barrios registrados
   */
  public barrios: Array<Barrio> = [];
  /**
   * Tipo de operacion con la que se abre el modal
   */
  public tipoOperacion: string;

  /**
   * Enum para estandarizar campos de validación
   */
  public CamposValidar: ECamposValidar;
  /**
   * Captura el array de los diferentes suscripciones que se realizan en el componente
   */
  private _arraySubcriptors: Array<Subscription> = [];
  /**
   * Método llamado al construir el componente
   * @param data Data que llega al modal
   * @param dialogRef referencia del modal 
   * @param _formBuilder Builder de formulario
   * @param _parametrizacionModel modelo de parametrizaciones 
   * @param _globalModel modelo global
   * @param _matDialog modal material
   * @param _translateService servicio de traducciones
   * @param _usuarioModel modelo de usuario
   * @param _utilService servicio de utilidades
   * @param _activatedRoute Variable que define las propíedades y metodos del active router
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _parametrizacionModel: ParametrizacionModel,
    private _globalModel: GlobalModel,
    public _matDialog: MatDialog,
    private _translateService: TranslateService,
    private _usuarioModel: UsuarioModel,
    private _utilService: UtilsService,
    private _activatedRoute: ActivatedRoute
  ) { }
  /**
   * get utilizado para obtener el id de la empresa
   */
  get idEmpresa() {
    return this._activatedRoute.snapshot.url[1]?.path;
  }
  /**
   * Método llamado al crear el componente
   */
  ngOnInit(): void {
    this.tipoOperacion = this.data.accion;
    if (this.tipoOperacion === ETiposOperacion.consultar) {
      this.habilitarEditar = false;
    }
    this.iniciarFormularios();
    this.obtenerDatosIniciales();
    this.CamposValidar = ObjCamposValidar
  }
  /**
   * Inicializa las propiedades de los campos de los formularios utilizados
   */
  private iniciarFormularios(): void {
    this.formGroupUsuario = this._formBuilder.group({
      id: [0],
      // Datos basicos
      primerNombre: ['', Validators.compose([Validators.required])],
      segundoNombre: ['', Validators.compose([])],
      primerApellido: ['', Validators.compose([Validators.required])],
      segundoApellido: ['', Validators.compose([])],
      nombreCompleto: [''],
      idTipoIdentificacion: ['', Validators.compose([Validators.required])],
      identificacion: ['', Validators.compose([Validators.required])],
      rutaAvatar: ['', Validators.compose([])],
      estadoRegistro: ['', Validators.compose([Validators.required])],
      cargo: ['', Validators.compose([Validators.required])],

      // Datos de contacto
      indicativoCelular: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.required])],
      indicativoTelefono: ['', Validators.compose([Validators.required])],
      telefono: ['', Validators.compose([Validators.required])],
      idPais: ['', Validators.compose([Validators.required])],
      idDepartamento: ['', Validators.compose([Validators.required])],
      idMunicipio: ['', Validators.compose([Validators.required])],
      direccion: ['', Validators.compose([Validators.required])],

      // Datos cuenta
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._-]+[@]+[a-zA-Z0-9-]+([.][a-zA-Z]{2,4})+')])],
      userName: [''],
      idTipoUsuario: ['', Validators.compose([Validators.required])],
      usuariosEds: ['', Validators.compose([Validators.required])],

      //Datos de contraseña nueva
      passwordNew: [null],
      passwordNewConfirm: [null],

      //Identificador usuarios nuevos
      uidNewUsers: [null]
    });
    if (this.tipoOperacion !== ETiposOperacion.crear) this.formGroupUsuario.get('email').disable({ emitEvent: false });
    this.subscribirCambios();
  }
  /**
   * Metodo utilizado para obtener datos iniciales en el sistema
   */
  private obtenerDatosIniciales(): void {
    this.obtenerPaises();
    this.obtenerTiposIdentificaciones();
    this.obtenerTiposUsuarios();
    if (this.data.usuario) {
      this.obtenerUsuarioPorId();
    }
  }
  /**
   * Método para obtener la información del usuario por id
   */
  private obtenerUsuarioPorId(): void {
    if (this.tipoOperacion === ETiposOperacion.consultar) this.formGroupUsuario.disable({ emitEvent: false });

    if (this.data.usuario?.id != 0 && (!this.data.usuario?.usuariosEds || this.data.usuario?.usuariosEds?.length == 0)) {
      this.idUsuario = this.data.usuario?.id;
      this._usuarioModel.selected(this.idUsuario);

      this._usuarioModel.usuario$.subscribe((usuario: Usuario) => {
        if (!!usuario) {
          const { usuariosEds } = GeneralUtils.cloneObject(usuario)
          this.formGroupUsuario.patchValue({ usuariosEds }, { emitEvent: true });
        }
      });
    }

    const selectedUser = GeneralUtils.cloneObject(this.data.usuario)
    this.formGroupUsuario.patchValue(selectedUser, { emitEvent: true });
    this.formGroupUsuario.get('indicativoCelular').patchValue(selectedUser.indicativoCelular.toString());
    this.formGroupUsuario.get('indicativoTelefono').patchValue(selectedUser.indicativoTelefono.toString());
  }
  /**
   * Metodo utilizado para obtener paises
   */
  private obtenerPaises(): void {
    this._globalModel.obtenerPaises().subscribe(({ data }) => this.paises = data);
  }/**
   * Metodo utilizado para obtener tipos de identidicaciones
   */
  private obtenerTiposIdentificaciones(): void {
    this._parametrizacionModel.obtenerParametrizacionesPorCriterios([{ campo: 'idTipo', valor: ETipo.tiposDeDocumentos }])
      .subscribe(({ data }) => this.tiposIdentificacion = data);
  }

  /**
   * Metodo utilizado para obtener tipos de usuarios
   */
  private obtenerTiposUsuarios(): void {
    this._parametrizacionModel.obtenerParametrizacionesPorCriterios([{ campo: 'idTipo', valor: ETipo.tiposUsuarios }])
      .subscribe(({ data }) => this.tiposUsuarios = data);
  }

  /**
   * Metodo utilizado para obtener departamentos dependiendo del pais escogido
   * @param idPais del cual se desean encontrar los departamentos
   */
  private obtenerDepartamentos(idPais: number): void {
    this._globalModel.obtenerDepartamentos([{ campo: 'idPais', valor: idPais }]).subscribe(({ data, status }) => {
      if (status && data?.length > 0) {
        this.departamentos = data
        this.departamentos = SortUtils.getSortJsonV2(this.departamentos, 'nombre', 'asc');

      }
    });
  }

  /**
   * Metodo utilizado para obtener municipios dependiendo del pais escogido
   * @param idDepartamento del cual se desean encontrar las municipios
   */
  private obtenerMunicipios(idDepartamento: number): void {
    this._globalModel.obtenerMunicipios([{ campo: 'idDepartamento', valor: idDepartamento }]).subscribe(({ data, status }) => {
      if (status && data?.length > 0) {
        this.municipios = data;
        this.municipios = SortUtils.getSortJsonV2(this.municipios, 'nombre', 'desc');
      }
    });
  }

  /**
   * Metodo usado para subcribir los cambios del formulario
   */
  private subscribirCambios(): void {
    const primerNombreFormSubscription: Subscription = this.formGroupUsuario.get('primerNombre').valueChanges.subscribe(valor => {
      if (valor) {
        this.armaNombreCompleto();
      }
    });

    const segundoNombreFormSubscription: Subscription = this.formGroupUsuario.get('segundoNombre').valueChanges.subscribe(valor => {
      if (valor) {
        this.armaNombreCompleto();
      }
    });

    const primerApellidoFormSubscription: Subscription = this.formGroupUsuario.get('primerApellido').valueChanges.subscribe(valor => {
      if (valor) {
        this.armaNombreCompleto();
      }
    });

    const segundoApellidoFormSubscription: Subscription = this.formGroupUsuario.get('segundoApellido').valueChanges.subscribe(valor => {
      if (valor) {
        this.armaNombreCompleto();
      }
    });

    const identificacionFormSubscription: Subscription = this.formGroupUsuario.get('identificacion').valueChanges.subscribe(valor => {
      if (valor) {
        this.armaNombreCompleto();
      }
    });

    const idTipoIdentificacionFormSubscription: Subscription = this.formGroupUsuario.get('idTipoIdentificacion').valueChanges.subscribe(valor => {
      if (valor) {
        this.armaNombreCompleto();
      }
    });
    const UserNameFormSubscription: Subscription = this.formGroupUsuario.get('userName').valueChanges
      .pipe(
        debounceTime(1000),
      )
      .subscribe(valor => {
        if (valor) {
          this.validarCampos('UserName', 'userName');
        }
      });
    const idPaisFormSubscription: Subscription = this.formGroupUsuario.get('idPais').valueChanges.subscribe(valor => {
      this.departamentos = [];
      if (!!valor) {
        this.formGroupUsuario.get('idDepartamento').patchValue('');
        this.obtenerDepartamentos(valor);
      }
    });

    const idDepartamentoFormSubscription: Subscription = this.formGroupUsuario.get('idDepartamento').valueChanges.subscribe(valor => {
      this.municipios = [];
      if (!!valor) {
        this.formGroupUsuario.get('idMunicipio').patchValue('');
        this.obtenerMunicipios(valor);
      }
    });

    this._arraySubcriptors.push(primerNombreFormSubscription,
      segundoNombreFormSubscription,
      primerApellidoFormSubscription,
      segundoApellidoFormSubscription,
      identificacionFormSubscription,
      idTipoIdentificacionFormSubscription,
      idPaisFormSubscription,
      idDepartamentoFormSubscription,
      UserNameFormSubscription)
  }

  /**
   * Metodo que arma el nombre completo para asignarlo al arreglo temporal de usuario
   */
  private armaNombreCompleto(): void {
    let nombreCompleto = '';
    let userName = '';
    if (this.formGroupUsuario.get('primerNombre').value && this.formGroupUsuario.get('primerNombre').value !== '') {
      userName += this.formGroupUsuario.get('primerNombre').value.substring(0, 1);
      nombreCompleto += this.formGroupUsuario.get('primerNombre').value + ' ';
    }
    if (this.formGroupUsuario.get('segundoNombre').value && this.formGroupUsuario.get('segundoNombre').value !== '') {
      nombreCompleto += this.formGroupUsuario.get('segundoNombre').value + ' ';
    }
    if (this.formGroupUsuario.get('primerApellido').value && this.formGroupUsuario.get('primerApellido').value !== '') {
      userName += this.formGroupUsuario.get('primerApellido').value;
      nombreCompleto += this.formGroupUsuario.get('primerApellido').value + ' ';
    }
    if (this.formGroupUsuario.get('segundoApellido').value && this.formGroupUsuario.get('segundoApellido').value !== '') {
      nombreCompleto += this.formGroupUsuario.get('segundoApellido').value + ' ';
    }
    if (this.formGroupUsuario.get('identificacion').value && this.formGroupUsuario.get('identificacion').value !== '') {
      const caracteres = this.formGroupUsuario.get('identificacion').value.length;
      userName += this.formGroupUsuario.get('identificacion').value.substring((caracteres - 4), caracteres);
    }

    nombreCompleto = nombreCompleto.substring(0, (nombreCompleto.length - 1));
    this.formGroupUsuario.patchValue({ nombreCompleto });

    userName = GeneralUtils.normalizarVocalesConSignos(userName.toLowerCase());
    if (this.idUsuario || this.idUsuario === 0) {
      this.formGroupUsuario.patchValue({ userName });
    }
  }

  /**
   * Metodo para habilitar la edición del usuario
   */
  public habilitarEdicion(): void {
    this.formGroupUsuario.enable({ emitEvent: false });
    this.formGroupUsuario.get('estadoRegistro').disable({ emitEvent: false });
    this.formGroupUsuario.get('email').disable({ emitEvent: false });
    if (this.tipoOperacion === ETiposOperacion.editar) {
      this.formGroupUsuario.get('userName').disable({ emitEvent: false });
    }
    this.habilitarEditar = true;
  }
  /**
   * Método para recibir usuarios eds
   * @param event Evento de usuarios eds
   */
  public recibeUsuariosEds(event: Array<UsuariosEds>): void {
    this.formGroupUsuario.get('usuariosEds').setValue(event);
  }

  /**
   * Abre el modal para confirmar la cancelacion de la accion Crear o Editar
   * @param tipo Determina la logica implementada para mostrar el modal de confirmacion de operacion
   */
  public abrirModalConfirmarOperacion(tipo: boolean): void {
    const { valid } = this.formGroupUsuario;
    if ((tipo && valid) || !tipo) {
      let title: string;
      if (tipo) {
        if ((this.idUsuario && this.idUsuario !== 0)) {
          title = EMensajeModal.confirmacionEditar
        } else {
          title = EMensajeModal.confirmacionGuardar;
        }
      } else {
        title = EMensajeModal.confirmacionCancelar;
      }
      this._matDialog.open(ModalTiposComponent, {
        data: {
          descripcion: title,
          icon: '15',
          txtButton1: this._translateService.instant('BOTONES.CONFIRMAR'),
          txtButton2: this._translateService.instant('BOTONES.CANCELAR'),
        },
        panelClass: 'modal-confirmacion',
      })
        .afterClosed().subscribe((result) => {
          if (!!result) {
            tipo ? this.aceptarSubmit() : this.cancelarSubmit();
          }
        });
    } else if (this.formGroupUsuario.get('usuariosEds').value.length == 0) {
      this._utilService.procesarMessageWebApi(this._translateService.instant('TITULOS.VALIDAR_EDS_ASOCIADA'), ETiposError.error);
    }
  }
  /**
   * Método cuando se acepta el submit
   */
  private aceptarSubmit(): void {
    if (this.formGroupUsuario.valid) {
      this.dialogRef.close({ data: this.formGroupUsuario.value });
    }
  }
  /**
   * Método cuando se cancela el submit
   */
  private cancelarSubmit(): void {
    this.dialogRef.close();
  }

  /**
   * Metodo utilizado para abrir modal de cambio de contraseña
   */
  public modalChangePass() {
    const dialogRef = this._matDialog.open(ChangePasswordComponent, {
      width: EModalSize.medium.width,
      panelClass: 'cw-modal-estadoregistro',
      data: {
        idUsuario: this.idUsuario,
        username: this.formGroupUsuario.get('userName').value,
        esMisDatos: false
      }
    });
    const modalSuscripcion: Subscription = dialogRef.afterClosed().subscribe(res => {
      if (res.data) {
        const { passwordNew, passwordNewConfirm } = res.data;
        this.formGroupUsuario.get('passwordNew').setValue(passwordNew);
        this.formGroupUsuario.get('passwordNewConfirm').setValue(passwordNewConfirm);
      }
    });
    this._arraySubcriptors.push(modalSuscripcion);
  }

  /**
   * Metodo usado para validar el codigo sicom
   * @param tipoValidacion nombre de tipo de validación que se requiere hacer 
   * @param _campoAValidar nombre de campo que se requiere validar
   */
  public validarCampos(tipoValidacion: string, _campoAValidar: string): void {
    const campoAValidar = this.formGroupUsuario.get(_campoAValidar).value;
    const idUsuario: string = this.formGroupUsuario.get('id').value;
    let Criterios: Array<ObjParam> = [{ campo: _campoAValidar, valor: campoAValidar }];
    const message = this._translateService.instant('FORMULARIOS.CAMPO_DIGITADO_EXISTENTE');
    if (idUsuario != null && idUsuario != '0') Criterios = [...Criterios, { campo: 'IdUsuario', valor: idUsuario },]
    if (!!campoAValidar)
      this._usuarioModel.ValidarExisteUsuarioCampos(tipoValidacion, Criterios).subscribe(({ data, status }) => {
        if (!!status && data == true) {
          this.errorCampoAValidar(_campoAValidar, message);
        }
      }, error => this.errorCampoAValidar(_campoAValidar, error.error));
  }

  /**
   * Metodo para realizar accion en caso de que exista codigo sicom
   * @param message mensaje a mostrar
   * @param campoValidado Campo que se intentó validar
   */
  private errorCampoAValidar(campoValidado: string, message: string): void {
    this._utilService.procesarMessageWebApi(message, ETiposError.error);
    this.formGroupUsuario.get(campoValidado).setValue(null);
    this.formGroupUsuario.get(campoValidado).markAllAsTouched();
  }

}
