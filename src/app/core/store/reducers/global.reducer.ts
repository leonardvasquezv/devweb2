import { Breadcrumb } from '@core/interfaces/base/breadcrumb.interface';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Municipio } from '@shared/models/database/municipio.model';
import { Pais } from '@shared/models/database/pais.model';
import { TipoDetalle } from '@shared/models/database/tipoDetalle.model';
import { Departamento } from '../../interfaces/departamento.interface';
import * as globalActions from '../actions/global.action';

/**
 * Interfaz que maneja los estado de los globals
 */
export interface GlobalState {
    paises: Array<Pais>;
    departamentos: Array<Departamento>;
    municipios: Array<Municipio>;
    estadosCiviles: Array<TipoDetalle>;
    error: any;
    breadcrumb: Breadcrumb
}

/**
 * Inicializacion de las propiedades del estado del global
 */
export const defaultGlobal: GlobalState = {
    paises: [],
    estadosCiviles: [],
    departamentos: [],
    municipios: [],
    error: null,
    breadcrumb: null
}


/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer del global
 */
export const globalAdapter: EntityAdapter<any> = createEntityAdapter<any>();

/**
 * Inicializacion del estado de global
 */
export const globalsInitialState = globalAdapter.getInitialState(defaultGlobal);

/**
 * Reducer del global con sus respectivos cambios de estados
 */
const reducer = createReducer(globalsInitialState,
    on(globalActions.loadGlobalsSuccess, (state, { payload }) => ({
            ...state,
            entities: {},
            ids: [],
            departamentos: payload[0].data,
            municipios: payload[1].data
        })
    ),
    on(globalActions.loadGlobalsError, (state, { payload }) => ({ ...state, error: payload })),
    on(globalActions.setBreadCrumb, (state, { breadcrumb }) => ({
        ...state, breadcrumb
    }))
);


/**
 * Funcion reducer encargada de manejar los estados y las acciones de Global
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function globalReducer(state: any, action: Action) {
    return reducer(state, action);
}
