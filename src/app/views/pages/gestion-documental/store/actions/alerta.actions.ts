import { Alerta } from '@core/interfaces/Alerta.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { createAction, props } from '@ngrx/store';

export enum AlertaActionTypes {
  CleanAlertasList = '[Alertas] Clean Alertas List',

  LoadAlertas = '[Alertas] Load Alertas',
  LoadAlertasSuccess = '[Alertas] Load Alertas Success',
  LoadAlertasError = '[Alertas] Load Alertas Error',

  AddAlertas = '[Alertas] Create Alertas',
  AddAlertasSuccess = '[Alertas] Create Alertas Success',
  AddAlertasError = '[Alertas] Create Alertas Error',

  LoadAlerta = '[Alerta] Load Alerta', //no creo que se utilice
  LoadAlertaSuccess = '[Alerta] Load Alerta Success', //no creo que se utilice
  LoadAlertaError = '[Alerta] Load Alerta Error', //no creo que se utilice

  EUpdateAlerta = '[Alerta] Update Alerta',
  UpdateAlertaSuccess = '[Alerta] Update Alerta Success',
  UpdateAlertaError = '[Alerta] Update Alerta Error',

  CreateAlerta = '[Alerta] Create Alerta', //no creo que se utilice

  AlertasSelected = '[Alerta] Alertas Selected',

  AlertaSelected = '[Alerta] Alerta Selected',
}

// General
export const CleanAlertasList = createAction(
  AlertaActionTypes.CleanAlertasList
);

export const loadAlertas = createAction(
  AlertaActionTypes.LoadAlertas,
  props<{ idDocumento: number }>()
);

export const loadAlertasSuccess = createAction(
  AlertaActionTypes.LoadAlertasSuccess,
  props<{ payload: ResponseWebApi }>()
);

export const loadAlertasError = createAction(
  AlertaActionTypes.LoadAlertasError,
  props<{ payload: any }>()
);

export const AddAlertas = createAction(
  AlertaActionTypes.AddAlertas,
  props<{ alertas: Array<Alerta> }>()
);

export const AddAlertasSuccess = createAction(
  AlertaActionTypes.AddAlertasSuccess,
  props<{ alertas: Array<Alerta> }>()
);

export const AddAlertasError = createAction(
  AlertaActionTypes.AddAlertasError,
  props<{ alertas: any }>()
);

export const UpdateAlerta = createAction(
  AlertaActionTypes.EUpdateAlerta,
  props<{ alerta: Alerta }>()
);

export const UpdateAlertaSuccess = createAction(
  AlertaActionTypes.AddAlertasSuccess,
  props<{ alertas: Array<Alerta> }>()
);

export const UpdateAlertaError = createAction(
  AlertaActionTypes.AddAlertasError,
  props<{ alerta: any }>()
);
