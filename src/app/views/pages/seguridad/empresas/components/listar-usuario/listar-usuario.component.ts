import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EEstadosRegistro } from '@core/enum/estadoRegistro.enum copy';
import { EModalSize } from '@core/enum/modalSize.enum';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjPage, pageDefault } from '@core/interfaces/base/objPage.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { Usuario } from '@core/interfaces/seguridad/usuario.interface';
import { FiltrosUtils } from '@core/utils/filtros-utils';
import { GeneralUtils } from '@core/utils/general-utils';
import { CheckPermissionInit } from '@shared/components/check-permission/check-permission-init';
import { ModalEstadoRegistroComponent } from '@shared/components/modal-estado-registro/modal-estado-registro.component';
import { Subscription } from 'rxjs';
import { UsuarioModel } from '../../../usuarios/models/usuario.model';
import { EmpresaModel } from '../../models/empresa.model';
import { CrearUsuarioComponent } from '../crear-usuario/crear-usuario.component';
@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrls: ['./listar-usuario.component.scss']
})
export class ListarUsuarioComponent extends CheckPermissionInit implements OnInit, OnDestroy {

  /**
  * Define el form group de informacion del perfil
  */
  public formGroupPerfil: FormGroup;
  /**
   * Define los usuarios que se muestran en la tabla
   */
  public arrayUsuariosListar: Array<Usuario> = [];
  /**
   * Define los usuarios obtenidos por los servicios
   */
  public arrayUsuarios: Array<Usuario> = [];
  /**
   * Define los usuarios que se han modificado
   */
  public arrayUsuariosModificados: Array<Usuario> = [];
  /**
   * Define los usuarios nuevos
   */
  public arrayUsuariosNuevos: Array<Usuario> = [];
  /**
   * Define el index del ultimo usuario que se selecciono al abrir el modal de activar o inactivar
   */
  private _indexUsuario: number;
  /**
   * Cantidad de usuarios activos 
   */
  public cantidadActivos: number;
  /**
   * Cantidad de usuarios inactivos 
   */
  public cantidadInactivos: number;
  /**
   * Variable que determina que estado de usuario se manda en el filtro
   */
  private filtroEstadoUsuarios: boolean;
  /**
   * Array de filtros habilitados para la tabla
   */
  public arrayFiltros: Array<ObjFiltro> = [];
  /**
   * Array de criterios de filtros seleccionados
   */
  public arrayCriteriosFiltros: Array<ObjParam> = [];
  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage = GeneralUtils.cloneObject(pageDefault);
  /**
   * Id perfil
   */
  public idPerfil: number = 0;
  /**
   * Determina si el perfil está activo
   */
  public perfilActivo: boolean = true;
  /**
   * Booleano que define si empresa tiene eds asociada
   */
  public empresaTieneEdsAsociada: boolean;
  /**
   * Booleano para determinar si la tarjeta de usuarios activos aparece presionada
   */
  public toggleUsuariosActivos: boolean = false;
  /**
   * Booleano para determinar si la tarjetas de usuarios inactivos aparece presionada
   */
  public toggleUsuariosInactivos: boolean = false;
  /**
   * Enum tipos operacion
   */
  public ETiposOperacion = ETiposOperacion;
  /**
   * Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();
  /**
   * Metodo constructor de la clase
   * @param _empresaModel define las propiedades y atributos del modelo de empresa
   * @param _usuarioModel define las propiedades y atributos del modelo de usuario
   * @param _matDialog inyeccion de configuraciones del modal de angular material
   * @param _rootFormGroup define las propiedades y atributos del formulario reactivo
   * @param _activatedRoute variable que permite acceder al servicio de rutas
   */
  constructor(
    private _empresaModel: EmpresaModel,
    private _usuarioModel: UsuarioModel,
    private _matDialog: MatDialog,
    private _rootFormGroup: FormGroupDirective,
    private _activatedRoute: ActivatedRoute
  ) {
    super();
  }
  /**
   * get utilizado para obtener el tipo de operacion
   */
  get tipoOperacion() {
    return this._activatedRoute.snapshot.url[0].path;
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
    return this._activatedRoute.snapshot.url[1]?.path;
  }

