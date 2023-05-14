import { Breadcrumb } from '@core/interfaces/base/breadcrumb.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { createAction, props } from '@ngrx/store';

export enum GlobalActionsTypes {
    LoadGlobals = '[GLOBAL] Load Globals',
    LoadGlobalsSuccess = '[GLOBAL] Load Globals Success',
    LoadGlobalsError = '[GLOBAL] Load Globals Error',
    SaveNewErrorRequest = '[GLOBAL] Request Globals Error',
    SetBreadCrumb = '[GLOBAL] Asignar breadcrumb'
}

// All
export const loadGlobals = createAction(GlobalActionsTypes.LoadGlobals);

export const loadGlobalsSuccess = createAction(
    GlobalActionsTypes.LoadGlobalsSuccess,
    props<{ payload: Array<ResponseWebApi> }>()
);

export const loadGlobalsError = createAction(
    GlobalActionsTypes.LoadGlobalsError,
    props<{ payload: any }>()
);

export const setBreadCrumb = createAction(
    GlobalActionsTypes.SetBreadCrumb,
    props<{breadcrumb: Breadcrumb}>()
)
/**
 * Acción permite disparar el evento error desde los effects
 */
export const saveNewErrorRequest = createAction(GlobalActionsTypes.SaveNewErrorRequest);
