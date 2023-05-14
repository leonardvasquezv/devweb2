import { Permiso } from '@shared/models/database/permiso.model';
export class Pagina {
    idPagina = 0;
    id = 0;
    fechaCreacion: Date = null;
    creadoPor = 0;
    fechaModificacion: Date = null;
    modificadoPor = 0;
    fechaAnulacion: Date = null;
    anuladoPor = 0;
    estadoRegistro = 'A';
    observacionEstado = '';

    nombre = '';
    descripcion = '';
    url = '';
    icono = '';
    esTitulo = false;
    idModulo = 0;
    idPaginaPadre = 0;
    orden = 0;
    hijos: Pagina[] = [];

    // Propiedades virtuales que no hacen parte del modelo
    permisos: Permiso[] = [];
    verEnMenu: boolean;
    urlPagina: string;

}
