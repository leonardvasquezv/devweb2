import { DataEds } from '@core/interfaces/data-eds.interface';
import { Documento } from "@core/interfaces/Documento.interface";
import { Proceso } from "@core/interfaces/proceso.interface";
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from "@ngrx/store";
import * as DocumentoAction from "../actions/documento.actions";

/**
 * Interfaz que maneja los estado de los Documentos de gestion documental
 */
export interface DocumentoState extends EntityState<Documento> {
  ids: Array<any>;
  selectedDocumentoid: number;
  loading: boolean;
  loaded: boolean;
  error: string;
  metadata: any;
  procesoCrearDocumento: Proceso;
  edsCrearDocumento: DataEds;

}

/*
 * Inicialización del estado de los Documentos de gestion documental
 */
export const defaultEstado: DocumentoState = {
  ids: [],
  entities: {},
  selectedDocumentoid: 0,
  loading: false,
  loaded: false,
  error: '',
  metadata: null,
  procesoCrearDocumento: null,
  edsCrearDocumento: null
};

/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer de los Documentos de gestion documental
 */
export const DocumentosAdapter: EntityAdapter<Documento> =
  createEntityAdapter<Documento>({selectId: (documento) => documento.idDocumento });

/**
 * Inicializacion del estado de los Documentos de gestion documental
 */
export const estadosInitialState = DocumentosAdapter.getInitialState(defaultEstado);
/**
 * Reducer de los totales de documentos
 */
export const reducer = createReducer(
  estadosInitialState,
  on(DocumentoAction.LoadDocumentos,
    (state, { criterios }) => ({
      ...state,
      entities: {},
      loading: true,
      loaded: false,
      error: '',
    })
  ),
  on(DocumentoAction.LoadDocumentosSuccess,
    (state, { payload }) => {
      return DocumentosAdapter.addMany(payload.data, {
        ...state,
        loading: false,
        loaded: true,
        entities: {},
        ids: [],
        selectedDocumentoid: null,
        metadata: payload.meta,
      });
    }
  ),
  on(DocumentoAction.LoadDocumentosError,
    (state, { payload }) => ({
      ...state,
      entities: {},
      loading: false,
      loaded: false,
      error: payload,
    })
  ),
  on(DocumentoAction.CleanAllDocumentosList, (state, { }) =>
    DocumentosAdapter.removeAll(state)
  ),
  on(DocumentoAction.createDocumentosSuccess, (state, { payload }) => (
    DocumentosAdapter.addOne(payload, { ...state, entities: { payload, ...state.entities } })
  )),
  on(DocumentoAction.createDocumentosError, (state, { payload }) => ({
    ...state,
    error: payload
  })),
  on(DocumentoAction.UpdateDocumento,
    (state, { documento }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: '',
    })
  ),
  on(DocumentoAction.UpdateDocumentoSuccess,
    (state, { payload }) => {
      return DocumentosAdapter.updateOne(payload.data, {
        ...state,
        loading: false,
        loaded: true,
        selectedDocumentoid: payload.data.id,
        metadata: payload.meta,
      });
    }
  ),
  on(DocumentoAction.UpdateDocumentoError,
    (state, { payload }) => ({
      ...state,
      loading: false,
      loaded: true,
      error: payload,
    })
  ),
  on(DocumentoAction.SelectDocumento,
    (state, { selectedDocumentoid }) => ({
      ...state,
      selectedDocumentoid
    })
  ),
  on(DocumentoAction.Redirect,
    (state, { eds, proceso }) => ({
      ...state,
      procesoCrearDocumento: proceso,
      edsCrearDocumento: eds

    })
  ),
  on(DocumentoAction.CleanRedirect,
    (state) => ({
      ...state,
      idProcesoCrearDocumento: null,
      idEdsCrearDocumento: null
    })
  )
);
/**
 * Funcion reducer encargada de manejar los estados y las acciones de los totales de los consolidados de ventas
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function documentosReducer(state: DocumentoState | (EntityState<Documento> & DocumentoState) | undefined, action: Action) {
  return reducer(state, action);
}
