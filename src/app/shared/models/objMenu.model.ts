import { Permiso } from '@shared/models/database/permiso.model';

export class  ObjMenu {
    idPaginaPadre = 0;
    nombrePadre = '';
    id = 0;
    nombre = '';
    icono = '';
    idModulo = 0;
    orden = 0;
    urlPagina = '';
    esTitulo = false;
    hijos: ObjMenu[] = [];
    permisos: Permiso[] = [];
    seleccionado = false;
}
