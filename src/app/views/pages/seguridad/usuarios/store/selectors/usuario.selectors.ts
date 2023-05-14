import { AppState } from '@core/store/app.interface';
import { SortUtils } from '@core/utils/sort-utils';
import { createSelector } from '@ngrx/store';

export const getUsuarios = (state: AppState) => state['usuario']['entities'];
export const getUsuariosIds = (state: AppState) => state['usuario']['ids'];
export const getSelectedUsuarioId = (state: AppState) => state['usuario']['selectedUsuarioId'];
export const getSelectedUsuario = (state: AppState) => state['usuario']['selectedUsuario'];
export const getUsuariosEntities = createSelector(
    getUsuarios,
    getUsuariosIds,
    (usuarios) => usuarios
);
export const getAllUsuarios = createSelector(getUsuariosEntities, entities => {
    return SortUtils.sortKeyMaxToMin(entities);
});

export const getMetadataUsuarios = (state: AppState) => state['usuario']['metadata'];
