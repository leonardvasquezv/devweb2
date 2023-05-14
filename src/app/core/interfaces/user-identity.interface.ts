

export interface UserIdentity {
    idUsuario: number;
    rutaAvatar: string;
    primerNombre: string;
    primerApellido: string;
    segundoApellido: string;
    idTipoIdentificacion: number;
    celular: string;
    indicativoCelular: number;
    telefono: string;
    idCiudad: number;
    codigoPostal: string;
    zonaHoraria: string;
    correo: string;
    username: string;
    codigoUsuario: string;
    temporal: Date;
    idTenant: number;
    idEmpresa: number;
    rol: number;
    perfiles: [];
    esExterno: boolean;
    idPais: number,
    nombrePais: string,

    id: number;
}
