import { AppState } from '@core/store/app.interface';
import { SortUtils } from '@core/utils/sort-utils';
import { createSelector } from '@ngrx/store';

export const getAlertas = (state: AppState) => state.alerta.entities;
export const getAlertasIds = (state: AppState) => state.alerta.ids;
export const getSelectedAlertaId = (state: AppState) => state.alerta.selectedAlertaid;
export const getSelectedAlerta = (state: AppState) => state.alerta.entities[state.alerta.selectedAlertaid];

export const getAlertasEntities = createSelector(
  getAlertas,
  getAlertasIds,
  (alerta) => alerta
);

export const getAllAlertas = createSelector(getAlertasEntities, (entities) => {
  return SortUtils.sortKeyMaxToMin(entities);
});

export const MetadataAlertas = (state: AppState) => state.alerta.metadata;

export const getMetadataAlertas = createSelector(
  MetadataAlertas,
  (metadatas) => metadatas
);

export const LoadingAlerta = (state: AppState) => state.alerta.loading;

export const getLoadingAlertas = createSelector(
  LoadingAlerta,
  (loading) => loading
);
