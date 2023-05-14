import { AppState } from '@core/store/app.interface';
import { SortUtils } from '@core/utils/sort-utils';
import { createSelector } from '@ngrx/store';

export const getPermisos = (state: AppState) => state.permiso.entities;
export const getPermisosIds = (state: AppState) => state['permiso']['ids'];
export const getSelectedPermisoId = (state: AppState) => state['permiso']['selectedPermisoId'];
export const getSelectedPermiso = (state: AppState) => state.permiso.entities[state.permiso.selectedPermisoId];
export const getPermisosEntities = createSelector(
    getPermisos,
    getPermisosIds,
    (permisos) => permisos
);
export const getAllPermisos = createSelector(getPermisosEntities, entities => {
    return SortUtils.sortKeyMaxToMin(entities);
});

export const getMetadataPermisos = (state: AppState) => state.permiso.metadata;