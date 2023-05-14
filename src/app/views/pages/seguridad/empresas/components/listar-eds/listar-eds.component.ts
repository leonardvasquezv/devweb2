import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EEstadosRegistro } from '@core/enum/estadoRegistro.enum copy';
import { ObjPage, pageDefault } from '@core/interfaces/base/objPage.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { DataEds } from '@core/interfaces/data-eds.interface';
import { UsuariosEds } from '@core/interfaces/seguridad/usuarioEds.inteface';
import { SeguridadModel } from '@core/model/seguridad.model';
import { GeneralUtils } from '@core/utils/general-utils';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-listar-eds',
  templateUrl: './listar-eds.component.html',
  styleUrls: ['./listar-eds.component.scss']
})
export class ListarEdsComponent implements OnInit {
  /**
   * Id de la empresa con la que se consultarán las eds
   */
  @Input() idEmpresa: number;
  /**
   * Define el id del usuario a consultar
   */
  @Input() idUsuario: number;
  /**
   * Define los usuariosEds de un usuario en consulta/edicion
   */
  @Input() set consultaUsuariosEds(usuariosEds: Array<UsuariosEds>) {
    if (usuariosEds?.length > 0) {
      this.arrayUsuariosEds = [...usuariosEds];
      this.completarInfo();
    }
  };
  /**
   * Define si el formulario se puede editar
   */
  @Input() modoConsulta: boolean;
  /**
  * Objeto observable para flitrar las eds
  */
  public filteredEds: Observable<DataEds[]>;
  /**
   * Objeto de control para el eds que se quiere buscar
   */
  public objEdsBusqueda = new FormControl();
  /**
   * Array de criterios de filtros seleccionados
   */
  public arrayCriterios: Array<ObjParam> = [];
  /**
   * Listado de eds registrados
  */
  public arrayEds: Array<DataEds> = [];

  /**
 * Listado de eds que estan asociadas con el usuario
 */
  public arrayUsuariosEds: Array<UsuariosEds> = [];
  /**
   * Define las propiedades para la paginacion de la tabla eds asociadas
   */
  public pageTableEds: ObjPage = pageDefault;
  /**
   * Define el modo de visualizacion para las columnas de la tabla
   */
  public ColumnMode = ColumnMode;
  /**
   * Define la salida del codigo de verificacion
   */
  @Output() usuariosEdsEmit = new EventEmitter();
  /**
   * Método llamado al construir el componente
   * @param _seguridadModel modelo de seguridad
   */
  constructor(
    private _seguridadModel: SeguridadModel
  ) {
  }
  /**
   * Método llamado al crear el componente
   */
  ngOnInit(): void {
    this.getAllEds();
  }

  /**
   * Metodo utilizados par obtener las eds
   */
  private getAllEds(): void {
    this.arrayCriterios = [{ campo: 'estadoRegistro', valor: EEstadosRegistro.activo }, { campo: 'empresas', valor: this.idEmpresa }];
    this._seguridadModel.obtenerAllEds(this.arrayCriterios).subscribe(({ data }) => {
      this.arrayEds = data
      this.fileredDataTable();
    });
  }

  /**
   * Metodo para activar los filtros de las tablas de perfiles, agencias y empresas
   */
  private fileredDataTable(): void {
    this.completarInfo();
    this.filteredEds = this.objEdsBusqueda.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.nombre),
        map(name => name ? this._filterEds(name) : this.arrayEds.slice())
      );
  }

  /**
   * metodo para completar la informacion de los arrays de empresas, perfiles y agencias.
   */
  private completarInfo(): void {
    this.arrayEds.forEach(item => {
      const agregado = this.arrayUsuariosEds.findIndex(asoc => asoc.idEds === item.idEds);
      item.agregado = agregado === -1 ? false : true;
    });
  }

  /**
   * mMetodo usado para filtrar perfiles por nombre especifico
   * @param name Nombre del perfil que se desea filtrar
   * @returns Retorna las coincidencias del eprfil a buscar.
   */
  private _filterEds(name: string): DataEds[] {
    const filterValue = name.toLowerCase();
    return this.arrayEds.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
  * Metodo para realizar la visualizacion del nombre del eds a filtrar
  * @param eds Objeto eds que se esta filtrado
  * @returns El nombre del eds consultado
  */
  public displayFnEds(eds: DataEds): string {
    return eds && eds.nombre ? eds.nombre : '';
  }

  /**
   * Metodo para asocial el eds al usuario
   * @param eds contiene información del objeto eds
   */
  public asociarEds(eds: DataEds): void {
    if (eds.agregado === false) {
      const index = this.arrayEds.findIndex(item => item.idEds === eds.idEds);
      const usuarioEds: UsuariosEds = {
        idEds: eds.idEds,
        departamentoMunicipio: eds.departamentoMunicipio,
        nit: eds.nit,
        nombre: eds.nombre,
        idMayorista: eds.idMayorista
      };
      this.arrayUsuariosEds.push(usuarioEds);
      this.arrayUsuariosEds = GeneralUtils.cloneObject(this.arrayUsuariosEds);
      this.pageTableEds.size = 5;
      this.pageTableEds.totalElements = this.arrayUsuariosEds.length;
      this.arrayEds[index].agregado = !this.arrayEds[index].agregado;
      this.objEdsBusqueda.patchValue({ objEdsBusqueda: '' });
      this.objEdsBusqueda.reset();
      this.usuariosEdsEmit.emit(this.arrayUsuariosEds);
    }
  }

  /**
   * Metodo que elimina una eds asociada al usuario
   * @param index inice del datatable
   * @param row contiene la información de la fila
   */
  public eliminarEdsAsociada(index, row: UsuariosEds): void {
    const indexAgre = this.arrayEds.findIndex(item => item.idEds === row.idEds);
    this.arrayEds[indexAgre].agregado = !this.arrayEds[indexAgre].agregado;
    this.arrayUsuariosEds.splice(index, 1);
    this.arrayUsuariosEds = GeneralUtils.cloneObject(this.arrayUsuariosEds);
    this.usuariosEdsEmit.emit(this.arrayUsuariosEds);
  }
}
