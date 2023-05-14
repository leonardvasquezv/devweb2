import { AppState } from "@core/store/app.interface";
import { SortUtils } from "@core/utils/sort-utils";
import { createSelector } from "@ngrx/store";

export const getDocumentos = (state: AppState) => state.documento.entities;
export const getDocumentosIds = (state: AppState) => state.documento.ids;
export const getSelectedDocumentoId = (state: AppState) => state.documento.selectedDocumentoid;
export const getSelectedDocumento = (state: AppState) =>
  state.documento.entities[
  state.documento.selectedDocumentoid
  ];
export const redireccionEds = (state: AppState) =>
  state.documento.edsCrearDocumento;
export const redireccionProceso = (state: AppState) =>
  state.documento.procesoCrearDocumento;


export const getDocumentosEntities = createSelector(
  getDocumentos,
  getDocumentosIds,
  (documento) => documento
);

export const getAllDocumentos = createSelector(
  getDocumentosEntities,
  (entities) => {
    return SortUtils.sortKeyMaxToMin(entities);
  }
);

export const MetadataDocumentos = (state: AppState) =>
  state.documento.metadata;

export const getMetadataDocumentos = (state: AppState) => state.documento.metadata;

export const LoadingDocumentos = (state: AppState) =>
  state.documento.loading;

export const getLoadingDocumentos = createSelector(
  LoadingDocumentos,
  (loading) => loading
)

export const getRedireccionEds = createSelector(
  redireccionEds,
  (eds) => eds
)
export const getRedireccionProceso = createSelector(
  redireccionProceso,
  (proceso) => proceso
)