  /**
   * Método llamado al crear el componente
   */
  ngOnInit(): void {
    this.tieneEdsAsociadaSubscription();
    this.armaFiltros();
    this.inicializarFormPerfiles();
  }
  /**
   * Método llamado al destruir el componente
   */
  ngOnDestroy(): void {
    this._empresaModel.cleanEmpresaTieneEdsAsociada();
    this._subscriptions.unsubscribe();
  }
  /**
   * Método para escuchar cambios al formulario de perfiles
   */
  private inicializarFormPerfiles(): void {
    this.formGroupPerfil = this._rootFormGroup.control.get('formGroupPerfiles') as FormGroup;
    this.formGroupPerfil.valueChanges.subscribe((value) => {
      if (this.formGroupPerfil.get('id') && this.formGroupPerfil.get('id').value && this.idPerfil !== this.formGroupPerfil.get('id').value) {
        let { id, usuarios } = value;
        this.idPerfil = id;
        usuarios = !!usuarios ? usuarios : [];
        this.arrayUsuariosModificados = usuarios.filter(usuario => usuario.id !== 0);
        this.arrayUsuariosNuevos = usuarios.filter(usuario => usuario.id === 0);
        this.getAllUsuarios();
      }
      if (!this.formGroupPerfil.get('id').value) this.idPerfil = null;
      this.perfilActivo = this.formGroupPerfil.get('estadoRegistro').value === 'A';
      this.cantidadActivos = this.formGroupPerfil.get('usuariosActivos').value;
      this.cantidadInactivos = this.formGroupPerfil.get('usuariosInactivos').value;
    });
  }
  /**
   * Suscripción a si la empresa tiene eds asociadas
   */
  private tieneEdsAsociadaSubscription(): void {
    const tieneEdsAsociadaSubscription: Subscription = this._empresaModel.empresaTieneEdsAsociada$.subscribe(
      (tieneEdsAsociada) => {
        this.empresaTieneEdsAsociada = tieneEdsAsociada;
      }
    )
    this._subscriptions.add(tieneEdsAsociadaSubscription);
  }
  /**
   * Método para definir si el switch se muestra activo o inactivo
   * @param row Usuario de la fila
   * @returns estado del switch
   */
  public checkSwitch(row: Usuario): boolean {
    return row?.estadoRegistro === EEstadosRegistro.activo
  }

  /**
   * Metodo usado para obtener los filtros seleccionados y
   * utilizarlos como criterios de busqueda
   */
  public recibeFiltrosDinamico(event): void {
    const filtro = event.filtros;
    this.arrayCriteriosFiltros = this.obtenerFiltros(filtro);
    this.pageTable.pageNumber = 0;
    this.getAllUsuarios();
  }
  /**
   * Arma los filtros manuales para ser visualizados en el componente de app-filtros-tablas.
   */
  private armaFiltros(): void {
    const filtrosTemp = FiltrosUtils.armarFiltrosGenericos(true, false);
    this.arrayFiltros = GeneralUtils.cloneObject(filtrosTemp);
  }
  /**
   * Metodo utilizado para obtener los filtros seleccionados
   * @param filtro array de filtros
   * @returns array con los filtros seleccionados
   */
  private obtenerFiltros(filtro: Array<ObjFiltro>): Array<ObjParam> {
    let criterios: Array<ObjParam> = [];
    filtro.forEach(item => {
      switch (item.nombreApi) {
        case 'rangoFecha': {
          criterios = FiltrosUtils.obtenerCriteriosRangoFechas(item, criterios);
          break;
        }
        case 'textoPredictivo': {
          criterios = FiltrosUtils.obtenerCriteriosTextoPredictivo(item, criterios);
          break;
        }
      }
    });

    if (this.toggleUsuariosActivos || this.toggleUsuariosInactivos) {
      criterios.push({ campo: 'estadoRegistro', valor: this.filtroEstadoUsuarios ? 'A' : 'I' });
    }
    return criterios;
  }

