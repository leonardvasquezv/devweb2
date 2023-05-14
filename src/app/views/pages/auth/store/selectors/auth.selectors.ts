 import { AppState } from '@core/store/app.interface';
import { createSelector } from '@ngrx/store';
// import { createSelector } from '@ngrx/store';

// export const getAuths = (state: AppState) => state['Auth']['entities'];
// export const getAuthsIds = (state: AppState) => state['Auth']['ids'];
// export const getSelectedAuthId = (state: AppState) => state['Auth']['selectedAuthId'];
// export const getSelectedAuth = (state: AppState) => state.auth.entities[state.auth.selectedEmpresaId];
// export const getAuthsEntities = createSelector(
//     getAuths,
//     getAuthsIds,
//     (Auths) => Auths
// );
// export const getAllAuths = createSelector(getAuthsEntities, entities => {
//     return Object.keys(entities).map(id => entities[id]);
// });
//export const getEmpresa = (state: AppState) => state['auth']['empresa'];