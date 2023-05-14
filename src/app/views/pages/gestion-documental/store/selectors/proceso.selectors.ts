import { AppState } from "@core/store/app.interface";
import { createSelector } from "@ngrx/store";

export const getProcesos = (state: AppState) => state.proceso.entities;
export const getProcesosIds = (state: AppState) => state.proceso.ids;
export const getSelectedProcesoId = (state: AppState) =>
  state.proceso.selectedProcesoid;
export const getSelectedProceso = (state: AppState) =>
  state.proceso.entities[state.proceso.selectedProcesoid];
export const edsRedireccionada = (state: AppState) =>
  state.proceso.idEdsRedireccionada;

export const getProcesosEntities = createSelector(
  getProcesos,
  getProcesosIds,
  (proceso) => proceso
);

export const getAllProcesos = createSelector(
  getProcesosEntities,
  (entities) => {
    return Object.values(entities);
  }
);

export const MetadataProcesos = (state: AppState) => state.proceso.metadata;

export const getMetadataProcesos = createSelector(
  MetadataProcesos,
  (metadatas) => metadatas
);

export const LoadingProcesos = (state: AppState) => state.proceso.loading;

export const getLoadingProcesos = createSelector(
  LoadingProcesos,
  (loading) => loading
);

export const getEdsRedireccionada = createSelector(
  edsRedireccionada,
  (idEds) => idEds
);
