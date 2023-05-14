import { Usuario } from '@core/interfaces/seguridad/usuario.interface';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as usuarioActions from '../actions/usuario.actions';

/**
 * Interfaz que maneja los estado de los usuarios
 */
export interface UsuarioState extends EntityState<Usuario> {
    ids: Array<any>,
    selectedUsuarioId: number;
    selectedUsuario: Usuario;
    loading: boolean;
    loaded: boolean;
    error: string;
    metadata: any;
}

/**
 * Inicializacion de las propiedades del estado del usuario
 */
export const defaultUsuario: UsuarioState = {
    ids: [],
    entities: {},
    selectedUsuarioId: 0,
    selectedUsuario: null,
    loading: false,
    loaded: false,
    error: '',
    metadata: null
}

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer del usuario
 */
export const usuarioAdapter: EntityAdapter<Usuario> = createEntityAdapter<Usuario>();

/**
 * Inicializacion del estado de usuario
 */
export const usuariosInitialState = usuarioAdapter.getInitialState(defaultUsuario);

/**
 * Reducer del usuario con sus respectivos cambios de estados
 */
const reducer = createReducer(usuariosInitialState,
    on(usuarioActions.loadUsuariosSuccess, (state, { payload }) => (
        usuarioAdapter.addMany(payload.data, {
            ...state,
            loaded: true,
            loading: false,
            entities: {},
            ids: [],
            selectedUsuarioId: null,
            metadata: payload.meta
        })
    )),
    on(usuarioActions.loadUsuariosError, (state, { payload }) => ({
        ...state,
        entities: {},
        loaded: false,
        loading: false,
        error: payload
    })),
    on(usuarioActions.loadUsuarioSuccess, (state, { usuario }) => (
        {
            ...state,
            selectedUsuario: usuario
        }
    )),
    on(usuarioActions.loadUsuarioError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(usuarioActions.createUsuarioSuccess, (state, { payload }) => (
        usuarioAdapter.addOne(payload, { ...state, entities: { payload, ...state.entities } })
    )),
    on(usuarioActions.createUsuarioError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(usuarioActions.updateUsuarioSuccess, (state, { payload }) =>
        usuarioAdapter.updateOne(payload, state)),
    on(usuarioActions.updateUsuarioError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(usuarioActions.activarUsuarioSuccess, (state, { payload }) =>
        usuarioAdapter.updateOne(payload, {
            ...state,
            entities: { ...state.entities, [payload.id]: payload }
        })),
    on(usuarioActions.activarUsuarioError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(usuarioActions.inactivarUsuarioSuccess, (state, { payload }) =>
        usuarioAdapter.updateOne(payload, {
            ...state,
            entities: { ...state.entities, [payload.id]: payload }
        })),
    on(usuarioActions.inactivarUsuarioError, (state, { payload }) => ({
        ...state,
        error: payload
    })),
    on(usuarioActions.cleanUsuarioList, (state, { }) => usuarioAdapter.removeAll(state)),
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de Usuario
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function usuarioReducer(state: (EntityState<Usuario> & UsuarioState) | undefined, action: Action) {
    return reducer(state, action);
}