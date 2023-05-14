import { NotificacionDetalleContenido } from "./NotificacionDetalleContenido";

/**
 * interface para las notificaciones
 */
export interface Notificacion {
    idNotificacion?: number;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
    detalleContenido: NotificacionDetalleContenido;
    idEstadoNotificacion?: number;
    idUsuario?: number;
    creadoPor?: number;
    modificadoPor?: number;
    fechaAnulacion?: Date;
    anuladoPor?: number;
    observacionEstado?: string;
    fechaEnvio?: Date;
    fechaRecibido?: Date;
    fechaLeido?: Date;
    estadoRegistro?: string;
    vencido?: boolean;
    linkRedireccion?: string;
    leido: boolean;
    hora?: string

}
