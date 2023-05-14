import * as moment from 'moment';

import { ObjParam } from '@core/interfaces/base/objParam.interface';

import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjSubItem } from '@core/interfaces/base/objSubItem.interface';
import { DateUtils } from './date-utils';
/**
 * Utilidad para usar los filtros
 */
export let FiltrosUtils = {
  /**
   * Metodo utilizado armar el filtro de fecha generico
   * @param nombre Nombre del filtro Generico
   * @param nombreApi  Nombre del parametro del filtro generico
   * @returns un objeto de filtro
   */
   armaFiltroFechaGenerico(nombre:string,nombreApi:string): ObjFiltro {
    return {
      nombre,
      nombreApi,
      seleccionado: false,
      unico: true,
      visible: true,
      predictivo: false,
      subItems: [
        { idSubItem: 'W', nombreSubItem: 'Última semana', seleccionado: false },
        { idSubItem: 'M', nombreSubItem: 'Último mes', seleccionado: false },
        { idSubItem: 'S', nombreSubItem: 'Últimos 6 meses', seleccionado: false },
        { idSubItem: 'Y', nombreSubItem: 'Último año', seleccionado: false }
      ],
    }
  },
  /**
   * Metodo utilizado armar el filtro de fechas posteriores y anteriores a la actual
   * @param nombre Nombre del filtro Generico
   * @param nombreApi  Nombre del parametro del filtro generico
   * @returns un objeto de filtro
   */
   armaFiltroFechaPosteriorAnterior(nombre:string,nombreApi:string): ObjFiltro {
    return {
      nombre,
      nombreApi,
      seleccionado: false,
      unico: true,
      visible: true,
      predictivo: false,
      subItems: [
        { idSubItem: 'PW', nombreSubItem: 'Próxima semana', seleccionado: false },
        { idSubItem: 'PM', nombreSubItem: 'Próximo mes', seleccionado: false },
        { idSubItem: 'W', nombreSubItem: 'Última semana', seleccionado: false },
        { idSubItem: 'M', nombreSubItem: 'Último mes', seleccionado: false },
      ],
    }
  },
  /**
   * Meotdo utilizado armar el filtro de fecha de creacion
   * @returns un objeto de filtro
   */
  armaFiltroFechaCreacion(): ObjFiltro {
    return {
      nombre: 'Fecha de creación',
      nombreApi: 'rangoFecha',
      seleccionado: false,
      unico: true,
      visible: true,
      predictivo: false,
      subItems: [
        { idSubItem: 'W', nombreSubItem: 'Última semana', seleccionado: false },
        { idSubItem: 'M', nombreSubItem: 'Último mes', seleccionado: false },
        { idSubItem: 'S', nombreSubItem: 'Últimos 6 meses', seleccionado: false },
        { idSubItem: 'Y', nombreSubItem: 'Último año', seleccionado: false }
      ],
    }
  },

  /**
   * Meotdo utilizado armar el filtro de estado de registro
   * @returns un objeto de filtro
   */
  armaFiltroEstadoRegistro(): ObjFiltro {
    return {
      nombre: 'Estado',
      nombreApi: 'estadoRegistro',
      seleccionado: false,
      unico: true,
      visible: true,
      predictivo: false,
      subItems: [
        { idSubItem: 'A', nombreSubItem: 'Activo', seleccionado: false },
        { idSubItem: 'I', nombreSubItem: 'Inactivo', seleccionado: false },
      ],
    }
  },

  /**
   * Meotdo utilizado armar el filtro de texto Predictivo
   * @returns un objeto de filtro
   */
  armaFiltroTextoPredictivo(): ObjFiltro {
    return {
      nombre: 'Buscar',
      nombreApi: 'textoPredictivo',
      seleccionado: false,
      unico: true,
      visible: false,
      predictivo: true,
      subItems: [],
    }
  },

  /**
   * Metodo para obtener criterios de manera dinamica
   * @param item obtenido del array de filtros
   * @param criterios arreglo a complementar
   * @param campo como se llama la variable de obtencion
   * @returns nuevo arreglo de criterios
   */
  obtenerCriteriosDinamico(item: any, criterios: Array<ObjParam>, campo: string): Array<ObjParam> {
    let criterio: ObjParam
    item.subItems.forEach(i => {
      if (i.seleccionado === true) {
        criterio = {};
        criterio.campo = campo;
        criterio.valor = i.idSubItem;

        criterios.push(criterio);
      }
    });
    return criterios;
  },

  /**
   * metodo encargado de armar filtros de manera dinamica
   * @param entities arreglo de las entidades que se mostraran como filtro
   * @param nombre de como se llama la opción del filtro
   * @param nombreApi para reconocer el caso
   * @param varSubitem variable del objeto que se desea ser el criterio
   * @param varNombreSubItem nombre de como será visualizada la opcion en el filtro
   * @param unico valor para saber si es un filtro uni
   * @returns objeto de tipo Filtro
   */
  armaFiltroDinamico(entities: Array<any>, nombre: string, nombreApi: string, varSubitem: string = 'id', varNombreSubItem: string = 'nombre', unico: boolean = false): ObjFiltro {
    let subItems: Array<ObjSubItem> = [];

    if (!!entities) {
      entities.forEach(entity => {
        subItems = [
          ...subItems,
          {
            idSubItem: entity[varSubitem] + '',
            nombreSubItem: entity[varNombreSubItem],
            seleccionado: false
          }
        ]
      });
    }

    const filtro: ObjFiltro = {
      nombre,
      nombreApi,
      seleccionado: false,
      unico,
      visible: true,
      subItems,
      predictivo: false
    }
    return filtro;
  },

  /**
   * Meotdo utilizado armar el filtro de texto Predictivo
   * @param item Array de subItems
   * @param criterios Parametros de consulta
   * @returns un objeto de filtro
   */
  obtenerCriteriosRangoFechas(item: { subItems: Array<ObjSubItem> }, criterios: Array<ObjParam>,nombreFechaInicial = 'fechaInicio', nombreFechaFinal = 'fechaFin'): Array<ObjParam> {
    let criterio: ObjParam;
    let fechas: { fechaInicial: moment.Moment, fechaFinal: moment.Moment } = <any>{};
    if (item.subItems.length > 0) {
      item.subItems.forEach((i: { idSubItem: string }) => {
        switch (i.idSubItem) {
          case 'W': {
            fechas = DateUtils.getLastWeek();
            break;
          }
          case 'S': {
            fechas = DateUtils.getLastSemester();
            break;
          }
          case 'M': {
            fechas = DateUtils.getLastMonth();
            break;
          }
          case 'Y': {
            fechas = DateUtils.getLastYear();
            break;
          }
          case 'PW': {
            fechas = DateUtils.getNextWeek()
            break;
          }
          case 'PM': {
            fechas = DateUtils.getNextMonth();
            break;
          }
        }
      });
      criterio = {
        campo: nombreFechaInicial,
        valor: fechas.fechaInicial.format('DD/MM/YYYY')
      };
      criterios.push(criterio);
      criterio = {
        campo: nombreFechaFinal,
        valor: fechas.fechaFinal.format('DD/MM/YYYY')
      };
      criterios.push(criterio);
    }
    return criterios;
  },

  /**
   * Meotdo utilizado armar el filtro de texto Predictivo
   * @param item Array de subItems
   * @param criterios Parametros de consulta
   * @returns un objeto de filtro
   */
  obtenerCriteriosEstadoRegistro(item: { subItems: Array<ObjSubItem>; }, criterios: Array<ObjParam>): Array<ObjParam> {
    let criterio: ObjParam;
    item.subItems.forEach((i: { seleccionado: boolean; idSubItem: string; }) => {
      if (i.seleccionado === true) {
        criterio = {
          campo: 'estadoRegistro',
          valor: i.idSubItem
        };
        criterios.push(criterio);
      }
    });
    return criterios;
  },

  /**
   * Método utilizado armar el filtro de texto Predictivo
   * @param item Objeto de filtro
   * @param criterios Parametros de consulta
   * @returns un objeto de filtro
   */
  obtenerCriteriosTextoPredictivo(item: ObjFiltro, criterios: Array<ObjParam>): Array<ObjParam> {
    let criterio: ObjParam;
    if (item.texto !== '' && item.texto !== undefined && item.texto !== null) {
      criterio = {
        campo: 'textoPredictivo',
        valor: item.texto
      };
      criterios.push(criterio);
    }
    return criterios;
  },

  /**
   * Metodo utilizado para armar filtros de genericos en el sistema
   * @param fecha bandera de entrada para filtro fecha
   * @param estado bandera de entrada para filtro estado
   * @returns array de filtros
   */
  armarFiltrosGenericos(fecha = true, estado = true): Array<ObjFiltro> {
    const filtros: Array<ObjFiltro> = [];
    if (fecha) filtros.push(this.armaFiltroFechaCreacion());
    if (estado) filtros.push(this.armaFiltroEstadoRegistro());
    filtros.push(this.armaFiltroTextoPredictivo());
    return filtros;
  }
}
