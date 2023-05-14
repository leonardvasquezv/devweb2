/**
 * Interfaz que define la estructura de un objeto breadcrumb
 */
export interface Breadcrumb {
    title: string;
    hasBack: boolean;
    route?: string;
    casoEspecial?: boolean;
}
