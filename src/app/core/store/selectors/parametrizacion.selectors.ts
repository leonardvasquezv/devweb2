import { SortUtils } from '@core/utils/sort-utils';
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.interface';

export const getParametrizaciones = (state: AppState) => state.parametrizacion.entities;
export const getParametrizacionesIds = (state: AppState) => state.parametrizacion.ids;
export const getSelectedParametrizacionId = (state: AppState) => state.parametrizacion.selectedParametrizacionId;
export const getSelectedParametrizacion = (state: AppState) =>
  state.parametrizacion.entities[state.parametrizacion.selectedParametrizacionId];

export const getParametrizacionesEntities = createSelector(
  getParametrizaciones,
  getParametrizacionesIds,
  (parametrizacion) => parametrizacion
);

export const getAllParametrizaciones = createSelector(getParametrizacionesEntities, (entities) => {
  return SortUtils.sortKeyMaxToMin(entities);
});

export const getMetadataParametrizaciones = (state: AppState) => state.parametrizacion.metadata;
