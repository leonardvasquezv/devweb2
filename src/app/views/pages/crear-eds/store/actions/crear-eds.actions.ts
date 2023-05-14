import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { CrearEds } from '@core/interfaces/crear-eds.interface';
import { createAction, props } from '@ngrx/store';


export enum CrearEdsActionTypes {
  EAddInfoCrearEds = '[CrearEds] Load CrearEds Success',
  EupdateInfoCrearEdsSuccess = '[CrearEds] Update CrearEds Success',
  AddServiciosInfoCrearEds = '[CrearEds] Load Info servicios Eds',
  CreateEds = '[Eds] Create Eds',

  EcleanCrearEdsList = '[CrearEds] Clean CrearEds List',
}
// General
export const cleanCrearEdsList = createAction(
  CrearEdsActionTypes.EcleanCrearEdsList
);

export const AddInfoCrearEds = createAction(
  CrearEdsActionTypes.EAddInfoCrearEds,
  props<{ idEds: number }>()
);

export const UpdateInfoCrearEdsSuccess = createAction(
  CrearEdsActionTypes.EupdateInfoCrearEdsSuccess,
  props<{ infoEds: CrearEds }>()
);

export const CreateEds = createAction(
  CrearEdsActionTypes.CreateEds,
  props<{ eds: Array<ObjParam> }>()
);