  /**
   * Metodo utilizado para obtener todos los usuarios de manera paginada
   * @param pagina en la que se está
   * @param pageSize tamaño del la pagina de la consulta
   */
  public getAllUsuarios(pagina = null, pageSize = null): void {
    this.pageTable.pageNumber = pagina ? pagina.offset : 0;
    this.pageTable.size = pageSize ? pageSize : this.pageTable.size;
    const paramsPaginacion = GeneralUtils.setPaginacion(this.pageTable);

    this.arrayCriteriosFiltros = this.arrayCriteriosFiltros.filter(criterio => criterio.campo != 'idPerfil')
    if (this.idPerfil && this.idPerfil !== 0) {
      const criterio: ObjParam = { campo: 'idPerfil', valor: this.idPerfil };
      this.arrayCriteriosFiltros.push(criterio);
    }

    const criteriosFinal = this.arrayCriteriosFiltros.concat(paramsPaginacion);

    this._usuarioModel.getAllUsuarios(criteriosFinal);
    const usuariosSubscription: Subscription = this._usuarioModel.usuarios$.subscribe(usuarios => {
      this.arrayUsuarios = GeneralUtils.cloneObject(usuarios);
      this.arrayUsuariosListar = GeneralUtils.cloneObject(this.filterArrayUsuarios());
    });
    this._subscriptions.add(usuariosSubscription);
    const metaSubscription: Subscription = this._usuarioModel.metadata$.subscribe(meta => !!meta ? this.pageTable.totalElements = meta.totalElements : null);
    this._subscriptions.add(metaSubscription);

  }
  /**
   * Método para filtrar con las tarjetas por estado de usuario
   * @param estadoUsuario Indica el estado del usuario, true activo false inactivo
   */
  public filtrarPorEstadoUsuario(estadoUsuario: boolean): void {
    this.filtroEstadoUsuarios = estadoUsuario;
    if (estadoUsuario) {
      this.toggleUsuariosActivos = !this.toggleUsuariosActivos;
      if (this.toggleUsuariosInactivos) this.toggleUsuariosInactivos = false
    } else {
      this.toggleUsuariosInactivos = !this.toggleUsuariosInactivos;
      if (this.toggleUsuariosActivos) this.toggleUsuariosActivos = false
    }

    this.arrayCriteriosFiltros = this.arrayCriteriosFiltros.filter(criterio => criterio.campo != 'estadoRegistro')
    if (this.toggleUsuariosActivos || this.toggleUsuariosInactivos) {
      this.arrayCriteriosFiltros.push({ campo: 'estadoRegistro', valor: this.filtroEstadoUsuarios ? 'A' : 'I' });
    }

    this.arrayUsuariosListar = GeneralUtils.cloneObject(this.filterArrayUsuarios());
  }

  /**
   * Metodo utilizado para abrir el modal de observacion de estado
   * @param usuario objeto que se manipula en el modal
   * @param rowIndex posicion en la que se encuentra el objeto
   * @param event eventos de la funcionalidad del switch
   */
  public abrirModalActivarInactivar(usuario: Usuario, rowIndex: number, event: any): void {

    this._indexUsuario = rowIndex;
    usuario.checked = event;

    const dialogRef = this._matDialog.open(ModalEstadoRegistroComponent, {
      width: EModalSize.medium.width,
      height: EModalSize.extraSmall.heigth,
      panelClass: 'cw-modal-estadoregistro',
      data: {
        estado: event
      }
    });

    this.afterCloseModalActivarInactivar(dialogRef, usuario);
  }

