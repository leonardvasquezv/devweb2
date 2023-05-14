/**
 * Interface de alertas
 */
export interface Alerta {
  idAlertaDocumento?: number;
  idDocumento?: number;
  tiempoMeses?: number;
  estadoRegistro?: string;
  color?: string;
  index?: number;
  diferenciaMeses?: number;
}
