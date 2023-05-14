import { Action, createReducer, on } from '@ngrx/store';
import * as seguridadAction from '@core/store/actions/seguridad.action'

/**
 * Interfaz que maneja los estado de los seguridads
 */
export interface SeguridadState {
  codigo: { generar?: any, validar?: any }
}

/**
 * Inicializacion de las propiedades del estado del seguridad
 */
export const defaultSeguridad: SeguridadState = {
  codigo: { generar: null, validar: null }
}

/**
 * Reducer del seguridad con sus respectivos cambios de estados
 */
const reducer = createReducer(defaultSeguridad,

  on(seguridadAction.generarCodigoSuccess, (state, { response }) => ({ ...state, codigo: { generar: response.data } })),
  on(seguridadAction.generarCodigoError, (state, { payload }) => ({ ...state, error: payload })),

  on(seguridadAction.validarCodigoSuccess, (state, { response }) => ({ ...state, codigo: { validar: response.data } })),

);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de Seguridad
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function seguridadReducer(state: any, action: Action) {
  return reducer(state, action);
}
