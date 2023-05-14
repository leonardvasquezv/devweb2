import { AppState } from '@core/store/app.interface';
import { createSelector } from '@ngrx/store';

export const getCrearEds = (state: AppState) => state.crearEds?.entities;

export const getcrearEdsIds = (state: AppState) => state.crearEds?.ids;

export const getSelectedcrearEdsId = (state: AppState) =>
  state.crearEds.selectedCrearEdsId;

export const getSelectedcrearEds = (state: AppState) =>
  state.crearEds.entities[state.crearEds.selectedCrearEdsId];

export const getcrearEdsEntities = createSelector(
  getCrearEds,
  getcrearEdsIds,
  (crearEds) => crearEds
);

export const getInfoCrearEds = createSelector(
  getcrearEdsEntities,
  (entities) => {
    return Object.values(entities);
  }
);
