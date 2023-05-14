import { Perfil } from './perfil.model';
export class User {
    id = 0;
    fechaCreacion: Date = null;
    creadoPor = 0;
    fechaModificacion: Date = null;
    modificadoPor = 0;
    fechaAnulacion: Date = null;
    anuladoPor = 0;
    estadoRegistro = 'A';
    observacionEstado = '';

    nombreCompleto = '';
    indicativoTelefono = 0;
    telefono = '';
    indicativoCelular = 0;
    celular = '';
    userName = '';
    password = '';
    rutaAvatar = '';
    idEmpresa = 0;
    idDepartamento = 0;
    idCiudad = 0;
    idBarrio = 0;
    direccion = '';
    idTipoIdentificacion = 0;
    identificacion = '';

    // Propiedades virtuales que no hacen parte del modelo
    perfiles: Array<Perfil> = [];
}
