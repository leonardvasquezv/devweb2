import { Injectable } from '@angular/core';
import { Archivo } from '@core/interfaces/archivo.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { DataEds } from '@core/interfaces/data-eds.interface';
import { Documento } from '@core/interfaces/Documento.interface';
import { Proceso } from '@core/interfaces/proceso.interface';
import { AppState } from '@core/store/app.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GestionDocumentalService } from '../gestion-documental.service';
import * as AlertActions from '../store/actions/alerta.actions';
import * as ArchivoActions from '../store/actions/archivo.actions';
import * as DocumentoAction from '../store/actions/documento.actions';
import * as ProcesoAction from '../store/actions/proceso.actions';
import * as alertasSelectors from '../store/selectors/alertas.selectors';
import * as archivoSelectors from '../store/selectors/archivo.selectors';
import * as documentoSelectors from '../store/selectors/documento.selectors';
import * as procesoSelectors from '../store/selectors/proceso.selectors';

@Injectable()
export class GestionDocumentalModel {
  /**
   * Metodo constructor del modelo de estado, encargado de inyectar dependencias
   * @param _gestionDocumentalService
   * @param _store store de la aplicacion
   */
  constructor(
    private _gestionDocumentalService: GestionDocumentalService,
    private _store: Store<AppState>
  ) { }
  /**
   * Metodo encargado de accionar el store para obtener los Procesos
   */
  public entitiesProcesos$: Observable<any> = this._store.select(
    procesoSelectors.getAllProcesos
  );
  /**
   * Metodo encargado de accionar el store para obtener el loading
   */
  public loadingProcesos$: Observable<boolean> = this._store.select(
    procesoSelectors.getLoadingProcesos
  );

  /**
   * Metodo encargado de accionar el store para obtener la metadata de la consulta
   */
  public metadataProcesos$: Observable<any> = this._store.select(
    procesoSelectors.getMetadataProcesos
  );
  /**
   * Metodo encargado de accionar el store para obtener los Procesos
   */
  public entitiesDocumentos$: Observable<any> = this._store.select(
    documentoSelectors.getAllDocumentos
  );
  /**
   * Metodo encargado de accionar el store para obtener el loading
   */
  public loadingDocumentos$: Observable<boolean> = this._store.select(
    documentoSelectors.getLoadingDocumentos
  );
  /**
   * Metodo encargado de accionar el store para obtener la eds redireccionada
   */
  public edsRedireccionada$: Observable<number> = this._store.select(
    procesoSelectors.getEdsRedireccionada
  );

  /**
   * Metodo encargado de accionar el store para obtener la eds redireccionada para crear documento
   */
  public redireccionEdsCrearDocumento$: Observable<DataEds> =
    this._store.select(documentoSelectors.getRedireccionEds);

  /**
   * Metodo encargado de accionar el store para obtener el proceso redireccionada
   */
  public redireccionProcesoCrearDocumento$: Observable<Proceso> =
    this._store.select(documentoSelectors.getRedireccionProceso);

  /**
   * Metodo encargado de accionar el store para obtener la metadata de la consulta
   */
  public metadataDocumentos$: Observable<any> = this._store.select(
    documentoSelectors.getMetadataDocumentos
  );
  /**
   * Metodo encargado de accionar el store para obtener las Alertas
   */
  public entitiesAlertas$: Observable<any> = this._store.select(
    alertasSelectors.getAllAlertas
  );
  /**
   * Metodo encargado de accionar el store para obtener el loading de Alertas
   */
  public loadingAlertas$: Observable<boolean> = this._store.select(
    alertasSelectors.getLoadingAlertas
  );

  /**
   * Metodo encargado de accionar el store para obtener la metadata de la consulta de  Alertas
   */
  public metadataAlertas$: Observable<any> = this._store.select(
    alertasSelectors.getMetadataAlertas
  );
  /**
   * Metodo encargado de accionar el store para obtener los Archivos
   */
  public entitiesArchivos$: Observable<any> = this._store.select(
    archivoSelectors.getAllArchivos
  );
  /**
   * Metodo encargado de accionar el store para obtener el loading de los Archivos
   */
  public loadingArchivos$: Observable<boolean> = this._store.select(
    archivoSelectors.getLoadingArchivos
  );

