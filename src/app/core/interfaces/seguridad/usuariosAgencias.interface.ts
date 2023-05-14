export interface UsuariosAgencias {
    idUsuario?: number;
    nombreUsuario?: string;
    idAgencia: number;
    nombreAgencia: string;
    nombreCiudad: string;
    direccion: string;
    fechaCreacion: Date;
    creadoPor: number;
    fechaModificacion?: Date;
    modificadoPor?: number;
    fechaAnulacion?: Date;
    anuladoPor?: number;
    estadoRegistro?: string;
    observacionEstado?: string;
}
