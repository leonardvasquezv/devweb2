export interface UsuariosPerfiles {
    idUsuario?: number;
    nombreUsuario?: string;
    idPerfil: number;
    nombrePerfil: string;
    fechaCreacion: Date;
    creadoPor: number;
    fechaModificacion?: Date;
    modificadoPor?: number;
    fechaAnulacion?: Date;
    anuladoPor?: number;
    estadoRegistro?: string;
    observacionEstado?: string;
    porDefecto?: boolean;
}
