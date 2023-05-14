/**
 * Interface para manejar el objeto de paginado
 */
export interface ObjPage {
    size: number;
    totalElements?: number;
    totalPages?: number;
    pageNumber?: number;
}

/**
 * Objeto estandar para el paginado
 */
export const pageDefault: ObjPage = {
    size: 5,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0
}

/**
 * Objeto estandar para el paginado de los modales
 */
export const pageDefaultModal: ObjPage = {
    size: 4,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0
}

/**
 * Objeto estandar para el paginado de la tabla de alertas
 */
export const pageDefualtAlertas: ObjPage = {
    size: 3,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0
}
