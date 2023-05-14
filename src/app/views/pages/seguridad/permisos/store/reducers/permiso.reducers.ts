import { Permiso } from '@core/interfaces/seguridad/permiso.interface';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as permisoActions from '../actions/permiso.actions';

/**
 * Interfaz que maneja los estado de los permisos
 */
export interface PermisoState extends EntityState<Permiso> {
    ids: Array<any>,
    selectedPermisoId: number;
    loading: boolean;
    loaded: boolean;
    error: string;
    metadata: any;
}

/**
 * Inicializacion de las propiedades del estado del permiso
 */
export const defaultPermiso: PermisoState = {
    ids: [],
    entities: {},
    selectedPermisoId: 0,
    loading: false,
    loaded: false,
    error: '',
    metadata: null
}

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer del permiso
 */
export const permisoAdapter: EntityAdapter<Permiso> = createEntityAdapter<Permiso>();

/**
 * Inicializacion del estado de permiso
 */
export const permisosInitialState = permisoAdapter.getInitialState(defaultPermiso);

/**
 * Reducer del permiso con sus respectivos cambios de estados
 */
const reducer = createReducer(permisosInitialState,
    on(permisoActions.loadPermisosSuccess, (state, { payload }) => (
        permisoAdapter.addMany(payload.data, {
            ...state,
            loaded: true,
            loading: false,
            entities: {},
            ids: [],
            selectedPermisoId: null,
            metadata: payload.meta
        })
    )),
    on(permisoActions.loadPermisosError, (state, { payload }) => ({
        ...state,
        entities: {},
        loaded: false,
        loading: false,
        error: payload
    })),
    on(permisoActions.loadPermisoSuccess, (state, { permiso }) => (
        permisoAdapter.addOne(permiso, {
            ...state,
            selectedPermisoId: permiso.id,
            ids: [],
            entities: {},
            metadata: {}
        })
    )),
    on(permisoActions.loadPermisoError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(permisoActions.createPermisoSuccess, (state, { payload }) => (
        permisoAdapter.addOne(payload, { ...state, entities: { payload, ...state.entities } })
    )),
    on(permisoActions.createPermisoError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(permisoActions.updatePermisoSuccess, (state, { payload }) =>
        permisoAdapter.updateOne(payload, state)),
    on(permisoActions.updatePermisoError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(permisoActions.activarPermisoSuccess, (state, { payload }) =>
        permisoAdapter.updateOne(payload, {
            ...state,
            entities: { ...state.entities, [payload.id]: payload }
        })),
    on(permisoActions.activarPermisoError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(permisoActions.inactivarPermisoSuccess, (state, { payload }) =>
        permisoAdapter.updateOne(payload, {
            ...state,
            entities: { ...state.entities, [payload.id]: payload }
        })),
    on(permisoActions.inactivarPermisoError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(permisoActions.cleanPermisoList, (state, { }) => permisoAdapter.removeAll(state)),
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de Permiso
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function permisoReducer(state: (EntityState<Permiso> & PermisoState) | undefined, action: Action) {
    return reducer(state, action);
}