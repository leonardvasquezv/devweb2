import { Pagina } from '@shared/models/database/pagina.model';
import { Perfil } from '@shared/models/database/perfil.model';
export class ObjLoginUser {
    id=0;
    username = '';
    password = '';
    rememberMe = false;
    reCaptcha = '';
    nullable = false;
    fechaCreacion: Date = null;
    nombreCompleto = '';
    indicativoTelefono = 0;
    telefono = '';
    indicativoCelular = 0;
    celular = '';
    rutaAvatar = '';
    direccion = '';
    perfiles: Perfil[] = [];
    paginasPerfilDefault: Pagina[] = [];
    email = '';
    idTipoUsuario = 0;
    idPais = 0;
    nombrePais = '';
}
