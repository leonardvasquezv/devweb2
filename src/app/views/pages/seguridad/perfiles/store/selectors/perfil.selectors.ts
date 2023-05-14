import { AppState } from '@core/store/app.interface';
import { SortUtils } from '@core/utils/sort-utils';
import { createSelector } from '@ngrx/store';

export const getPerfiles = (state: AppState) => state['perfil']['entities'];
export const getPerfilesIds = (state: AppState) => state['perfil']['ids'];
export const getSelectedPerfilId = (state: AppState) => state['perfil']['selectedPerfilId'];
export const getSelectedPerfil = (state: AppState) => state.perfil.entities[state.perfil.selectedPerfilId];
export const getPerfilesGrupo = (state: AppState) => state['perfil']['perfilesGrupo'];
export const getPerfilesEntities = createSelector(
    getPerfiles,
    getPerfilesIds,
    (perfiles) => perfiles
);
export const getAllPerfiles = createSelector(getPerfilesEntities, entities => {
    return SortUtils.sortKeyMaxToMin(entities);
});

export const getMetadataPerfiles = (state: AppState) => state['perfil']['metadata'];
