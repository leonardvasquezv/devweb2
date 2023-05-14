
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Empresa } from '@core/interfaces/seguridad/empresa.interface';
import { Pagina } from '@core/interfaces/seguridad/pagina.interface';
import { Permiso } from '@core/interfaces/seguridad/permiso.interface';
import { createAction, props } from '@ngrx/store';

export enum EmpresaActionsTypes {
  LoadEmpresas = '[EMPRESA] Load Empresas',
  LoadEmpresasSuccess = '[EMPRESA] Load Empresas Success',
  LoadEmpresasError = '[EMPRESA] Load Empresas Error',
  LoadEmpresa = '[EMPRESA] Load Empresa',
  LoadEmpresaSuccess = '[EMPRESA] Load Empresa Success',
  LoadEmpresaError = '[EMPRESA] Load Empresa Error',
  CreateEmpresa = '[EMPRESA] Create Empresa',
  CreateEmpresaSuccess = '[EMPRESA] Create Empresa Success',
  CreateEmpresaError = '[EMPRESA] Create Empresa Error',
  UpdateEmpresa = '[EMPRESA] Update Empresa',
  UpdateEmpresaSuccess = '[EMPRESA] Update Empresa Success',
  UpdateEmpresaError = '[EMPRESA] Update Empresa Error',
  DeleteEmpresa = '[EMPRESA] Delete Empresa',
  DeleteEmpresaSuccess = '[EMPRESA] Delete Empresa Success',
  DeleteEmpresaError = '[EMPRESA] Delete Empresa Error',
  ActivarEmpresa = '[EMPRESA] Activar Empresa',
  ActivarEmpresaSuccess = '[EMPRESA] Activar Empresa Success',
  ActivarEmpresaError = '[EMPRESA] Activar Empresa Error',
  InactivarEmpresa = '[EMPRESA] Inactivar Empresa',
  InactivarEmpresaSuccess = '[EMPRESA] Inactivar Empresa Success',
  InactivarEmpresaError = '[EMPRESA] Inactivar Empresa Error',
  CleanEmpresaList = '[EMPRESA] Clean Empresa List',
  EmpresaTieneEdsAsociada = '[EMPRESA] Check Si empresa tiene eds asociada',
  CleanEmpresaTieneEdsAsociada = '[EMPRESA] Clean check Si empresa tiene eds asociada',
  AsignarFormularioPerfilEditado = '[EMPRESA] Asignar Formulario Perfil Editado',
  LoadPaginas = '[EMPRESA] Cargar paginas globales',
  LoadPaginasSuccess = '[EMPRESA] Cargar paginas globales Success',
  LoadPermisos = '[EMPRESA] Cargar permisos globales',
  LoadPermisosSuccess = '[EMPRESA] Cargar permisos globales Success',
}

// General
export const cleanEmpresaList = createAction(EmpresaActionsTypes.CleanEmpresaList);
export const asignarFormularioPerfilEditado = createAction(
  EmpresaActionsTypes.AsignarFormularioPerfilEditado,
  props<{ estado: boolean }>()
);
export const loadPaginas = createAction(
  EmpresaActionsTypes.LoadPaginas,
  props<{ criterios: Array<ObjParam> }>())
  ;
export const loadPaginasSuccess = createAction(
  EmpresaActionsTypes.LoadPaginasSuccess,
  props<{ paginas: Array<Pagina> }>())
  ;

export const loadPermisos = createAction(
  EmpresaActionsTypes.LoadPermisos,
  props<{ criterios: Array<ObjParam> }>())
  ;
export const loadPermisosSuccess = createAction(
  EmpresaActionsTypes.LoadPermisosSuccess,
  props<{ permisos: Array<Permiso> }>())
  ;

// Create
export const createEmpresa = createAction(
  EmpresaActionsTypes.CreateEmpresa,
  props<{ payload: Empresa }>()
);

export const createEmpresaSuccess = createAction(
  EmpresaActionsTypes.CreateEmpresaSuccess,
  props<{ payload: Empresa }>()
);

export const createEmpresaError = createAction(
  EmpresaActionsTypes.CreateEmpresaError,
  props<{ payload: any }>()
);


// Update
export const updateEmpresa = createAction(
  EmpresaActionsTypes.UpdateEmpresa,
  props<{ payload: Empresa }>()
);

export const updateEmpresaSuccess = createAction(
  EmpresaActionsTypes.UpdateEmpresaSuccess,
  props<{ payload: any }>()
);

export const updateEmpresaError = createAction(
  EmpresaActionsTypes.UpdateEmpresaError,
  props<{ payload: any }>()
);

// All
export const loadEmpresas = createAction(
  EmpresaActionsTypes.LoadEmpresas,
  props<{ criterios: Array<ObjParam> }>())
  ;

export const loadEmpresasSuccess = createAction(
  EmpresaActionsTypes.LoadEmpresasSuccess,
  props<{ payload: ResponseWebApi }>()
);

export const loadEmpresasError = createAction(
  EmpresaActionsTypes.LoadEmpresasError,
  props<{ payload: any }>()
);


// One
export const loadEmpresa = createAction(
  EmpresaActionsTypes.LoadEmpresa,
  props<{ id: number }>()
);

export const loadEmpresaSuccess = createAction(
  EmpresaActionsTypes.LoadEmpresaSuccess,
  props<{ empresa: Empresa }>()
);

export const loadEmpresaError = createAction(
  EmpresaActionsTypes.LoadEmpresaError,
  props<{ payload: any }>()
);

// activar
export const activarEmpresa = createAction(
  EmpresaActionsTypes.ActivarEmpresa,
  props<{ payload: any }>()
);

export const activarEmpresaSuccess = createAction(
  EmpresaActionsTypes.ActivarEmpresaSuccess,
  props<{ payload: any }>()
);

export const activarEmpresaError = createAction(
  EmpresaActionsTypes.ActivarEmpresaError,
  props<{ payload: any }>()
);

// inactivar
export const inactivarEmpresa = createAction(
  EmpresaActionsTypes.InactivarEmpresa,
  props<{ payload: any }>()
);

export const inactivarEmpresaSuccess = createAction(
  EmpresaActionsTypes.InactivarEmpresaSuccess,
  props<{ payload: any }>()
);

export const inactivarEmpresaError = createAction(
  EmpresaActionsTypes.InactivarEmpresaError,
  props<{ payload: any }>()
);

export const empresaTieneEdsAsociada = createAction(
  EmpresaActionsTypes.EmpresaTieneEdsAsociada,
  props<{ payload: boolean }>()
)
export const cleanEmpresaTieneEdsAsociada = createAction(
  EmpresaActionsTypes.CleanEmpresaTieneEdsAsociada
)

