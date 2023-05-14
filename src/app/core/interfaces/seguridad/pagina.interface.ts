import { Permiso } from './permiso.interface';

export interface Pagina {
    id: number;

    fechaCreacion: Date;
    creadoPor: number;
    fechaModificacion: Date;
    modificadoPor: number;
    fechaAnulacion: Date;
    anuladoPor: number;
    estadoRegistro: string;
    observacionEstado: string;

    nombre: string;
    descripcion: string;
    urlPagina: string;
    icono: string | any;
    esTitulo: boolean;
    idModulo: number;
    idTipoPagina: number;
    idPaginaPadre: number;
    orden: number;
    verEnMenu: boolean;
    hijos: Array<Pagina>;
    hijosFiltered: Array<Pagina>;
    version: number;

    // Propiedades virtuales que no hacen parte del modelo
    permisos: Array<Permiso>
    checked: boolean;


}
