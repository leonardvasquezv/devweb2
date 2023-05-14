/**
 * Interfaz para definir los tipos de un Tipo detalle
 */
 export interface TipoDetalle {
  idTipoDetalle?: number;
  idTipo?: number;
  idTipoDetallePadre?: number;
  nombre: string;
  nomenclatura?: string;
  descripcion?: string;
  estadoRegistro?: string;
  checked?: boolean;
}
