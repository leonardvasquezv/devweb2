import { AppState } from "@core/store/app.interface";
import { createSelector } from "@ngrx/store";

export const getEds = (state: AppState) =>
    state.eds.entities;
export const getEdsIds = (state: AppState) =>
    state.eds.ids;
export const getSelectedEdsId = (state: AppState) =>
    state.eds.selectedEdsid;
export const getSelectedEntitiesEds = (state: AppState) =>
    state.eds.entities[
    state.eds.selectedEdsid
    ];

export const getEdsEntities = createSelector(
    getEds,
    getEdsIds,
    (eds) => eds
);

export const getAllEds = createSelector(
    getEdsEntities,
    (entities) => {
        return Object.values(entities);
    }
);

export const MetadataEds = (state: AppState) =>
    state.eds.metadata;

export const getMetadataEds = createSelector(
    MetadataEds,
    (metadatas) => metadatas
);

export const LoadingEds = (state: AppState) =>
    state.eds.loading;

export const getLoadingEds = createSelector(
    LoadingEds,
    (loading) => loading
)

export const EdsSeleccionada = (state: AppState) =>
    state.eds.edsSeleccionada;

export const getEdsSeleccionada=createSelector(
    EdsSeleccionada,
    (eds)=>eds
)
