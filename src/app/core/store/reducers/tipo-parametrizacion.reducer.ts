import { Action, createReducer, on } from '@ngrx/store';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as tipoParametrizacionActions from '../actions/tipo-parametrizacion.action';
import { Tipo } from '@core/interfaces/maestros-del-sistema/tipo.interface';



/**
 * Interfaz para manejar los estados de Tipos de Parametrización
 */
export interface TipoParametrizacionState extends EntityState<Tipo> {
    ids: Array<number>;
    selectedTipoParametrizacionId: number;
    loading: boolean;
    loaded: boolean;
    error: string;
    metadata: any;
}

/**
 * Inicialización del estado default de los Tipos de Parametrizaciones
 */
export const defaultState: TipoParametrizacionState = {
    ids: [],
    entities: {},
    selectedTipoParametrizacionId: 0,
    loading: false,
    loaded: false,
    error: '',
    metadata: null,
}

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer de los Tipós de Parametrización
 */
export const tipoParametrizacionAdapter: EntityAdapter<Tipo> = createEntityAdapter<Tipo>({
    selectId: (TiposParametrizacion) => TiposParametrizacion.idTipo
});


/**
 * Inicializacion del estado de los Tipos de Parametrizaciones
 */
export const tipoParametrizacionInitialState = tipoParametrizacionAdapter.getInitialState(defaultState)


/**
 * Reducer de los Tipos de Parametrización
 */
const _tipoParametrizacionReducer = createReducer(tipoParametrizacionInitialState,
    on(tipoParametrizacionActions.loadTiposParametrizacion, (state) => ({
        ...state,
        entities: {},
        loading: true,
        loaded: false,
        error: '',
    })),

    on(tipoParametrizacionActions.loadtTiposParametrizacionSuccess,(state, {payload}) => {
        return tipoParametrizacionAdapter.addMany(payload.data, {
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
    tipoParametrizacionActions.loadtTiposParametrizacionError,
    (state, { payload }) => ({
      ...state,
      entities: {},
      loading: false,
      loaded: false,
      error: payload,
    })
  ),
)

/**
 * Función reducer encargada de manejar los estados y las acciones de los totales de los tipos de parametrización
 * @param state  Estado actual
 * @param action Acción a utilizar
 * @returns Nuevo estado
 */
export function tipoParametrizacionReducer(state: TipoParametrizacionState | (EntityState<Tipo> & TipoParametrizacionState) | undefined , action: Action){
    return _tipoParametrizacionReducer(state,action)
}
