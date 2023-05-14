import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EEstadoRegistro } from '@core/enum/estadoRegistro.enum';
import { EModalSize } from '@core/enum/modalSize.enum';
import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjPage, pageDefault } from '@core/interfaces/base/objPage.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ObjTabla, ajustesTablas } from '@core/interfaces/base/objTabla.interface';
import { Empresa } from '@core/interfaces/seguridad/empresa.interface';
import { FiltrosUtils } from '@core/utils/filtros-utils';
import { GeneralUtils } from '@core/utils/general-utils';
import { PermisosUtils } from '@core/utils/permisos-utils';
import { CheckPermissionInit } from '@shared/components/check-permission/check-permission-init';
import { ModalEstadoRegistroComponent } from '@shared/components/modal-estado-registro/modal-estado-registro.component';
import { UtilsService } from '@shared/services/utils.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { EmpresaModel } from '../../models/empresa.model';
;

@Component({
  selector: 'app-listar-empresa',
  templateUrl: './listar-empresa.component.html',
  styleUrls: ['./listar-empresa.component.scss']
})
export class ListarEmpresaComponent extends CheckPermissionInit implements OnInit {

  /**
 * Array de filtros habilitados para la tabla
 */
  public arrayFiltros: Array<ObjFiltro> = [];

  /**
  * Array de criterios de filtros seleccionados
  */
  public arrayCriteriosFiltros: Array<ObjParam> = [];

  /**
* Define los empresaes obtenidos por los servicios
*/
  public arrayEmpresas: Array<Empresa> = [];

  /**
* Define el modo de visualizacion para las columnas de la tabla
*/
  public ColumnMode = ColumnMode;

  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage = pageDefault;

  /**
   * Define el index de la ultima empresa que se selecciono al abrir el modal de activar o inactivar
   */
  private _indexEmpresa: number;

  /**
   * Define la empresa selecionado en el modal de manera global
   */
  private _empresaSelected: Empresa;

  /**
   * Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /**
   * Variable que contiene medidas y tamaño de las tablas
   */
  public medidasTabla: ObjTabla;


  /**
   * Metodo constructor de la clase
   * @param _router define las propiedades y atributos de la ruta
   * @param _empresaModel define las propiedades y atributos del modelo de empresa
   * @param _matDialog define las propiedades del modal
   * @param _utilsService Accede a los metodos del servicio de utilidades
   */
  constructor(private _router: Router,
    private _empresaModel: EmpresaModel,
    private _matDialog: MatDialog,
    private _utilsService: UtilsService

  ) {
    super();
  }

  /**
   * Metodo donde se inicializa el componente
   */
  ngOnInit(): void {
    this.medidasTabla = ajustesTablas;
    this.armaFiltros();
    this._utilsService.setBreadCrumb('', null, false, 'Empresas');
  }

  /**
   * Netodo donde se destruye el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  /**
  * Metodo usado para obtener los filtros seleccionados y
  * utilizarlos como criterios de busqueda
  */
  public recibeFiltrosDinamico(event): void {
    const filtro = event.filtros;
    this.arrayCriteriosFiltros = this.obtenerFiltros(filtro);
    this.pageTable.pageNumber = 0;
    this.getAllEmpresas();
  }

  /**
  * Arma los filtros manuales para ser visualizados en el componente de app-filtros-tablas.
  */
  private armaFiltros(): void {
    const filtrosTemp = FiltrosUtils.armarFiltrosGenericos();
    this.arrayFiltros = GeneralUtils.cloneObject(filtrosTemp);
  }

