import { FormGroup, FormGroupDirective } from '@angular/forms';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { GeneralUtils } from '@core/utils/general-utils';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EmpresaModel } from './../../models/empresa.model';

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Pagina } from '@core/interfaces/seguridad/pagina.interface';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { Permiso } from '@core/interfaces/seguridad/permiso.interface';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { Utils } from '@shared/global/utils';
import { PerfilesPaginasPermisos } from '@shared/models/database/perfilesPaginasPermisos.model';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.scss']
})
export class PermisoComponent implements OnInit, OnDestroy, OnChanges {

  /**
  * array general de las paginas del sistema
  */
  public arrayPaginas: Array<Pagina> = [];

  /**
  * array general de las paginas filtradas del sistema
  */
  public arrayPaginasFiltered: Array<Pagina> = [];

  /**
  * pagina seleccionada del listado de paginas
  */
  public paginaSeleccionada: Pagina = null;

  /**
   * Instancia de suscripciones
   */
  private _suscripciones = new Subscription();

  /**
  * Define el form group de informacion del perfil
  */
  public formGroupPerfil: FormGroup;

  /**
   * Define el perfil seleccionado
   */
  @Input() perfilSeleccionado: Perfil = null;

  /**
  * array general de las permisos del sistema
  */
  public arrayPermisos: Array<Permiso> = [];

  /**
   * array general de las permisos del sistema modificado segun paginas
   */
  public arrayPermisosEnviar: Array<Permiso> = [];

  /**
 * array general de las permisos del sistema modificado segun paginas
 */
  public estadoModificacionPermisos: boolean = false;

  /**
  * Metodo encargado de construir el componente de permisos
  * @param _empresaModel define las propiedades y atributos  del modelo de empresa
  * @param _rootFormGroup define las propiedades y atributos del formulario reactivo
  * @param _dialog define las propiedades y atributos  del dialogo de material
  * @param _translateService define las propiedades y atributos  de libreria de traduccion
  */
  constructor(
    private _empresaModel: EmpresaModel,
    private _rootFormGroup: FormGroupDirective,
    private _dialog: MatDialog,
    private _translateService: TranslateService,
  ) {
  }

  /**
   * Metodo encargado de escuchar los cambios de propiedades de entrada
   * @param changes que envia el componente padre
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.perfilSeleccionado.currentValue) {
      this.paginaSeleccionada = null;
    }
  }

  /**
   * Metodo encargado de inicializar el componente de permisos
   */
  ngOnInit(): void {
    this.obtenerDatosIniciales();
    this.inicializarFormGroup();
  }

  /**
   * Metodo destructor del componente de listar permisos
   */
  ngOnDestroy(): void {
    this._suscripciones.unsubscribe();
  }

  /*
  * Función para inicializar formgroup
  */
  public inicializarFormGroup(): void {
    this.formGroupPerfil = this._rootFormGroup.control.get('formGroupPerfiles') as FormGroup;
  }

  /**
   * Metodo usado para obtener datos iniciales
   */
  public obtenerDatosIniciales(): void {
    const paginasSubscription: Subscription = this._empresaModel.paginas$.subscribe(paginas => {
      this.arrayPaginas = GeneralUtils.cloneObject(paginas);
      this.arrayPaginas.forEach(pagina => pagina.hijosFiltered = pagina?.hijos);
      this.arrayPaginasFiltered = GeneralUtils.cloneObject(this.arrayPaginas);
    });
    const permisosSubscription: Subscription = this._empresaModel.permisos$.subscribe(value => {
      this.arrayPermisos = GeneralUtils.cloneObject(value);
      this.arrayPermisos?.forEach(permiso => permiso.checked = false);
    });
    this._suscripciones.add(paginasSubscription);
    this._suscripciones.add(permisosSubscription);
  }

  /**
   * Metodo para obtener cual es la pagina seleccionada mediante una validacion
   * @param pagina enviada en el evento de click
   */
  public validarPanel(pagina: Pagina): void {
    if (this.estadoModificacionPermisos) {
      const dialogRefSubscription: Subscription = this._modalTipos('MENSAJES.PERDER_PROGRESO', '15')
        .afterClosed().subscribe((result) => {
          if (!!result) {
            this.estadoModificacionPermisos = false;
            this.seleccionarPagina(pagina);
          }
        });
      this._suscripciones.add(dialogRefSubscription);
    }
  }

