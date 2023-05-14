import { AppState } from '@core/store/app.interface';
import { SortUtils } from '@core/utils/sort-utils';
import { createSelector } from '@ngrx/store';

export const getEmpresas = (state: AppState) => state['empresa']['entities'];
export const getEmpresasIds = (state: AppState) => state['empresa']['ids'];
export const getSelectedEmpresaId = (state: AppState) => state['empresa']['selectedEmpresaId'];
export const getEmpresaTieneEdsAsociada = (state: AppState) => state['empresa']['empresaTieneEdsAsociada'];
export const getSelectedEmpresa = (state: AppState) => state.empresa.entities[state.empresa.selectedEmpresaId];
export const getEmpresasEntities = createSelector(
  getEmpresas,
  getEmpresasIds,
  (empresas) => empresas
);
export const getAllEmpresas = createSelector(getEmpresasEntities, entities => {
  return SortUtils.sortKeyMaxToMin(entities);
});

export const getMetadataEmpresas = (state: AppState) => state['empresa']['metadata'];
export const getEstadoFormularioPerfil = ({ empresa }) => empresa.estadoFormularioPerfil;
export const getPaginas = (state: AppState) => state['empresa']['paginas'];
export const getPermisos = (state: AppState) => state['empresa']['permisos'];
