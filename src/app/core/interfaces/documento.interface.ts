import { Alerta } from './Alerta.interface';
import { Archivo } from './archivo.interface';

/**
 * Interface para definir los documentos de cada proceso para una eds
 */
export interface Documento {
  idDocumento?: number;
  nombre?: string;
  codigo?: string;
  aplicaEvaluacion?: boolean;
  aplicaVencimiento?: boolean;
  fechaVencimiento?: string;
  idPeriodicidadNotificacion?: number;
  idDiaNotificacion?: number;
  idEds?: number;
  idProceso?: number;
  urlArchivo?: string;
  idTipoDocumento?: number;
  nombreArchivo?: string;
  documentos?: Array<Documento>;
  estadoRegistro?: string;
  checked?: boolean;
  nombreTipoDocumento?: string;
  archivo?: Archivo;
  alerta?: Alerta;
  nomenclaturaRangoTrabajador?: string;
  nomenclaturaClaseRiesgo?: string;
  tieneNotificacion?:boolean;
}
