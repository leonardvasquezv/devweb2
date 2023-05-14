import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { PerfilesPorGrupo } from '@core/interfaces/seguridad/perfilesPorGrupo.interface';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as perfilActions from '../actions/perfil.actions';

/**
 * Interfaz que maneja los estado de los perfiles
 */
export interface PerfilState extends EntityState<Perfil> {
    ids: Array<any>,
    selectedPerfilId: number;
    loading: boolean;
    loaded: boolean;
    error: string;
    perfilesGrupo: Array<PerfilesPorGrupo>
    metadata: any;
}

/**
 * Inicializacion de las propiedades del estado del perfil
 */
export const defaultPerfil: PerfilState = {
    ids: [],
    entities: {},
    selectedPerfilId: 0,
    loading: false,
    loaded: false,
    error: '',
    perfilesGrupo: [],
    metadata: null
}

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer del perfil
 */
export const perfilAdapter: EntityAdapter<Perfil> = createEntityAdapter<Perfil>();

/**
 * Inicializacion del estado de perfil
 */
export const perfilesInitialState = perfilAdapter.getInitialState(defaultPerfil);

/**
 * Reducer del perfil con sus respectivos cambios de estados
 */
const reducer = createReducer(perfilesInitialState,
    on(perfilActions.loadPerfilesSuccess, (state, { payload }) => (
        perfilAdapter.addMany(payload.data, {
            ...state,
            loaded: true,
            loading: false,
            entities: {},
            ids: [],
            selectedPerfilId: null,
            metadata: payload.meta
        })
    )),
    on(perfilActions.loadPerfilesError, (state, { payload }) => ({
        ...state,
        entities: {},
        loaded: false,
        loading: false,
        error: payload
    })),
    on(perfilActions.loadPerfilSuccess, (state, { perfil }) => (
        perfilAdapter.addOne(perfil, {
            ...state,
            selectedPerfilId: perfil.id,
            ids: [],
            entities: {},
            metadata: {}
        })
    )),
    on(perfilActions.loadPerfilError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(perfilActions.createPerfilSuccess, (state, { payload }) => (
        perfilAdapter.addOne(payload, { ...state, entities: { payload, ...state.entities } })
    )),
    on(perfilActions.createPerfilError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(perfilActions.updatePerfilSuccess, (state, { payload }) =>
        perfilAdapter.updateOne(payload, state)),
    on(perfilActions.updatePerfilError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(perfilActions.activarPerfilSuccess, (state, { payload }) =>
        perfilAdapter.updateOne(payload, {
            ...state,
            entities: { ...state.entities, [payload.id]: payload }
        })),
    on(perfilActions.activarPerfilError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(perfilActions.inactivarPerfilSuccess, (state, { payload }) =>
        perfilAdapter.updateOne(payload, {
            ...state,
            entities: { ...state.entities, [payload.id]: payload }
        })),
    on(perfilActions.inactivarPerfilError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(perfilActions.cleanPerfilList, (state, { }) => perfilAdapter.removeAll(state)),
    on(perfilActions.loadUsuarioActivosPerfilSuccess, (state, { payload }) => ({
        ...state,
        perfilesGrupo: payload
    })),
    on(perfilActions.loadUsuarioActivosPerfilError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de Perfil
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function perfilReducer(state: (EntityState<Perfil> & PerfilState) | undefined, action: Action) {
    return reducer(state, action);
}