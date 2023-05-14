import { Archivo } from "@core/interfaces/archivo.interface";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import * as ArchivoActions from "../actions/archivo.actions";

/**
 * Interfaz que maneja los estado de los Archivos de gestion documental
 */
export interface ArchivoState extends EntityState<Archivo> {
  ids: Array<any>;
  selectedArchivoid: number;
  loading: boolean;
  loaded: boolean;
  error: string;
  metadata: any;
}

/*
 * Inicialización del estado de los Archivos de gestion documental
 */
export const defaultEstado: ArchivoState = {
  ids: [],
  entities: {},
  selectedArchivoid: 0,
  loading: false,
  loaded: false,
  error: "",
  metadata: null,
};

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer de los Archivos de gestion documental
 */
export const ArchivoAdapter: EntityAdapter<Archivo> =
  createEntityAdapter<Archivo>({
    selectId: (archivo) => archivo.idDocumento,
  });

/**
 * Inicializacion del estado de los Archivos de gestion documental
 */
export const estadosInitialState =
  ArchivoAdapter.getInitialState(defaultEstado);

/**
 * Reducer de  la informacion del archivo a crear
 */
export const reducer = createReducer(
  estadosInitialState,
  on(ArchivoActions.LoadArchivos, (state, { criterios }) => ({
    ...state,
    entities: {},
    loading: true,
    loaded: false,
    error: "",
    metadata: criterios,
  })),
  on(ArchivoActions.LoadArchivosSuccess, (state, { payload }) => {
    return ArchivoAdapter.addMany(payload.data, {
      ...state,
      loading: false,
      loaded: true,
      entities: {},
      ids: [],
      metadata: payload.meta,
    });
  }),
  on(ArchivoActions.LoadArchivosError, (state, { payload }) => ({
    ...state,
    entities: {},
    loading: false,
    loaded: false,
    error: payload,
  })),
  on(ArchivoActions.CleanArchivosList, (state, { }) =>
    ArchivoAdapter.removeAll(state)
  ),
  on(ArchivoActions.updateArchivoSuccess, (state, { payload }) => {
    return ArchivoAdapter.updateOne(
      {
        id: payload.data.idArchivo,
        changes: payload.data,
      },
      {
        ...state,
      }
    );
  }),
  on(ArchivoActions.updateArchivoError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de  la informacion del Archivo a crear
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function ArchivoReducer(
  state: (EntityState<Archivo> & ArchivoState) | undefined,
  action: Action
) {
  return reducer(state, action);
}
