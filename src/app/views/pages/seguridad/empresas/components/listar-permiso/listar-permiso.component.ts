import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { Permiso } from '@core/interfaces/seguridad/permiso.interface';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listar-permiso',
  templateUrl: './listar-permiso.component.html',
  styleUrls: ['./listar-permiso.component.scss']
})
export class ListarPermisoComponent implements OnInit, OnDestroy, OnChanges {

  /**
  * define el estado del switch principal
  */
  public estadoSwitch: boolean = false;

  /**
  * define el estado de los botones del formulario
  */
  public showButtons: boolean = false;

  /**
  * Instancia de suscripciones
  */
  private _suscripciones = new Subscription();

  /**
   * nombre de la pagina seleccionada
   */
  @Input() nombrePagina: string = null;

  /**
  * array general de los permisos de la pagina seleccionada
  */
  @Input() arrayPermisos: Array<Permiso> = [];

  /**
   * array de los permisos activos a enviar
   */
  @Output() arrayPermisosEnviar: EventEmitter<Array<Permiso>> = new EventEmitter<Array<Permiso>>();

  /**
  * propiedad que define el estado de modificacion de los permisos
  */
  @Output() estadoModificacion: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Metodo encargado de construir componente de listar permisos
   * @param _dialog define las propiedades y atributos  del dialogo de material
   * @param _translateService define las propiedades y atributos  de libreria de traduccion
   * @param _activedRoute define las propiedades y atributos  de la ruta activa
   */
  constructor(
    private _dialog: MatDialog,
    private _translateService: TranslateService,
    private _activedRoute: ActivatedRoute,
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
   * Metodo encargado de inicializar componente de listar permisos
   */
  ngOnInit(): void {
  }

  /**
  * Metodo destructor del componente de listar permisos
  */
  ngOnDestroy(): void {
    this._suscripciones.unsubscribe();
  }

  /**
   * Metodo utilizado para escuchar los cambios de las variables de entrada
   * @param changes cambios de variables
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.arrayPermisos.currentValue) {
      this.showButtons = false;
      this.estadoModificacion.emit(this.showButtons);
      this.handleCheckedList();
    }
  }

  /**
   * Metodo encargado de manejar los estados genericos de todos los switch
   * @param value del switch principal
   */
  public handleChecked(value: boolean): void {
    this.arrayPermisos.forEach(permiso => permiso.checked = value);
    this.estadoSwitch = value;
    this.showButtons = true;
    this.estadoModificacion.emit(this.showButtons);
  }

  /**
 * Metodo encargado de manejar los estado de un switch del listado de permiso
 * @param value del switch principal
 * @param pos posicion del listado de checks
 */
  public handleCheckedList(value: boolean = null, pos: number = null): void {
    if (value !== null && pos !== null) {
      this.arrayPermisos[pos].checked = value;
      this.showButtons = true;
      this.estadoModificacion.emit(this.showButtons);
    }
    const arrayChecks = this.arrayPermisos.map(p => p.checked);
    if (this.estadoSwitch) {
      if (arrayChecks.some(check => check !== this.estadoSwitch)) this.estadoSwitch = !this.estadoSwitch;
    }
    if (arrayChecks.every(check => check !== this.estadoSwitch)) {
      this.estadoSwitch = !this.estadoSwitch;
    }
  }

  /**
   * Metodo encargado de enviar permisos al componente padre
   * @param aplicar si es accion de aplicar o cancelar
   */
  public eventoEnviarPermisos(aplicar: boolean): void {
    let value = null;
    let message = 'MENSAJES.PERDER_PROGRESO';
    if (aplicar) {
      value = this.arrayPermisos;
      message = 'TITULOS.CONFIRMAR_APLICAR_PERMISOS';
    }
    const dialogRefSubscription: Subscription = this._modalTipos(message, '15')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          this.arrayPermisosEnviar.emit(value);
          this.showButtons = false;
          this.estadoModificacion.emit(this.showButtons);
        }
      });
    this._suscripciones.add(dialogRefSubscription);
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
