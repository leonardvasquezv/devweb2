import { AppState } from "@core/store/app.interface";
import { createSelector } from "@ngrx/store";

export const getArchivos = (state: AppState) => state.archivo.entities;
export const getArchivosIds = (state: AppState) => state.archivo.ids;
export const getSelectedArchivoId = (state: AppState) =>
  state.archivo.selectedArchivoid;
export const getSelectedArchivo = (state: AppState) =>
  state.archivo.entities[state.archivo.selectedArchivoid];

export const getArchivosEntities = createSelector(
  getArchivos,
  getArchivosIds,
  (archivo) => archivo
);

export const getAllArchivos = createSelector(
  getArchivosEntities,
  (entities) => {
    return Object.values(entities);
  }
);

export const MetadataArchivo = (state: AppState) => state.archivo.metadata;

export const getMetadataArchivos = createSelector(
  MetadataArchivo,
  (metadatas) => metadatas
);

export const LoadingArchivo = (state: AppState) => state.archivo.loading;

export const getLoadingArchivos = createSelector(
  LoadingArchivo,
  (loading) => loading
);
