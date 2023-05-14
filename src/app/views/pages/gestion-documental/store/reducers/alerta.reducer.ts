import { Alerta } from '@core/interfaces/Alerta.interface';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as AlertActions from '../actions/alerta.actions';

/**
 * Interfaz que maneja los estado de las alertas de gestion documental
 */
export interface AlertaState extends EntityState<Alerta> {
  ids: Array<any>;
  selectedAlertaid: number;
  loading: boolean;
  loaded: boolean;
  error: string;
  metadata: any;
}

/*
 * Inicialización del estado de las alertas de gestion documental
 */
export const defaultEstado: AlertaState = {
  ids: [],
  entities: {},
  selectedAlertaid: 0,
  loading: false,
  loaded: false,
  error: '',
  metadata: null,
};

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer de las alertas de gestion documental
 */
export const AlertasAdapter: EntityAdapter<Alerta> = createEntityAdapter<Alerta>({ selectId: (alerta) => alerta.idAlertaDocumento });

/**
 * Inicializacion del estado de las alertas de gestion documental
 */
export const estadosInitialState = AlertasAdapter.getInitialState(defaultEstado);

/**
 * Reducer de la informacion de las alertas
 */
export const reducer = createReducer(
  estadosInitialState,
  on(AlertActions.loadAlertasSuccess, (state, { payload }) => {
    return AlertasAdapter.addMany(payload.data, {
      ...state,
      loading: false,
      loaded: true,
      entities: {},
      ids: [],
      metadata: payload.meta,
    });
  }),
  on(AlertActions.loadAlertasError, (state, { payload }) => ({
    ...state,
    entities: {},
    loading: false,
    loaded: false,
    error: payload,
  })),
  on(AlertActions.CleanAlertasList, (state, { }) =>
    AlertasAdapter.removeAll(state)
  )
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de  la informacion de la alerta a Modificar
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function AlertaReducer(
  state: (EntityState<Alerta> & AlertaState) | undefined, action: Action) {
  return reducer(state, action);
}
