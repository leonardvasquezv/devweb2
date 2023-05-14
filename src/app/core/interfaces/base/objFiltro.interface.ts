import { ObjSubItem } from "./objSubItem.interface";
/**
 * Interface para los objetos de filtro
 */
export interface ObjFiltro {
    nombre: string;
    nombreApi: string;
    subItems: Array<ObjSubItem>;
    visible: boolean;
    predictivo: boolean;
    texto?: string;
    seleccionado: boolean;
    unico: boolean;
    campo?: string;
}