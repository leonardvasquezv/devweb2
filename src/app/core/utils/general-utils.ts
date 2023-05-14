import { ObjPage } from '@core/interfaces/base/objPage.interface';
import { cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment';
/**
 * Constante para definir metodos de utilidades generales
 */
export const GeneralUtils = {
  /**
   * Método para clonar objetos sin mutarlos
   * @param object Objeto a clonar
   * @returns Objeto clonado
   */
  cloneObject(object: any) {
    return cloneDeep(object);
  },
  /**
   * Metodo para armar la URL para consumir los WebApi de CORE
   * @returns Returna la url completa para el consumo del webapi del CORE
   */
  getUrlWebApiProceso() {
    return environment.webApiUrl;
  },
  /**
   * Metodo para armar la URL para consumir los WebApi de Seguridad
   * @returns Returna la url completa para el consumo del webapi del Seguridad
   */
  getUrlWebApiSeguridad() {
    //TODO Ajaner Cambiar nombre cuando la app tenga seguridad
    return location.protocol + '//' + environment.webApiUrl;
  },
  /**
   * Metodo para asignar paginacion
   * @param pagina objetos con las propiedades de asignacion
   * @returns criterios de busqueda
   */
  setPaginacion(pagina: ObjPage) {
    let cantidadPorPag: { campo?: any; valor?: any; };
    let numeroPagina: { campo?: any; valor?: any; };
    const criterios = [];
    cantidadPorPag = {};
    numeroPagina = {};
    cantidadPorPag.campo = 'Size';
    cantidadPorPag.valor = pagina?.size;
    numeroPagina.campo = 'PageNumber';
    numeroPagina.valor = pagina?.pageNumber + 1;
    criterios.push(cantidadPorPag);
    criterios.push(numeroPagina);
    return criterios;
  },

  /**
   * Metodo usado para obtener una expresion regular
   * @param type tipo de expresion a obtener
   * @returns devuelve la expresion encontrada
   */
  obtenerExpresionRegular(type: string): any {
    const expresiones = {
      integer: /^[0-9]*$/,
      integerminone: /^[1-9][0-9]*$/,
      float: /^[+-]?([0-9]*[.])?[0-9]+$/,
      words: /^[a-zA-Z]*$/,
      wordsAndSpace: /^[a-zA-Z ñÑáéíóú]*$/,
      alphanumericAndSpace: /^[a-zA-Z0-9 ñÑáéíóú]*$/,
      alphanumeric: /^[a-zA-Z0-9]*$/,
      identification: /^[a-zA-Z0-9\-]*$/,
      point25: /^\-?[0-9]*(?:\\.25|\\.50|\\.75|)$/,
      streetAddress: /^[a-zA-Z0-9\-\ \#]*$/,
      email: /^[a-zA-Z0-9@._\-]*$/
    };
    return expresiones[type];
  },

  /**
   * Metodo para reemplazar las vocales con tildes a vocales sin tildes
   * @param oracion a normalizar
   * @returns oracion normalizada
   */
  normalizarVocalesConSignos(oracion: string): string {
    return oracion.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  },

  /**
   * Metodo para armar la URL para consumir los WebApi de SignalR
   * @returns Returna la url completa para el consumo del webapi de SignalR
   */
  getUrlWebApiSignalR(): string {
    return location.protocol + '//' + environment.wepApi_SignalR;
  },

};
