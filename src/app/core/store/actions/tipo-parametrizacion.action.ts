import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { createAction, props } from '@ngrx/store';
import { ResponseWebApi } from '../../interfaces/base/responseWebApi.interface';

export enum TipoParametrizacionActionTypes {
  ELoadTiposParametrizacion = '[TipoParametrizacion] Load TiposParametrizacion',
  ELoadTiposParametrizacionSuccess = '[TipoParametrizacion] Load TiposParametrizacion Success',
  ELoadTiposParametrizacionError = '[TipoParametrizacion] Load TiposParametrizacion Error',
}

export const loadTiposParametrizacion = createAction(
  TipoParametrizacionActionTypes.ELoadTiposParametrizacion,
  props<{ payload: Array<ObjParam> }>()
);

export const loadtTiposParametrizacionSuccess = createAction(
  TipoParametrizacionActionTypes.ELoadTiposParametrizacionSuccess,
  props<{ payload: ResponseWebApi }>()
);

export const loadtTiposParametrizacionError = createAction(
  TipoParametrizacionActionTypes.ELoadTiposParametrizacionError,
  props<{ payload: any }>()
);
