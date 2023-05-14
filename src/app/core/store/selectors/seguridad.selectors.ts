import { AppState } from '../app.interface';

export const getCodigoGenerado = (state: AppState) => state.seguridad.codigo.generar;
export const getValidacionCodigo = (state: AppState) => state.seguridad.codigo.validar;
