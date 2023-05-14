import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Proceso } from '@core/interfaces/proceso.interface';
import { createAction, props } from '@ngrx/store';

export enum ProcesoActionTypes {
  LoadProcesos = '[Procesos] Load Procesos',
  LoadProcesosSuccess = '[Procesos] Load Procesos Success',
  LoadProcesosError = '[Procesos] Load Procesos Error',
  CleanProcesosList = '[Procesos] Clean Procesos List',

  LoadProceso = '[Proceso] Load Proceso',
  LoadProcesoSuccess = '[Proceso] Load Proceso Success',
  LoadProcesoError = '[Proceso] Load Proceso Error',

  EUpdateProceso = '[Proceso] Update Proceso',
  EUpdateProcesoSuccess = '[Proceso] Update Proceso Success',
  EUpdateProcesoError = '[Proceso] Update Proceso Error',

  EUpdateEstadoProceso = '[Proceso] Update Estado Proceso',

  EAddProceso = '[Proceso] Create Proceso',
  EAddProcesoSuccess = '[Proceso] Create  Proceso Success',
  EAddProcesoError = '[Proceso] Create Proceso Error',

  ProcesoSelected = '[Proceso] Proceso Selected',

  RedirectEds = '[Proceso] RedirectEds Eds',
  CleanRedirectEds = '[Proceso] Clean RedirectEds Eds',
}

// Cargar los procesos
export const LoadProcesos = createAction(
  ProcesoActionTypes.LoadProcesos,
  props<{ payload: Array<ObjParam> }>()
);
//caso exito de carga
export const LoadProcesosSuccess = createAction(
  ProcesoActionTypes.LoadProcesosSuccess,
  props<{ payload: ResponseWebApi }>()
);
//caso negativo de carga de procesos
export const LoadProcesosError = createAction(
  ProcesoActionTypes.LoadProcesosError,
  props<{ payload: any }>()
);
/**
 * Limpia Listado de procesos cargados
 */
export const CleanAllProcesosList = createAction(
  ProcesoActionTypes.CleanProcesosList
);
/**
 * Carga un solo proceso
 */
export const LoadProceso = createAction(
  ProcesoActionTypes.LoadProceso,
  props<{ criterios: ObjParam }>()
);
//caso exito de carga
export const LoadProcesoSuccess = createAction(
  ProcesoActionTypes.LoadProcesoSuccess,
  props<{ payload: ResponseWebApi }>()
);
//caso negativo de carga de un proceso
export const LoadProcesoError = createAction(
  ProcesoActionTypes.LoadProcesoError,
  props<{ payload: any }>()
);

export const AddProceso = createAction(
  ProcesoActionTypes.EAddProceso,
  props<{ proceso: Proceso }>()
);
//caso exito de creación de Proceso
export const AddProcesoSuccess = createAction(
  ProcesoActionTypes.EAddProcesoSuccess,
  props<{ payload: ResponseWebApi }>()
);
//caso negativo de creacion de proceso
export const AddProcesoError = createAction(
  ProcesoActionTypes.EAddProcesoError,
  props<{ payload: any }>()
);

export const UpdateProceso = createAction(
  ProcesoActionTypes.EUpdateProceso,
  props<{ proceso: Proceso }>()
);
//caso exito de Actualizacion de proceso
export const UpdateProcesoSuccess = createAction(
  ProcesoActionTypes.EUpdateProcesoSuccess,
  props<{ payload: ResponseWebApi }>()
);
//caso negativo de actualización de proceso
export const UpdateProcesoError = createAction(
  ProcesoActionTypes.EUpdateProcesoError,
  props<{ payload: any }>()
);
export const UpdateEstadoProceso = createAction(
  ProcesoActionTypes.EUpdateEstadoProceso,
  props<{ proceso: Proceso }>()
);

export const RedirectEds = createAction(
  ProcesoActionTypes.RedirectEds,
  props<{ idEds: number }>()
);

export const CleanRedirectEds = createAction(
  ProcesoActionTypes.CleanRedirectEds
);