  /**
   * Metodo utilizado para obtener los filtros seleccionados
   * @param filtro array de objetos de filtrados
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
        case 'estadoRegistro': {
          criterios = FiltrosUtils.obtenerCriteriosEstadoRegistro(item, criterios);
          break;
        }
        case 'textoPredictivo': {
          criterios = FiltrosUtils.obtenerCriteriosTextoPredictivo(item, criterios);
          break;
        }
      }
    });
    return criterios;
  }

  /**
* Metodo utilizado para obtener todos los empresaes de manera paginada
* @param pagina en la que se está
* @param pageSize tamaño del la pagina de la consulta
*/
  public getAllEmpresas(pagina = null, pageSize = null): void {
    this.pageTable.pageNumber = pagina ? pagina.offset : 0;
    this.pageTable.size = pageSize ? pageSize : this.pageTable.size;
    const paramsPaginacion = GeneralUtils.setPaginacion(this.pageTable);
    const criterios = this.arrayCriteriosFiltros.concat(paramsPaginacion);

    this._empresaModel.getAllEmpresas(criterios);

    const empresasSubscription: Subscription = this._empresaModel.empresas$.subscribe(empresas => {
      this.arrayEmpresas = GeneralUtils.cloneObject(empresas);
      this.arrayEmpresas.forEach(empresa => empresa.checked = empresa.estadoRegistro === EEstadoRegistro.activo ? true : false);

    });
    this._subscriptions.add(empresasSubscription);

    const modelSubscription: Subscription = this._empresaModel.metadata$.subscribe(meta => this.pageTable.totalElements = !!meta ? meta.totalElements : null);
    this._subscriptions.add(modelSubscription);
  }

  /**
   * Define el metodo para activar o inactivar un empresa según sea el caso
   * @param empresa objeto con la información de la empresa
   * @param rowIndex id del registro
   * @param event evento de ejecución
   */
  public abrirModalActivarInactivar(empresa: Empresa, rowIndex: number, event: any): void {
    this._indexEmpresa = rowIndex;
    this._empresaSelected = empresa;
    this._empresaSelected.checked = event;

    const dialogRef = this._matDialog.open(ModalEstadoRegistroComponent, {
      width: EModalSize.medium.width,
      height: EModalSize.extraSmall.heigth,
      panelClass: 'cw-modal-estadoregistro',
      data: {
        estado: empresa.checked
      }
    });

    this.afterCloseModalActivarInactivar(dialogRef, empresa);
  }

  /**
   * Metodo utilizado para ejecutar acciones una vez que el modal de observacion
   * de estado, ha sido cerrado.
   * @param dialogRef variable que contiene los eventos del modal
   * @param empresa variable que contiene el objeto permiso que se esta manipulando
   */
  private afterCloseModalActivarInactivar(dialogRef: any, empresa: Empresa): void {

    const dialogRefSubscription: Subscription = dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.arrayEmpresas[this._indexEmpresa].checked = empresa.checked;
        empresa.observacionEstado = result.data.observacionEstado;
        this.guardarActivarInactivar(this.arrayEmpresas[this._indexEmpresa]);
      } else {
        this.arrayEmpresas[this._indexEmpresa].checked = !empresa.checked;
      }
    });
  }

  /**
   * Define el metodo para activar o inactivar un permiso según sea el caso
   * @param empresa - parametro de la entidad
   */
  public guardarActivarInactivar(empresa: Empresa): void {
    empresa.estadoRegistro === EEstadoRegistro.activo ? this._empresaModel.inactivarEmpresa(empresa) : this._empresaModel.activarEmpresa(empresa);
  }

  /**
    * Metodo utilizado para accionar el componente de creacion de la empresa
  */
  public crearEmpresa(): void {
    this._router.navigate(['home/seguridad/empresas/crear'], { queryParams: { idPagina: PermisosUtils.ObtenerPagina() } });
  }

  /**
   * Metodo utilizado para accionar el componente de creacion de la empresa
   * @param idEmpresa de la empresa a conusltar
   */
  public consultarEmpresa(idEmpresa: number): void {
    this._router.navigate(['home/seguridad/empresas/consultar/' + idEmpresa], { queryParams: { idPagina: PermisosUtils.ObtenerPagina() } });
  }
  /**
   * Metodo utilizado para accionar el componente de creacion de la empresa
   * @param idEmpresa de la empresa a conusltar
   */
  public editarEmpresa(idEmpresa: number): void {
    this._router.navigate(['home/seguridad/empresas/editar/' + idEmpresa], { queryParams: { idPagina: PermisosUtils.ObtenerPagina() } });
  }

}
