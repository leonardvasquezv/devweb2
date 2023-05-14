import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { GeneralUtils } from '@core/utils/general-utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { Utils } from '@shared/global/utils';
import { Subscription } from 'rxjs';
import { EmpresaModel } from './../../models/empresa.model';

@Component({
  selector: 'app-listar-perfil',
  templateUrl: './listar-perfil.component.html',
  styleUrls: ['./listar-perfil.component.scss']
})
export class ListarPerfilComponent implements OnInit, OnDestroy {

  /**
   * Propiedad que define la lista de perfiles
   */
  public arrayPerfiles: Array<Perfil> = [];

  /**
   * Propiedad que define la lista de perfiles filtrados;
   */
  public arrayPerfilesFiltered: Array<Perfil> = [];

  /**
   *Propiedad que contiene si el boton está hablilitado
   */
  public habilitarBoton: boolean = true;

  /**
   *Propiedad que contiene si la lista se encuentra vacia
   */
  public listaLimpia: boolean = true;

  /**
   *Propiedad que contiene el objeto de perfil seleccionado
   */
  public perfilSeleccionado: Perfil = null;

  /**
  * Instancia de suscripciones
  */
  private _suscripciones = new Subscription();

  /**
   * Define el form group de informacion de la empresa
   */
  public formGroupInformacionEmpresa: FormGroup;

  /**
  * Instancia del compoenente de lista de material
  */
  @ViewChild('perfiles') perfilesMatList: MatSelectionList

  /**
   * Constructor del componente de listar perfil
   * @param _activedRoute define las propiedades y atributos  de la ruta activa
   * @param _empresaModel define las propiedades y atributos  del modelo de empresa
   * @param _dialog define las propiedades y atributos  del dialogo de material
   * @param _translateService define las propiedades y atributos  de libreria de traduccion
   * @param _rootFormGroup define las propiedades y atributos del formulario reactivo
   */
  constructor(
    private _activedRoute: ActivatedRoute,
    private _empresaModel: EmpresaModel,
    private _dialog: MatDialog,
    private _translateService: TranslateService,
    private _rootFormGroup: FormGroupDirective
  ) { }

  /**
   * get utilizado para obtener el tipo de operacion
   */
  get tipoOperacion() {
    return this._activedRoute.snapshot.url[0].path;
  }
  /**
   * get utilizado para saber si es consulta
   */
  get esConsulta() {
    return this.tipoOperacion === ETiposOperacion.consultar
  }

  /**
   * get utilizado para obtener el id de la empresa
   */
  get idEmpresa() {
    return this._activedRoute.snapshot.url[1].path;
  }

  /**
   * get utilizado para obtener si el formulario se encuentra en modo creacion
   */
  get esCrear() {
    return this.tipoOperacion === ETiposOperacion.crear;
  }

  /**
   * Metodo inicializador del componente de listar perfil
   */
  ngOnInit(): void {
    this._cambiosFormularioPerfil();
    if (!this.esCrear) {
      this.getAllPerfiles();
    } else {
      this._validarArray();
    }
  }

  /**
   * Metodo destructor del componente de listar perfil
   */
  ngOnDestroy(): void {
    this._empresaModel.asignarEstadoFormularioPerfil(false);
    this._suscripciones.unsubscribe();
  }

  /**
   * Metodo utilizado para obtener los datos iniciales del componente
   */
  public obtenerDatosIniciales(): void {
    this.formGroupInformacionEmpresa = this._rootFormGroup.control.get('formGroupInformacionEmpresa') as FormGroup;
  }

  /**
   * Metodo encargado de escuchar cambios en el filtro
   * @param value array con respuesta del fitlro
   */
  public obtenerTextoPredictivo(value: Array<ObjParam>): void {
    const nombrePerfil = Utils.normalizeString(value[1].valor?.toLocaleLowerCase());
    this.arrayPerfilesFiltered = !!nombrePerfil ? this.arrayPerfiles?.filter(perfil => Utils.normalizeString(perfil?.nombre?.toLocaleLowerCase()).includes(nombrePerfil)) : this.arrayPerfiles;
  }

  /**
   * Metodo encargado de generar acciones a partir
   * de la seleccion de un item de la lista de perfiles
   * @param event objeto con conenido del registro seleccionado
   */
  public selectList(event: any): void {
    if (!!event.option) {
      const value = event.option._value;
      if (!this.habilitarBoton) {
        this._confirmacionCambiarRegistro(value);
      } else {
        this._cambiarRegistro(value);
      }
    }
  }

  /**
   * Metodo encargado de crear nuevo perfil
   */
  public crearNuevoPerfil(): void {
    this.perfilSeleccionado = this._empresaModel.perfilDefault;
    this.arrayPerfiles.unshift(this.perfilSeleccionado);
    this._validarArray();
    if (this.arrayPerfiles.length > 1) {
      this.habilitarBoton = false;
    }
  }

