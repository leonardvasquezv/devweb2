/**
 * interface para las NotificacionDetalleContenido 
 */
export interface NotificacionDetalleContenido {
    idDocumento: number;
    nombreDocumento: string;
    idProceso?: number;
    idEds: number;
    estado: number;
    mensaje: string;
}