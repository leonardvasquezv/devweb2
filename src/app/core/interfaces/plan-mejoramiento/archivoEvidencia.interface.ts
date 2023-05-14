/**
 * Interfaz que define la estructura de un archivo de evidencia
 */
export interface ArchivoEvidencia {
    idArchivoEvidenciaCriterio?: number;
    IdEvidenciaCriterio?: number;
    nombreArchivo?: string;
    urlArchivo?: string;
    archivo?: string;
    estadoRegistro?: string;
    tamanoArchivo?: number
}
