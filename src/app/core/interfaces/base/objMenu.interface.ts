import { Permiso } from "../seguridad/permiso.interface";

export interface ObjMenu {
    idPaginaPadre: number;
    nombrePadre: string;
    id: number;
    nombre: string;
    descripcion: string;
    icono: string;
    idModulo: number;
    orden: number;
    urlPagina: string;
    esTitulo: boolean;
    hijos: Array<ObjMenu>;
    permisos: Array<Permiso>
    seleccionado: boolean;
}