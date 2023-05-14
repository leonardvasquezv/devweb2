export interface PerfilesPaginasPermisos {
    idPerfil: number;
    idPermiso: number;
    idPagina: number;
    fechaCreacion?: Date;
    creadoPor?: number;
    fechaModificacion?: Date;
    modificadoPor?: number;
    fechaAnulacion?: Date;
    anuladoPor?: number;
    estadoRegistro?: string;
    observacionEstado?: string;
}
