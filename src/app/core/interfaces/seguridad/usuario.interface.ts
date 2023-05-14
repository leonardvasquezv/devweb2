import { ObjFile } from '../base/objImagenFile.interface';
import { UsuariosEds } from './usuarioEds.inteface';
import { UsuariosAgencias } from './usuariosAgencias.interface';
import { UsuariosEmpresas } from './usuariosEmpresas.interface';
import { UsuariosPerfiles } from './usuariosPerfiles.interface';

export interface Usuario {
    id: number;

    // TODO Auditoria depende del dto
    fechaCreacion: Date;
    creadoPor: number;
    fechaModificacion: Date;
    modificadoPor: number;
    fechaAnulacion: Date;
    anuladoPor: number;
    estadoRegistro: string;
    observacionEstado: string;
    cargo?: string;

    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    nombreCompleto: string;
    indicativoTelefono: number;
    telefono: string;
    indicativoCelular: number;
    celular: string;
    userName: string;
    email: string;
    password: string;
    imagenAvatar: ObjFile;
    imagenHuella: ObjFile;
    idEmpresa: number;
    idPais: number;
    idDepartamento: number;
    idCiudad: number;
    idBarrio: number;
    idTipoUsuario: number;
    direccion: string;
    idTipoIdentificacion: number;
    identificacion: string;
    tiempoCambioClave: number;
    usuariosPerfiles: Array<UsuariosPerfiles>;
    usuariosEmpresas: Array<UsuariosEmpresas>;
    usuariosAgencias: Array<UsuariosAgencias>;
    usuariosEds: Array<UsuariosEds>;
    nombreArchivo: string;
    idCliente: number;
    checked: boolean;
}
