import { Empresa } from '@core/interfaces/seguridad/empresa.interface';
import { Pagina } from '@core/interfaces/seguridad/pagina.interface';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as empresaActions from '../actions/empresa.actions';

/**
 * Interfaz que maneja los estado de los empresaes
 */
export interface EmpresaState extends EntityState<Empresa> {
  ids: Array<any>,
  selectedEmpresaId: number;
  empresaTieneEdsAsociada: boolean;
  loading: boolean;
  loaded: boolean;
  error: string;
  metadata: any;
  estadoFormularioPerfil: boolean;
  paginas: Array<Pagina>
}

/**
 * Inicializacion de las propiedades del estado del empresa
 */
export const defaultEmpresa: EmpresaState = {
  ids: [],
  entities: {},
  selectedEmpresaId: 0,
  empresaTieneEdsAsociada: false,
  loading: false,
  loaded: false,
  error: '',
  metadata: null,
  estadoFormularioPerfil: false,
  paginas: []
}

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer del empresa
 */
export const empresaAdapter: EntityAdapter<Empresa> = createEntityAdapter<Empresa>({ selectId: (empresa: Empresa) => empresa.id });

/**
 * Inicializacion del estado de empresa
 */
export const empresasInitialState = empresaAdapter.getInitialState(defaultEmpresa);

/**
 * Reducer del empresa con sus respectivos cambios de estados
 */
const reducer = createReducer(empresasInitialState,
  on(empresaActions.loadEmpresasSuccess, (state, { payload }) => (
    empresaAdapter.addMany(payload.data, {
      ...state,
      loaded: true,
      loading: false,
      entities: {},
      ids: [],
      selectedEmpresaId: null,
      metadata: payload.meta
    })
  )),
  on(empresaActions.loadEmpresasError, (state, { payload }) => ({
    ...state,
    entities: {},
    loaded: false,
    loading: false,
    error: payload
  })),
  on(empresaActions.loadEmpresaSuccess, (state, { empresa }) => (
    empresaAdapter.addOne(empresa, {
      ...state,
      selectedEmpresaId: empresa.id,
      ids: [],
      entities: {},
      metadata: {}
    })
  )),
  on(empresaActions.loadEmpresaError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(empresaActions.createEmpresaSuccess, (state, { payload }) => (
    empresaAdapter.addOne(payload, { ...state, entities: { payload, ...state.entities } })
  )),
  on(empresaActions.createEmpresaError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(empresaActions.updateEmpresaSuccess, (state, { payload }) =>
    empresaAdapter.updateOne(payload, state)),
  on(empresaActions.updateEmpresaError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(empresaActions.activarEmpresaSuccess, (state, { payload }) =>
    empresaAdapter.updateOne(payload, {
      ...state,
      entities: { ...state.entities, [payload.id]: payload }
    })),
  on(empresaActions.activarEmpresaError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(empresaActions.inactivarEmpresaSuccess, (state, { payload }) =>
    empresaAdapter.updateOne(payload, {
      ...state,
      entities: { ...state.entities, [payload.id]: payload }
    })),
  on(empresaActions.inactivarEmpresaError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(empresaActions.empresaTieneEdsAsociada, (state, { payload }) => ({
    ...state,
    empresaTieneEdsAsociada: payload
  })),
  on(empresaActions.cleanEmpresaTieneEdsAsociada, (state) => ({
    ...state,
    empresaTieneEdsAsociada: false
  })),
  on(empresaActions.cleanEmpresaList, (state) => empresaAdapter.removeAll(state)),
  on(empresaActions.asignarFormularioPerfilEditado, (state, { estado }) => ({ ...state, estadoFormularioPerfil: estado })),
  on(empresaActions.loadPaginasSuccess, (state, { paginas }) => ({ ...state, paginas })),
  on(empresaActions.loadPermisosSuccess, (state, { permisos }) => ({ ...state, permisos })),
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de Empresa
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function empresaReducer(state: (EntityState<Empresa> & EmpresaState) | undefined, action: Action) {
  return reducer(state, action);
}