  /**
   * Metodo encargado de accionar el store para obtener la metadata de la consulta
   */
  public metadataArchivos$: Observable<boolean> = this._store.select(
    archivoSelectors.getMetadataArchivos
  );
  /**
   * Metodo para llamar u obtener los objetos de proceso
   * @param criterios array de criterios de busqueda
   */
  public obtenerAllProcesos(criterios: Array<ObjParam> = []): void {
    this._store.dispatch(ProcesoAction.CleanAllProcesosList());
    this._store.dispatch(
      ProcesoAction.LoadProcesos({
        payload: criterios,
      })
    );
  }
  /**
   * Metodo encargado de limpiar en el store los estados de los procesos cargados
   */
  public cleanAllProcesosList(): void {
    this._store.dispatch(ProcesoAction.CleanAllProcesosList());
  }
  /**
   * Método para obtener array de documentos
   * @param criterios array de criterios de busqueda
   * @returns Array de documentos
   */
  public obtenerAllDocumentos(criterios: Array<ObjParam> = []): void {
    this._store.dispatch(DocumentoAction.CleanAllDocumentosList());
    this._store.dispatch(
      DocumentoAction.LoadDocumentos({
        criterios: criterios,
      })
    );
  }
  /**
   * Metodo encargado de limpiar en el store los estados de los documentoss cargados
   */
  public cleanAllDocumentosList(): void {
    this._store.dispatch(DocumentoAction.CleanAllDocumentosList());
  }
  /**
   * Método para dispara acción de redireccionar EDS
   * @param idEds Id de la eds
   */
  public redireccionarEds(idEds: number): void {
    this._store.dispatch(
      ProcesoAction.RedirectEds({
        idEds: idEds,
      })
    );
  }
  /**
   * Metodo encargado de limpiar en el store los estados de la EDS redireccionada
   */
  public cleanEdsRedireccionada(): void {
    this._store.dispatch(ProcesoAction.CleanRedirectEds());
  }

  /**
   * Metodo para llamar u obtener los objetos de proceso
   * @param criterios array de criterios de busqueda
   */
  public obtenerAlertasPorDocumento(idDocumento: number): void {
    this._store.dispatch(AlertActions.loadAlertas({ idDocumento }));
  }

  /**
   * Metodo encargado de limpiar en el store los estados de los procesos cargados
   */
  public cleanAllAlertasList(): void {
    this._store.dispatch(AlertActions.CleanAlertasList());
  }
  /**
   * Metodo encargado de limpiar en el store los estados de los procesos cargados
   */
  public cleanAllArchivoList(): void {
    this._store.dispatch(ArchivoActions.CleanArchivosList());
  }
  /**
   * Metodo para llamar u obtener los objetos de proceso
   * @param criterios array de criterios de busqueda
   */
  public obtenerAllArchivo(criterios: Array<ObjParam> = []): void {
    this._store.dispatch(ArchivoActions.CleanArchivosList());
    this._store.dispatch(
      ArchivoActions.LoadArchivos({
        criterios: criterios,
      })
    );
  }

