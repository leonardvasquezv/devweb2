import { Injectable } from "@angular/core";
import { ObjParam } from "@core/interfaces/base/objParam.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { DataEds } from "@core/interfaces/data-eds.interface";
import { CrearEdsService } from "@core/services/crear-eds.service";
import { AppState } from "@core/store/app.interface";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as edsAction from "../store/actions/eds.action";
import * as edsSelectors from '../store/selectors/eds.selectors';
import { EdsService } from '../services/eds.service';

@Injectable()
export class EdsModel {
  /**
   * Método para inyectar dependencias
   * @param _store store de la aplicacion
   * @param _crearEdsService Servicio de crearEds
   * @param _edsService Servicio de eds 
   */
  constructor(
    private _store: Store<AppState>,
    private _crearEdsService: CrearEdsService,
    private _edsService:EdsService,

  ) { }
  /**
   * Metodo encargado de accionar el store para obtener los Procesos
   */
  public entities$: Observable<any> = this._store.select(edsSelectors.getAllEds);

  /**
   * Metodo encargado de accionar el store para obtener los Metadatos de la entidad Eds
   */
  public metadata$: Observable<any> = this._store.select(edsSelectors.getMetadataEds);
  /**
   * Metodo encargado de accionar el store para obtener una entidad Eds
   */
  public edsSeleccionada$: Observable<any> = this._store.select(edsSelectors.getEdsSeleccionada);

  /**
   * Método para obtener las eds
   * @param criterios Array de eds
   */
  public obtenerEdsPorCriterios(criterios: Array<ObjParam> = []): void {
    this._store.dispatch(edsAction.CleanAllEdsList());
    this._store.dispatch(edsAction.LoadEds({ payload: criterios }));
  }
  /**
   * Metodo encargado de limpiar en el store los estados de los procesos cargados
   */
  public cleanAllEdsList(): void {
    this._store.dispatch(edsAction.CleanAllEdsList());
  }

  /**
   * Metodo encargado de limpiar del store la eds cargada
   */
  public cleanOneEds(): void {
    this._store.dispatch(edsAction.cleanOneEds());
  }

  /**
   * Método para ejecutar la accion de actualizar eds
   * @param eds objeto eds a actualizar
   */
  public actualizarEstadoEds(payload: Array<ObjParam>): void {
    this._store.dispatch(edsAction.UpdateEstadoEds({ payload }));
  }
  /**
   * Método para ejecutar la accion de selecionar eds
   * @param eds objeto eds a actualizar
   */
  public selecionarEds(eds: DataEds): void {
    this._store.dispatch(edsAction.SeleccionarEds({ eds }));
  }

  /**
   * Método encargado de crear Eds
   * @param eds Variable que contiene la informacion de la eds que se va a crear
   * @return Array con respuesta
   */
  public crearEds(eds: DataEds): Observable<ResponseWebApi> {
    return this._crearEdsService.crearEds(eds);
  }

  /**
   * Método encargado de editar una Eds
   * @param eds Objeto a editar
   * @return Array con respuesta
   */
  public editarEds(eds: DataEds): Observable<ResponseWebApi> {
    return this._crearEdsService.editarEds(eds);
  }
  
  /**
    * Metodo para validar la existencia de la eds por un nit
    * @param criterios array de los filtros a validar
    * @returns  retorna un observable que contiene un objeto de de tipo response web api
    */
  public existeNitEds(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._edsService.ExisteNitEds(criterios);
  }
}
