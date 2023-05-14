/**
 * Interfaz que define los campos de auditoria
 */
export interface CamposAuditoria {
    fechaCreacion?: Date | string;
    creadoPor?: number;
    nombreCreadoPor?: string;
    fechaModificacion?: Date | string;
    modificadoPor?: number;
    nombreModificadoPor?: string;
    fechaAnulacion?: Date | string;
    anuladoPor?: number;
    estadoRegistro?: string;
    observacionEstado?: string;
}