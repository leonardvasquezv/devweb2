import { Injectable } from '@angular/core';
import { Alerta } from '@core/interfaces/Alerta.interface';
import { Archivo } from '@core/interfaces/archivo.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Documento } from '@core/interfaces/documento.interface';
import { Proceso } from '@core/interfaces/proceso.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class GestionDocumentalService {
  /**
   * Array provisional de documentos
   */
  private documentos: Documento[];
  /**
   * Array de procesos datos de prueba
   */
  private procesos: Array<Proceso>;
  /**
   * Array de alertas datos de prueba
   */
  private alertas: Array<Alerta>;
  /**
   * Array de archivos datos de prueba
   */
  public archivos: Array<Archivo>;
  /**
   * Metodo donde se inyectan las dependencias del componente.
   * @param _httpBaseService accede a las configuraciones y metodos del servicio
   */
  constructor(private _httpBaseService: HttpBaseService) {
  }

  /**
   * Metodo donde se va a validar el numero de documento de la existencia de este
   * @param _codigo codigo ingresado para realizar la consulta de los procesos
   * @returns  de vuelve un objeto de tipo proceso que se encuentra en una Interface
   */
  public ExisteCodigoProceso(_codigo: string): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('proceso/codigo/existe', [{ campo: 'Codigo', valor: _codigo }], false);
  }

  /**
   * metodo para obtener el listado de proceso
   * @param criterios parametros de busqueda
   * @returns Observeble con ResponseWebApi
   */
  public obtenerProcesos(criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('proceso', criterios, false)
  }

  /**
   * metodo para obtener un solo proceso a traves del codigo
   * @param codigo codigo de proceso a obtener
   * @returns Observeble con ResponseWebApi
   */
  public obtenerProcesoPorCodigo(codigo: string): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('proceso/codigo', [{ campo: 'Codigo', valor: codigo }], false)
  }

  /**
   * Método para  actualizar un objeto de tipo proceso
   * @param proceso Objeto de tipo Proceso a Actualizar
   * @returns Observeble con ResponseWebApi
   */
  public actualizarProceso(proceso: Proceso): Observable<ResponseWebApi> {
    return this._httpBaseService.putMethod('proceso', proceso, [], false)
  }
  /**
   * Método para  actualizar el estado de un proceso
   * @param proceso Objeto de tipo Proceso a Actualizar
   * @returns Observeble con ResponseWebApi
   */
  public actualizarEstadoProceso(proceso: Proceso): Observable<ResponseWebApi> {
    return this._httpBaseService.postMethod('proceso/cambioEstado', proceso, [], false)
  }
  /**
   * Método para crear un Objeto de tipo Proceso
   * @param proceso Objeto a crear
   * @returns Observeble con ResponseWebApi
   */
  public crearProceso(proceso: Proceso): Observable<ResponseWebApi> {
    return this._httpBaseService.postMethod('proceso', proceso, [], false)
  }

  /**
   * Método para obtener los documentos a partir de la eds y el proceso
   * @param criterios Criterios de busqueda para la consulta
   * @returns Observable de tipo respuesta API
   */
  public obtenerDocumentos(criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('documentos', criterios, false);
  }

  /**
   * Metodo donde se va a validar el numero de documento de la existencia de este
   * @param criterios Criterios de busqueda para la consulta
   * @returns  de vuelve un objeto de tipo documento que se encuentra en una Interface
   */
  public validaCodigoDocumento(criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod('documentos/validarCodigo', criterios, false);
  }

  /**
   * metodo para obtener el listado de alertas
   * @param idDocumento a buscar
   * @returns Observeble con ResponseWebApi
   */
  public obtenerAlertasPorDocumento(idDocumento: number): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod(`alertasDocumento/${idDocumento}`, [], false);
  }

  /**
   * metodo para obtener el listado de alertas
   * @param criterios parametros de busqueda
   * @returns Observeble con ResponseWebApi
   */
  public obtenerArchivos(criterios?: Array<ObjParam>): Observable<ResponseWebApi> {
    let objParamDocumento: ObjParam[];
    let archivos: Array<Archivo>;
    if (criterios) objParamDocumento = criterios.filter((x) => x.campo == "idDocumento");
    if (objParamDocumento.length > 0) archivos = this.archivos?.filter((x) => x.idDocumento == objParamDocumento[0].valor);
    const response: ResponseWebApi = {
      status: true,
      message: 'ok',
      data: archivos,
      meta: '',
    };
    return of(response);
  }

  /**
   * metodo para actualizar objeto Archivo
   * @param archivo objeto a actualizar
   * @returns Observeble con ResponseWebApi
   */
  public editarArchivo(archivo?: Archivo): Observable<ResponseWebApi> {
    return this._httpBaseService.putMethod('cargarArchivo', archivo, [], false);
  }

  /**
   * Metodo encargado de crear un documento
   * @param documentos Variable que contiene la informacion del documento que se va a crear
   * @returns Observeble con ResponseWebApi
   */
  public crearDocumentos(documentos: Documento): Observable<ResponseWebApi> {
    return this._httpBaseService.postMethod('documento', documentos, [], false);
  }

  /**
   * Metodo encargado de eliminar un archivo de un documento
   * @param idDocumento a modificar
   * @returns Observeble con ResponseWebApi
   */
  public eliminarArchivoDocumento(idDocumento: number): Observable<ResponseWebApi> {
    return this._httpBaseService.putMethod(`documento/eliminarArchivo/${idDocumento}`, null, [], false);
  }

  /**
   * Metodo encargado de obtener el historial de los archivos por documento
   * @param idDocumento a modificar
   * @returns Observeble con ResponseWebApi
   */
  public consultarHistorialArchivosDocumento(idDocumento: number): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod(`documentos/historialArchivo/${idDocumento}`, null, false);
  }

  /**
  * Método encargado de Actualizar un documento
  * @param documento Objeto de tipo documento que se desea actualizar
  * @returns Observeble con ResponseWebApi
  */
  public actualizarDocumento(documento: Documento): Observable<ResponseWebApi> {
    let documentosTemp = this.documentos.filter(x => x.idDocumento != documento.idDocumento)
    this.documentos = [
      ...documentosTemp,
      documento
    ]
    const response: ResponseWebApi = {
      status: true,
      message: 'ok',
      data: documento,
      meta: ''
    }
    return of(response)
  }

  /**
    * Método encargado de cambiarle un estado a una documento TODO- Enviar su antiguo codigo
    * @param codigo Código de la Documento que está siendo editada
    * @param documentoEditada Objeto con la nueva información
    */
  public editarDocumento(codigo: string, documentoEditada: Documento): void {
    let nuevaLista: Documento[] = this.documentos.filter(elemento => elemento.codigo !== codigo);
    nuevaLista = [...nuevaLista, documentoEditada]
    this.documentos = nuevaLista
  }

  /**
   * Metodo encargado de obtener un documento por id
   * @param idDocumento a modificar
   * @returns Observeble con ResponseWebApi
   */
  public obtenerDocumentoPorId(idDocumento: number): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod(`documento/${idDocumento}`, null, false);
  }

}