  /**
   * Metodo para obtener cual es la pagina seleccionada
   * @param pagina enviada en el evento de click
   */
  public seleccionarPagina(pagina: Pagina): void {
    if (!(this.paginaSeleccionada?.idPaginaPadre === pagina.id && this.paginaSeleccionada?.checked) || !this.paginaSeleccionada?.checked) {
      this.paginaSeleccionada = pagina;
      this.paginaSeleccionada.checked = true;
      this.armarArrayPermisos();
    }
  }

  /**
   * Metodo utilizado para escuchar cuando el panel se cierra
   * @param pagina que se cierra en el panel
   */
  public cerrarPanel(pagina: Pagina): void {
    if (pagina.id === this.paginaSeleccionada?.id || this.paginaSeleccionada?.idPaginaPadre === pagina.id)
      this.paginaSeleccionada = null;
  }

  /**
  * Metodo encargado de escuchar cambios en el filtro
  * @param value array con respuesta del fitlro
  */
  public obtenerTextoPredictivo(value: Array<ObjParam>): void {
    const nombrePagina = Utils.normalizeString(value[1].valor?.toLocaleLowerCase());
    const filterFnc = (pagina: Pagina) => {
      pagina.hijosFiltered = pagina?.hijos?.filter(hijo => Utils.normalizeString(hijo?.nombre?.toLocaleLowerCase()).includes(nombrePagina));
      return Utils.normalizeString(pagina?.nombre?.toLocaleLowerCase()).includes(nombrePagina) ||
        pagina?.hijosFiltered?.some(hijo => Utils.normalizeString(hijo?.nombre?.toLocaleLowerCase()).includes(nombrePagina));
    };

    if (!!!nombrePagina) {
      this.arrayPaginas.forEach(pagina => pagina.hijosFiltered = pagina?.hijos);
      this.arrayPaginasFiltered = GeneralUtils.cloneObject(this.arrayPaginas);
    } else {
      this.arrayPaginasFiltered = this.arrayPaginas?.filter(filterFnc);
    }
  }

  /**
   * Metodo encargado de recibir los permisos
   * @param permisos de la pagina seleccionada
   */
  public recibirPermiso(permisos: Array<Permiso>): void {
    const permisosPorPagina = !!this.perfilSeleccionado?.perfilesPaginasPermisos ? this.perfilSeleccionado?.perfilesPaginasPermisos?.filter(ppp => ppp.idPagina !== this.paginaSeleccionada?.id) : [];
    permisos?.forEach(permiso => {
      if (permiso.checked) {
        const perfilPaginaPermiso: PerfilesPaginasPermisos = new PerfilesPaginasPermisos();
        perfilPaginaPermiso.idPagina = this.paginaSeleccionada.id;
        perfilPaginaPermiso.idPerfil = this.perfilSeleccionado.id;
        perfilPaginaPermiso.idPermiso = permiso.id;
        permisosPorPagina.push(perfilPaginaPermiso);
      }
    });
    this.paginaSeleccionada = null;
    this.perfilSeleccionado.perfilesPaginasPermisos = permisosPorPagina;
    this.formGroupPerfil.get('perfilesPaginasPermisos').patchValue(permisosPorPagina);
    this.formGroupPerfil.markAsDirty();
    this._empresaModel.asignarEstadoFormularioPerfil(true);
  }

  /**
   * Metodo utilizado para armar array de permisos dependiendo
   * de los perfilesPaginasPermisos del perfil seleccionado
   */
  public armarArrayPermisos(): void {
    this.arrayPermisosEnviar = GeneralUtils.cloneObject(this.arrayPermisos);
    const permisosPorPagina = !!this.perfilSeleccionado?.perfilesPaginasPermisos ? this.perfilSeleccionado?.perfilesPaginasPermisos?.filter(ppp => ppp.idPagina === this.paginaSeleccionada?.id) : [];
    this.arrayPermisosEnviar?.forEach(permiso => {
      permisosPorPagina?.forEach(permisoPagina => {
        if (permiso.id === permisoPagina.idPermiso) permiso.checked = true;
      })
    });
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
