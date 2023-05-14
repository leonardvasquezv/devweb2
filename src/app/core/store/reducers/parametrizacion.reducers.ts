import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as parametrizacionActions from '../actions/parametrizacion.action';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';

/**
 * Interfaz para manejar los estados de parametrizacion
 */
export interface ParametrizacionState extends EntityState<TipoDetalle> {
  ids: Array<number>;
  selectedParametrizacionId: number;
  loading: boolean;
  loaded: boolean;
  error: string;
  metadata: any;
}
/**
 * Inicialización del estado default de las Parametrizaciones
 */
export const defaultState: ParametrizacionState = {
  ids: [],
  entities: {},
  selectedParametrizacionId: 0,
  loading: false,
  loaded: false,
  error: '',
  metadata: null,
}

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer de las Parametrizaciones
 */
export const parametrizacionAdapter: EntityAdapter<TipoDetalle> = createEntityAdapter<TipoDetalle>({
  selectId: (Parametrizacion) => Parametrizacion.idTipoDetalle
});

/**
 * Inicializacion del estado de las Parametrizaciones
 */
export const parametrizacionInitialState = parametrizacionAdapter.getInitialState(defaultState)


/**
 * Reducer de las Parametrizaciones
 */
const _parametrizacionReducer = createReducer(parametrizacionInitialState,
  on(parametrizacionActions.loadParametrizaciones, (state, { criterios }) => ({
    ...state,
    entities: {},
    loading: true,
    loaded: false,
    error: '',
    metadata: criterios
  })),

  on(parametrizacionActions.loadParametrizacionesSuccess, (state, { payload }) => {
    return parametrizacionAdapter.addMany(payload.data, {
      ...state,
      loading: false,
      loaded: true,
      entities: {},
      ids: [],
      selectedConciliacionId: null,
      metadata: payload.meta,
    })
  }),
  on(
    parametrizacionActions.loadParametrizacionesError,
    (state, { payload }) => ({
      ...state,
      entities: {},
      loading: false,
      loaded: false,
      error: payload,
    })
  ),
  on(parametrizacionActions.createParametrizacionesSuccess, (state, { payload }) => (
    parametrizacionAdapter.addOne(payload, { ...state, entities: { payload, ...state.entities } })
  )),
  on(parametrizacionActions.createParametrizacionesError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(parametrizacionActions.loadParametrizacionSuccess, (state, { tipoDetalle }) => (
    parametrizacionAdapter.addOne(tipoDetalle, {
      ...state,
      selectedParametrizacionId: tipoDetalle.idTipoDetalle,
      ids: [],
      entities: { ...state.entities, [tipoDetalle.idTipoDetalle]: tipoDetalle }
    })
  )),
  on(parametrizacionActions.loadParametrizacionError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(parametrizacionActions.updateParametrizacionSuccess, (state, { payload }) =>
    parametrizacionAdapter.updateOne(payload, {
      ...state,
      entities: { ...state.entities, [payload.idTipoDetalle]: payload }
    })),
  on(parametrizacionActions.updateParametrizacionError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(parametrizacionActions.cambioEstadoParametrizacionSuccess, (state, { payload }) =>
    parametrizacionAdapter.updateOne(payload, {
      ...state,
      entities: { ...state.entities, [payload.idTipoDetalle]: payload }
    })),
  on(parametrizacionActions.cambioEstadoParametrizacionError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
)

/**
 * Función reducer encargada de manejar los estados y las acciones de los totales de las parametriaciones
 * @param state  Estado actual
 * @param action Acción a utilizar
 * @returns Nuevo estado
 */
export function parametrizacionReducer(state: ParametrizacionState |
  (EntityState<TipoDetalle> & ParametrizacionState) | undefined, action: Action) {
  return _parametrizacionReducer(state, action)
}
