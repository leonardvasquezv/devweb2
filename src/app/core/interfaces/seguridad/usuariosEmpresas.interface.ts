export interface UsuariosEmpresas {
    idUsuario?: number;
    nombreUsuario?: string;
    idEmpresa: number;
    nombreEmpresa: string;
    identificacion: string;
    nombrePais?: string;
    fechaCreacion: Date;
    creadoPor: number;
    fechaModificacion?: Date;
    modificadoPor?: number;
    fechaAnulacion?: Date;
    anuladoPor?: number;
    estadoRegistro?: string;
    observacionEstado?: string;
}
