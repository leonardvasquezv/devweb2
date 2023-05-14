import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { createAction, props } from '@ngrx/store';
import { ResponseWebApi } from '../../interfaces/base/responseWebApi.interface';


export enum ParametrizacionesActionTypes {
  ELoadParametrizaciones = '[Parametrizaciones] Load Parametrizaciones',
  ELoadParametrizacionesSuccess = '[Parametrizaciones] Load Parametrizaciones Success',
  ELoadParametrizacionesError = '[Parametrizaciones] Load Parametrizaciones Error',
  CreateParametrizaciones = '[Parametrizaciones] Create Parametrizaciones',
  CreateParametrizacionesSuccess = '[Parametrizaciones] Create Parametrizaciones Success',
  CreateParametrizacionesError = '[Parametrizaciones] Create Parametrizaciones Error',
  LoadParametrizacion = '[Parametrizaciones] Load Parametrizacion',
  LoadParametrizacionSuccess = '[Parametrizaciones] Load Parametrizacion Success',
  LoadParametrizacionError = '[Parametrizaciones] Load Parametrizacion Error',
  UpdateParametrizacion = '[Parametrizaciones] Update Parametrizacion',
  UpdateParametrizacionSuccess = '[Parametrizaciones] Update Parametrizacion Success',
  UpdateParametrizacionError = '[Parametrizaciones] Update Parametrizacion Error',
  CambioEstadoParametrizacion = '[Parametrizaciones] Cambio Estado Parametrizacion',
  CambioEstadoParametrizacionSuccess = '[Parametrizaciones] Cambio Estado Parametrizacion Success',
  CambioEstadoParametrizacionError = '[Parametrizaciones] Cambio Estado Parametrizacion Error',
}

// All
export const loadParametrizaciones = createAction(
  ParametrizacionesActionTypes.ELoadParametrizaciones,
  props<{ criterios: Array<ObjParam> }>()
)

export const loadParametrizacionesSuccess = createAction(
  ParametrizacionesActionTypes.ELoadParametrizacionesSuccess,
  props<{ payload: ResponseWebApi }>()
)

export const loadParametrizacionesError = createAction(
  ParametrizacionesActionTypes.ELoadParametrizacionesError,
  props<{ payload: any }>()
)

//Create
export const createParametrizaciones = createAction(
  ParametrizacionesActionTypes.CreateParametrizaciones,
  props<{ payload: TipoDetalle }>()
)

export const createParametrizacionesSuccess = createAction(
  ParametrizacionesActionTypes.CreateParametrizacionesSuccess,
  props<{ payload: TipoDetalle }>()
)

export const createParametrizacionesError = createAction(
  ParametrizacionesActionTypes.CreateParametrizacionesError,
  props<{ payload: any }>()
)

// One
export const loadParametrizacion = createAction(
  ParametrizacionesActionTypes.LoadParametrizacion,
  props<{ idTipoDetalle: number }>()
)

export const loadParametrizacionSuccess = createAction(
  ParametrizacionesActionTypes.LoadParametrizacionSuccess,
  props<{ tipoDetalle: TipoDetalle }>()
)

export const loadParametrizacionError = createAction(
  ParametrizacionesActionTypes.LoadParametrizacionError,
  props<{ payload: any }>()
)

// Edit
export const updateParametrizacion = createAction(
  ParametrizacionesActionTypes.UpdateParametrizacion,
  props<{ tipoDetalle: TipoDetalle }>()
)

export const updateParametrizacionSuccess = createAction(
  ParametrizacionesActionTypes.UpdateParametrizacionSuccess,
  props<{  payload: any }>()
)

export const updateParametrizacionError = createAction(
  ParametrizacionesActionTypes.UpdateParametrizacionError,
  props<{ payload: any }>()
)

// Cambio estado
export const cambioEstadoParametrizacion = createAction(
  ParametrizacionesActionTypes.CambioEstadoParametrizacion,
  props<{ tipoDetalle: TipoDetalle }>()
)

export const cambioEstadoParametrizacionSuccess = createAction(
  ParametrizacionesActionTypes.CambioEstadoParametrizacionSuccess,
  props<{  payload: any }>()
)

export const cambioEstadoParametrizacionError = createAction(
  ParametrizacionesActionTypes.CambioEstadoParametrizacionError,
  props<{ payload: any }>()
)
