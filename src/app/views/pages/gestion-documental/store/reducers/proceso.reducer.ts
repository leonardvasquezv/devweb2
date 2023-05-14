import { Proceso } from '@core/interfaces/proceso.interface';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as procesoAction from '../actions/proceso.actions';

/**
 * Interfaz que maneja los estado de los Procesos de gestion documental
 */
export interface ProcesoState extends EntityState<Proceso> {
  ids: Array<any>;
  selectedProcesoid: number;
  loading: boolean;
  loaded: boolean;
  error: string;
  metadata: any;
  idEdsRedireccionada: number;
}

/*
 * Inicialización del estado de los Procesos de gestion documental
 */
export const defaultEstado: ProcesoState = {
  ids: [],
  entities: {},
  selectedProcesoid: 0,
  loading: false,
  loaded: false,
  error: '',
  metadata: null,
  idEdsRedireccionada: null,
};

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer de los Procesos de gestion documental
 */
export const procesosAdapter: EntityAdapter<Proceso> =
  createEntityAdapter<Proceso>({
    selectId: (proceso) => proceso.idProceso,
  });

/**
 * Inicializacion del estado de los Procesos de gestion documental
 */
export const estadosInitialState =
  procesosAdapter.getInitialState(defaultEstado);
/**
 * Reducer de los totales de los consolidados de ventas con sus respectivos cambios de estados
 */
export const reducer = createReducer(
  estadosInitialState,
  on(procesoAction.LoadProcesos, (state, { payload }) => ({
    ...state,
    entities: {},
    loading: true,
    loaded: false,
    error: '',
    metadata: payload,
  })),
  on(procesoAction.LoadProcesosSuccess, (state, { payload }) => {
    return procesosAdapter.addMany(payload.data, {
      ...state,
      loading: false,
      loaded: true,
      entities: {},
      ids: [],
      selectedProcesoid: null,
      metadata: payload.meta,
    });
  }),
  on(procesoAction.LoadProcesosError, (state, { payload }) => ({
    ...state,
    entities: {},
    loading: false,
    loaded: false,
    error: payload,
  })),
  on(procesoAction.CleanAllProcesosList, (state, { }) =>
    procesosAdapter.removeAll(state)
  ),
  on(procesoAction.RedirectEds, (state, { idEds }) => ({
    ...state,
    idEdsRedireccionada: idEds,
  })),
  on(procesoAction.CleanRedirectEds, (state) => ({
    ...state,
    idEdsRedireccionada: null,
  })),
  on(procesoAction.AddProceso, (state, { proceso }) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(procesoAction.AddProcesoSuccess, (state, { payload }) => {
    return procesosAdapter.addOne(payload.data, {
      ...state,
      loading: false,
      loaded: true,
    });
  }),
  on(procesoAction.AddProcesoError, (state, { payload }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: payload,
  })),
  on(procesoAction.UpdateProceso, (state, { proceso }) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(procesoAction.UpdateProcesoSuccess, (state, { payload }) => {
    return procesosAdapter.updateOne(
      {
        id: payload.data.idProceso,
        changes: payload.data
      },
      {
        ...state,
        loading: false,
        loaded: true,
      }
    );
  }),
  on(procesoAction.UpdateProcesoError, (state, { payload }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: payload,
  })),
  on(procesoAction.UpdateEstadoProceso, (state, { proceso }) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
);
/**
 * Funcion reducer encargada de manejar los estados y las acciones de los totales de los consolidados de ventas
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function procesosReducer(
  state: (EntityState<Proceso> & ProcesoState) | undefined,
  action: Action
) {
  return reducer(state, action);
}
