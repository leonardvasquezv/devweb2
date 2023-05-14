import { AppState } from '@core/store/app.interface';
import { createSelector } from '@ngrx/store';

export const getEstadosCiviles = (state: AppState) => state.global.estadosCiviles;
export const Departamentos = (state: AppState) => state.global.departamentos;
export const Municipios = (state: AppState) => state.global.municipios;
export const getBreadcrumb = (state: AppState) => state.global.breadcrumb;

export const getDepartamentos = createSelector(
  Departamentos,
  (departamentos) => departamentos
);

export const getMunicipios = createSelector(
  Municipios,
  (municipios) => municipios
);
