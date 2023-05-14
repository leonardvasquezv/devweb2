import { Archivo } from "@core/interfaces/archivo.interface";
import { ObjParam } from "@core/interfaces/base/objParam.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { createAction, props } from "@ngrx/store";

export enum ArchivoActionTypes {
  CleanArchivosList = "[Archivos] Clean Archivos List",

  LoadArchivos = "[Archivos] Load Archivos",
  LoadArchivosSuccess = "[Archivos] Load Archivos Success",
  LoadArchivosError = "[Archivos] Load Archivos Error",

  EUpdateArchivo = "[Archivo] Update Archivo",
  EUpdateArchivoSuccess = "[Archivo] Update Archivo Success",
  EUpdateArchivoError = "[Archivo] Update Archivo Error",
}

// General
export const CleanArchivosList = createAction(
  ArchivoActionTypes.CleanArchivosList
);

export const LoadArchivos = createAction(
  ArchivoActionTypes.LoadArchivos,
  props<{ criterios: Array<ObjParam> }>()
);

export const LoadArchivosSuccess = createAction(
  ArchivoActionTypes.LoadArchivosSuccess,
  props<{ payload: ResponseWebApi }>()
);

export const LoadArchivosError = createAction(
  ArchivoActionTypes.LoadArchivosError,
  props<{ payload: any }>()
);

export const updateArchivo = createAction(
  ArchivoActionTypes.EUpdateArchivo,
  props<{ archivo: Archivo }>()
);

export const updateArchivoSuccess = createAction(
  ArchivoActionTypes.EUpdateArchivoSuccess,
  props<{ payload: ResponseWebApi }>()
);

export const updateArchivoError = createAction(
  ArchivoActionTypes.EUpdateArchivoError,
  props<{ payload: any }>()
);
