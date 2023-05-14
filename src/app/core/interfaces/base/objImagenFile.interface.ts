/**
 * Interface para objeto imagen
 */
export interface ObjFile {
  archivo: any,
  nombre: any,
  url?: any,
  idDocumento?: number;
  size?: number;
  json?: Array<any>;
  ruta?: string;
  id?: number;
  clean?: boolean;
  extension?: string;
  contentType?: string;
}

/**
 * Objeto de inicio
 */
export const initFile: ObjFile = {
  archivo: '',
  nombre: '',
  url: ''
}