  /**
   * Metodo encargado de recibir informacion del perfil
   * @param perfilEnviado que recibe del compononente de formulario perfil
   */
  public recibirFormularioPerfil(perfilEnviado: Perfil): void {
    if (!!perfilEnviado) {
      if (perfilEnviado.temporal) {
        this.arrayPerfiles[0] = perfilEnviado;
        this.arrayPerfiles[0].temporal = false;
        this.arrayPerfiles[0].perfilModificado = true;
      } else {
        const index = this.arrayPerfiles.findIndex(perfil => perfil.nombre === this.perfilSeleccionado?.nombre);
        this.arrayPerfiles[index] = perfilEnviado;
        this.arrayPerfiles[index].modificado = true;
        this.arrayPerfiles[index].perfilModificado = true;
      }
    } else {
      this.arrayPerfiles = this.arrayPerfiles.filter(perfil => perfil?.temporal !== true);
    }
    this._validarArray();
    this.habilitarBoton = true;
    this.perfilSeleccionado = null;
    this.perfilesMatList.options.forEach((option: MatListOption) => {
      if (option['_selected']) {
        option._setSelected(false);
        this.perfilesMatList._reportValueChange();
      }
    });
  }
  /**
   * Método encargado de recibir usuarios del perfil
   * @param usuariosPerfil array de usuarios
   */
  public recibirUsuariosPerfil(usuariosPerfil: any): void {
    const { arrayUsuarios } = usuariosPerfil;
    if (usuariosPerfil.nombre && arrayUsuarios.length > 0) {
      const index = this.arrayPerfiles.findIndex(perfil => perfil.nombre === usuariosPerfil.nombre);
      this.arrayPerfiles[index].usuarios = [...arrayUsuarios];
      this.arrayPerfiles[index].modificado = true;
    }
  }

  /**
 * Metodo encargado de eliminar un registro seleccionado
 * @param nombrePerfil del registro seleccionado
 */
  public eliminarRegistro(nombrePerfil: string): void {
    const dialogRefSubscription: Subscription = this._modalTipos('TITULOS.CONFIRMAR_ELIMINAR', '15')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.arrayPerfiles = this.arrayPerfiles.filter(perfil => perfil?.nombre !== nombrePerfil);
          this.perfilSeleccionado = null;
          this._validarArray();
        }
      });
    this._suscripciones.add(dialogRefSubscription);
  }

  /**
   * metodo encargado de escuchar el estado del formulario del perfil
   */
  private _cambiosFormularioPerfil(): void {
    this._empresaModel.formularioPerfilEditado$.subscribe(value => this.habilitarBoton = !value);
    this.obtenerDatosIniciales();
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

  /**
   * Abrir modal de confirmación para cambiar de registro
   * @param value indica el nombre del registro de perfil seleccionado
   */
  private _confirmacionCambiarRegistro(value: string): void {
    const dialogRefSubscription: Subscription = this._modalTipos('MENSAJES.PERDER_PROGRESO', '15')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.arrayPerfiles = this.arrayPerfiles.filter(perfil => perfil?.temporal !== true);
          this._validarArray();
          this._cambiarRegistro(value);
        } else {
          this.arrayPerfiles.forEach(perfil => { if (perfil.nombre === this.perfilSeleccionado?.nombre) perfil.temporal = true });
          this._validarArray();
          this.arrayPerfiles.forEach(perfil => { if (perfil.nombre === this.perfilSeleccionado?.nombre && !this.perfilSeleccionado?.nuevo) perfil.temporal = false });
        }
      });
    this._suscripciones.add(dialogRefSubscription);
  }

  /**
   * metodo encargado de cambiar de registro
   * @param value nombre del perfil seleccionado
   */
  private _cambiarRegistro(value: string): void {
    this.habilitarBoton = true;
    this.perfilSeleccionado = this.arrayPerfiles?.find(perfil => perfil.nombre === value);
    setTimeout(() => { this._empresaModel.asignarEstadoFormularioPerfil(false) }, 0);
    if (!!this.perfilSeleccionado?.id && !this.perfilSeleccionado?.modificado) {
      this._empresaModel.obtenerPerfilPorId(this.perfilSeleccionado?.id).subscribe(({ data, status }) => {
        if (status) {
          this.perfilSeleccionado = data;
        }
      });
    }
  }

  /**
   * Metodo privado encargado de validar el array con respectos a las acciones
   */
  private _validarArray(): void {
    this.arrayPerfilesFiltered.length = 0;
    this.arrayPerfilesFiltered = JSON.parse(JSON.stringify(this.arrayPerfiles));
    this.listaLimpia = (this.arrayPerfiles.length === 1 && this.arrayPerfiles[0].temporal) || this.arrayPerfiles.length === 0;
    if (this.arrayPerfiles.length === 0) {
      this.crearNuevoPerfil();
    }
    if ((this.arrayPerfiles.length === 1 && this.arrayPerfiles[0].temporal)) {
      this.perfilSeleccionado = this.arrayPerfiles[0];
    }
    this.formGroupInformacionEmpresa?.get('perfiles')?.setValue(this.arrayPerfiles.filter(perfil => perfil?.temporal !== true));
  }

  /**
  * Metodo utilizado para obtener todos los perfiles
  */
  public getAllPerfiles(): void {
    this._empresaModel.obtenerPerfilPorCriterios([{ campo: 'idEmpresa', valor: +this.idEmpresa }]).subscribe(({ status, message, data }) => {
      if (status) {
        this.arrayPerfiles = data;
        this.arrayPerfilesFiltered = GeneralUtils.cloneObject(this.arrayPerfiles);
        this._validarArray();
      }
    });
  }

}