  /**
  * Método encagado de accionar el disparador para poder Actualizar un documento
  * @param documento objeto de tipo documento que se va actualizar
  */
  public actualizarDocumento(documento: Documento): void {
    this._store.dispatch(DocumentoAction.UpdateDocumento({ documento }));
  }
  /**
  * Método encagado de accionar el disparador para poder crear un proceso en el store y en db
  * @param proceso informacion del proceso a crear
  */
  public addProceso(proceso: Proceso): void {
    this._store.dispatch(ProcesoAction.AddProceso({ proceso }));
  }
  /**
   * Método encagado de accionar el disparador para poder Actualizar un proceso en el store y en db
   * @param proceso informacion del objeto de tipo proceso a actualizar
   */
  public actualizarProceso(proceso: Proceso): void {
    this._store.dispatch(ProcesoAction.UpdateProceso({ proceso }));
  }
  /**
   * Método encagado de accionar el disparador para poder Actualizar el estado de un proceso en el store y en db
   * @param proceso informacion del objeto de tipo proceso a actualizar
   */
  public actualizarEstadoProceso(proceso: Proceso): void {
    this._store.dispatch(ProcesoAction.UpdateEstadoProceso({ proceso }));
  }  /**
   * Método encargado de validar si existe el codigo dentro de los procesos
   * @param codigo codigo de proceso a verificar
   */
  public ExisteCodigoProceso(codigo: string): boolean {
    let result: boolean = false;
    this._gestionDocumentalService.ExisteCodigoProceso(codigo)
      .pipe(
        map((res: ResponseWebApi) => {
          if (res.status) {
            result = res.data
          } else {
            result = false
          }
        })
      )
    return result;
  }
  /**
   * Método encagado de accionar de Obtener un proceso a travez  del codigo del mismo
   * @param codigo codigo del proceso a obtener
   */
  public obtenerProcesoPorCodigo(codigo: string): Observable<ResponseWebApi> {
    return this._gestionDocumentalService.obtenerProcesoPorCodigo(codigo)
  }


  /**
   * Metodo encargado de editar una Documento
   * @param codigo Código de la Documento que está siendo editada
   * @param documentoEditada Objeto con la nueva información
   */
  public editarDocumento(codigo: string, documentoEditada: Documento): void {
    this._gestionDocumentalService.editarDocumento(codigo, documentoEditada);
  }

  /**
   * Método para dispara acción de redireccionar EDS
   * @param eds Id de la eds
   * @param proceso Id del proceso
   */
  public redireccionarEdsProceso(eds: DataEds, proceso: Proceso): void {
    this._store.dispatch(
      DocumentoAction.Redirect({
        eds,
        proceso,
      })
    );
  }

  /**
   * Método encargado de crear un Documento
   * @param documentos Variable que contiene la informacion de la Documento que se va a crear
   */
  public crearDocumento(documentos: Documento): Observable<ResponseWebApi> {
    return this._gestionDocumentalService.crearDocumentos(documentos);
  }

  /**
   * Metodo para ejecutar la accion de actualizar archivo
   * @param archivo objeto archivo a actualizar
   */
  public actualizarArchivo(archivo: Archivo): Observable<ResponseWebApi> {
    return this._gestionDocumentalService.editarArchivo(archivo);
  }

  /**
   * Metodo donde se va a validar el numero de documento de la existencia de este
   * @param criterios Criterios de busqueda para la consulta
   * @returns  de vuelve un objeto de tipo documento que se encuentra en una Interface
   */
   public validaCodigoDocumento(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._gestionDocumentalService.validaCodigoDocumento(criterios);
  }

  /**
   * Metodo encargado de eliminar un archivo de un documento
   * @param idDocumento a modificar
   * @returns Observeble con ResponseWebApi
   */
   public eliminarArchivoDocumento(idDocumento: number): Observable<ResponseWebApi> {
    return this._gestionDocumentalService.eliminarArchivoDocumento(idDocumento);
  }

  /**
   * Método para obtener los documentos a partir de la eds y el proceso
   * @param criterios Criterios de busqueda para la consulta
   * @returns Observable de tipo respuesta API
   */
  public obtenerDocumentos(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._gestionDocumentalService.obtenerDocumentos(criterios);
  }

  /**
   * Metodo encargado de obtener el historial de los archivos por documento
   * @param idDocumento a modificar
   * @returns Observeble con ResponseWebApi
   */
   public consultarHistorialArchivosDocumento(idDocumento: number): Observable<ResponseWebApi> {
    return this._gestionDocumentalService.consultarHistorialArchivosDocumento(idDocumento);
  }

  /**
   * Metodo encargado de obtener un documento por id
   * @param idDocumento a modificar
   * @returns Observeble con ResponseWebApi
   */
   public obtenerDocumentoPorId(idDocumento: number): Observable<ResponseWebApi> {
    return this._gestionDocumentalService.obtenerDocumentoPorId(idDocumento);
  }

}
