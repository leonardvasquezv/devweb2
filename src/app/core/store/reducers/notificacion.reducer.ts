import { Notificacion } from '@core/interfaces/base/notificacion.interface';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as notificacionAction from '../actions/notificacion.action';
/**
 * Interfaz que maneja los estado de las notificacion
 */
export interface NotificacionState extends EntityState<Notificacion> {
  ids: Array<any>;
  notificacionSeleccionada: Notificacion;
  loading: boolean;
  loaded: boolean;
  error: string;
  metadata: any;
}

/*
 * Inicialización del estado de las notificacion
 */
export const defaultEstado: NotificacionState = {
  ids: [],
  entities: {},
  notificacionSeleccionada: null,
  loading: false,
  loaded: false,
  error: '',
  metadata: null,
};
/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer de las notificacion
 */
export const notificacionAdapter: EntityAdapter<Notificacion> =
  createEntityAdapter<Notificacion>({
    selectId: (notificacion) => notificacion.idNotificacion
  })

/**
* Inicializacion del estado de las notificacion
*/
export const estadosInitialState = notificacionAdapter.getInitialState(defaultEstado);
/**
 * Reducer de las notificacion
 */
const reducer = createReducer(estadosInitialState,
  on(notificacionAction.SeleccionarNotificacion,
    (state, { notificacion }) => ({ ...state, notificacionSeleccionada: notificacion })
  ),
  on(notificacionAction.CleanSeleccionNotificacion,
    (state, { }) => ({ ...state, notificacionSeleccionada: null }))
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de los totales de las notificacion
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function notificacionReducer(
  state: | (EntityState<Notificacion> & NotificacionState) | undefined,
  action: Action
) {
  return reducer(state, action);
}
