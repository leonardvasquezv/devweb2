import { ObjParam } from "@core/interfaces/base/objParam.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { createAction, props } from "@ngrx/store";
import { DataEds } from '../../interfaces/data-eds.interface';

export enum EdsActionTypes {
    LoadEds = '[Eds] Load Eds',
    LoadEdsSuccess = '[Eds] Load Eds Success',
    LoadProcesosError = '[Eds] Load Eds Error',
    CleanEdsList = '[Eds] Clean Eds List',
    CleanOneEds = '[Eds] Clean one eds',

    EUpdateEstadoEds = "[Eds] Update Estado Eds",
    EUpdateEstadoEdsSuccess = "[Eds] Update Estado Eds Success",
    EUpdateEstadoEdsError = "[Eds] Update Estado Eds Error",

    ESeleccionEds = "[Eds] Selecionar Eds",

    CreateEds = '[Eds] Create Eds',

}

export const LoadEds = createAction(
    EdsActionTypes.LoadEds,
    props<{ payload: Array<ObjParam> }>()
);
export const LoadEdsSuccess = createAction(
    EdsActionTypes.LoadEdsSuccess,
    props<{ payload: ResponseWebApi }>()
);
export const LoadEdsError = createAction(
    EdsActionTypes.LoadProcesosError,
    props<{ payload: any }>()
);
export const CleanAllEdsList = createAction(
    EdsActionTypes.CleanEdsList,
);
export const cleanOneEds = createAction(
    EdsActionTypes.CleanOneEds,
);
export const UpdateEstadoEds = createAction(
    EdsActionTypes.EUpdateEstadoEds,
    props<{ payload: Array<ObjParam> }>()
);

export const UpdateEstadoEdsSuccess = createAction(
    EdsActionTypes.EUpdateEstadoEdsSuccess,
    props<{ payload: ResponseWebApi }>()
);

export const UpdateEstadoEdsError = createAction(
    EdsActionTypes.EUpdateEstadoEdsError,
    props<{ payload: any }>()
);

export const CreateEds = createAction(
    EdsActionTypes.CreateEds,
    props<{ eds: DataEds }>()
);

export const SeleccionarEds = createAction(
    EdsActionTypes.ESeleccionEds,
    props<{ eds: DataEds }>()
);