  /**
   * Metodo utilziado para ejecutar acciones una vez que el modal de observacion
   * de estado, ha sido cerrado.
   * @param dialogRef variable que contiene los eventos del modal
   * @param usuario variable que contiene el objeto usuario que se esta manipulando
   */
  private afterCloseModalActivarInactivar(dialogRef: any, usuario: Usuario): void {

    const dialogRefSubscription: Subscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.arrayUsuariosListar[this._indexUsuario].checked = usuario.checked;
        usuario.estadoRegistro = usuario.estadoRegistro === 'A' ? 'I' : 'A';
        this.arrayUsuariosListar[this._indexUsuario].estadoRegistro = usuario.estadoRegistro;
        usuario.observacionEstado = result.data.observacionEstado;
        this.arrayUsuariosListar[this._indexUsuario].observacionEstado = usuario.observacionEstado;
        this.llenarUsuariosNuevosYModificados(usuario);
        this.formGroupPerfil.get('usuarios').setValue([...this.arrayUsuariosNuevos, ...this.arrayUsuariosModificados])
      } else {
        this.arrayUsuariosListar[this._indexUsuario].estadoRegistro = usuario.estadoRegistro
        this.arrayUsuariosListar[this._indexUsuario].checked = !usuario.checked;
      }
      this.arrayUsuariosListar = GeneralUtils.cloneObject(this.filterArrayUsuarios());
    });

    this._subscriptions.add(dialogRefSubscription);

  }

  /**
   * Define el metodo para activar o inactivar un usuario según sea el caso
   * @param usuario - parametro de la entidad
   */
  public guardarActivarInactivar(usuario: Usuario): void {
    usuario.estadoRegistro === EEstadosRegistro.activo ? this._usuarioModel.inactivarUsuario(usuario) : this._usuarioModel.activarUsuario(usuario);
  }
  /**
   * Método para abrir modal de formulario de usuario
   * @param accion accion con la que se abre el modal (crear,consultar,editar)
   * @param usuario usuario con el que se abrirá el modal, en el caso que haya
   */
  public abrirModalFormularioUsuario(accion: string, usuario?: Usuario): void {
    const dialogRef = this._matDialog.open(CrearUsuarioComponent, {
      height: '850px',
      data: {
        accion: accion,
        usuario: usuario,
        empresa: this.idEmpresa
      },
      disableClose: true
    });

    this.afterCloseModalFormularioUsuario(dialogRef);
  }
  /**
   * Metodo utilziado para ejecutar acciones una vez que el modal de usuario ha sido cerrado.
   * @param dialogRef variable que contiene los eventos del modal
   */
  private afterCloseModalFormularioUsuario(dialogRef: any): void {
    const dialogRefSubscription: Subscription = dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.llenarUsuariosNuevosYModificados(result.data);
      }
      this.formGroupPerfil.get('usuarios').setValue([...this.arrayUsuariosNuevos, ...this.arrayUsuariosModificados])

      this.arrayUsuariosListar = this.filterArrayUsuarios();
    });
    this._subscriptions.add(dialogRefSubscription);
  }
  /**
   * Método para llenar los usuarios nuevos y modificados
   * @param usuario usuario a llenmar
   */
  public llenarUsuariosNuevosYModificados(usuario: Usuario): void {
    const foundIndex = this.arrayUsuariosListar.findIndex(user => usuario.id !== 0 && user.id === usuario.id);
    if (foundIndex >= 0) {

      //Añadir a array de usuarios modificados y verificar que no se agreguen duplicados
      const modificadosIndex = this.arrayUsuariosModificados.findIndex(user => user.id === usuario.id);
      if (modificadosIndex === -1) {
        this.arrayUsuariosModificados.push(usuario)
      } else {
        this.arrayUsuariosModificados[modificadosIndex] = usuario;
      }

      //Actualizar array de usuarios del listar
      const index = this.arrayUsuarios.findIndex(user => user.id === usuario.id);
      for (const key in this.arrayUsuarios[index]) {
        if (this.arrayUsuarios[index][key] !== usuario[key]) {
          this.arrayUsuarios[index][key] = usuario[key]
        }
      }

    } else {
      //Añade a array de usuarios nuevos o modifica si se edita usuario nuevo
      const index = this.arrayUsuariosNuevos.findIndex(user => user.identificacion === usuario.identificacion);
      if (index === -1) {
        this.arrayUsuariosNuevos.unshift(usuario);
      } else {
        for (const key in this.arrayUsuariosNuevos[index]) {
          if (this.arrayUsuariosNuevos[index][key] !== usuario[key]) {
            this.arrayUsuariosNuevos[index][key] = usuario[key]
          }
        }
      }
    }
  }
  /**
   * Método para filtrar los arrays de usuarios junto con los temporales
   * @returns Array de usuarios nuevos y modificados filtrados
   */
  private filterArrayUsuarios(): Array<Usuario> {
    const arrayUsuariosNuevosFiltrado = this.filterArrayPorCriterios(this.arrayUsuariosNuevos);

    if (this.arrayUsuariosModificados.length > 0) {
      const arrayUsuariosModificadosFiltrado = this.filterArrayPorCriterios(this.arrayUsuariosModificados);
      //Actualizar array de usuarios del listar
      arrayUsuariosModificadosFiltrado.forEach(element => {
        const index = this.arrayUsuarios.findIndex(user => user.id === element.id);
        for (const key in this.arrayUsuarios[index]) {
          if (this.arrayUsuarios[index][key] !== element[key]) {
            this.arrayUsuarios[index][key] = element[key]
          }
        }
      });
    }
    const arrayFiltradoUsuarios = arrayUsuariosNuevosFiltrado.concat(this.filterArrayPorCriterios(this.arrayUsuarios));
    arrayFiltradoUsuarios.forEach(user => user.checked = this.perfilActivo ? user.estadoRegistro === 'A' ? true : false : false);
    this.cantidadActivos = [...this.arrayUsuariosNuevos, ...this.arrayUsuarios].filter(user => user.estadoRegistro === 'A').length
    this.cantidadInactivos = [...this.arrayUsuariosNuevos, ...this.arrayUsuarios].filter(user => user.estadoRegistro === 'I').length
    return arrayFiltradoUsuarios;
  }
  /**
   * Método para filtrar array en base a criterios de filtro
   * @param arr Array a filtrar
   * @returns Array filtrado
   */
  private filterArrayPorCriterios(arr: Array<Usuario>): Array<Usuario> {
    return arr.filter((element) => {
      return this.arrayCriteriosFiltros.every((criterio) => {
        let valid = true;
        for (const key in element) {
          if (criterio.campo === 'estadoRegistro' && key === criterio.campo) {
            valid = element[key] === criterio.valor
          }
          if (criterio.campo === 'textoPredictivo' && key === criterio.campo) {
            valid = element[key].includes(criterio.valor)
          }
        }
        return valid
      })
    })
  }
}
