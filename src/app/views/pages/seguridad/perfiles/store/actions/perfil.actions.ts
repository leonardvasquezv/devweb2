
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { PerfilesPorGrupo } from '@core/interfaces/seguridad/perfilesPorGrupo.interface';
import { createAction, props } from '@ngrx/store';

export enum PerfilActionsTypes {
    LoadPerfiles = '[PERFIL] Load Perfiles',
    LoadPerfilesSuccess = '[PERFIL] Load Perfiles Success',
    LoadPerfilesError = '[PERFIL] Load Perfiles Error',
    LoadPerfil = '[PERFIL] Load Perfil',
    LoadPerfilSuccess = '[PERFIL] Load Perfil Success',
    LoadPerfilError = '[PERFIL] Load Perfil Error',
    CreatePerfil = '[PERFIL] Create Perfil',
    CreatePerfilSuccess = '[PERFIL] Create Perfil Success',
    CreatePerfilError = '[PERFIL] Create Perfil Error',
    UpdatePerfil = '[PERFIL] Update Perfil',
    UpdatePerfilSuccess = '[PERFIL] Update Perfil Success',
    UpdatePerfilError = '[PERFIL] Update Perfil Error',
    DeletePerfil = '[PERFIL] Delete Perfil',
    DeletePerfilSuccess = '[PERFIL] Delete Perfil Success',
    DeletePerfilError = '[PERFIL] Delete Perfil Error',
    ActivarPerfil = '[PERFIL] Activar Perfil',
    ActivarPerfilSuccess = '[PERFIL] Activar Perfil Success',
    ActivarPerfilError = '[PERFIL] Activar Perfil Error',
    InactivarPerfil = '[PERFIL] Inactivar Perfil',
    InactivarPerfilSuccess = '[PERFIL] Inactivar Perfil Success',
    InactivarPerfilError = '[PERFIL] Inactivar Perfil Error',
    LoadPerfilHistorial = '[PERFIL] Load Perfil Historial',
    LoadPerfilHistorialSuccess = '[PERFIL] Load Perfil Historial Success',
    LoadPerfilHistorialError = '[PERFIL] Load Perfil Historial Error',
    CleanPerfilList = '[PERFIL] Clean Perfil List',
    LoadUsuariosActivosPerfil = '[PERFIL] Load Usuarios Activos Perfil',
    LoadUsuariosActivosPerfilSuccess = '[PERFIL] Load Usuarios Activos Perfil Success',
    LoadUsuariosActivosPerfilError = '[PERFIL] Load Usuarios Activos Perfil Error',
}

// General
export const cleanPerfilList = createAction(PerfilActionsTypes.CleanPerfilList);

// Create
export const createPerfil = createAction(
    PerfilActionsTypes.CreatePerfil,
    props<{ payload: Perfil }>()
);

export const createPerfilSuccess = createAction(
    PerfilActionsTypes.CreatePerfilSuccess,
    props<{ payload: Perfil }>()
);

export const createPerfilError = createAction(
    PerfilActionsTypes.CreatePerfilError,
    props<{ payload: any }>()
);


// Update
export const updatePerfil = createAction(
    PerfilActionsTypes.UpdatePerfil,
    props<{ payload: Perfil }>()
);

export const updatePerfilSuccess = createAction(
    PerfilActionsTypes.UpdatePerfilSuccess,
    props<{ payload: any }>()
);

export const updatePerfilError = createAction(
    PerfilActionsTypes.UpdatePerfilError,
    props<{ payload: any }>()
);

// All
export const loadPerfiles = createAction(
    PerfilActionsTypes.LoadPerfiles,
    props<{ criterios: Array<ObjParam> }>())
    ;

export const loadPerfilesSuccess = createAction(
    PerfilActionsTypes.LoadPerfilesSuccess,
    props<{ payload: ResponseWebApi }>()
);

export const loadPerfilesError = createAction(
    PerfilActionsTypes.LoadPerfilesError,
    props<{ payload: any }>()
);


// One
export const loadPerfil = createAction(
    PerfilActionsTypes.LoadPerfil,
    props<{ id: number }>()
);

export const loadPerfilSuccess = createAction(
    PerfilActionsTypes.LoadPerfilSuccess,
    props<{ perfil: Perfil }>()
);

export const loadPerfilError = createAction(
    PerfilActionsTypes.LoadPerfilError,
    props<{ payload: any }>()
);

// Historial
export const loadPerfilHistorial = createAction(
    PerfilActionsTypes.LoadPerfilHistorial,
    props<{ id: number }>()
);

export const loadPerfilHistorialSuccess = createAction(
    PerfilActionsTypes.LoadPerfilHistorialSuccess,
    props<{ perfil: Perfil }>()
);

export const loadPerfilHistorialError = createAction(
    PerfilActionsTypes.LoadPerfilHistorialError,
    props<{ payload: any }>()
);

// activar
export const activarPerfil = createAction(
    PerfilActionsTypes.ActivarPerfil,
    props<{ payload: any }>()
);

export const activarPerfilSuccess = createAction(
    PerfilActionsTypes.ActivarPerfilSuccess,
    props<{ payload: any }>()
);

export const activarPerfilError = createAction(
    PerfilActionsTypes.ActivarPerfilError,
    props<{ payload: any }>()
);

// inactivar
export const inactivarPerfil = createAction(
    PerfilActionsTypes.InactivarPerfil,
    props<{ payload: any }>()
);

export const inactivarPerfilSuccess = createAction(
    PerfilActionsTypes.InactivarPerfilSuccess,
    props<{ payload: any }>()
);

export const inactivarPerfilError = createAction(
    PerfilActionsTypes.InactivarPerfilError,
    props<{ payload: any }>()
);

// Perfiles por usuario
export const loadUsuariosActivosPerfil = createAction(PerfilActionsTypes.LoadUsuariosActivosPerfil);

export const loadUsuarioActivosPerfilSuccess = createAction(
    PerfilActionsTypes.LoadUsuariosActivosPerfilSuccess,
    props<{ payload: Array<PerfilesPorGrupo> }>()
);

export const loadUsuarioActivosPerfilError = createAction(
    PerfilActionsTypes.LoadUsuariosActivosPerfilError,
    props<{ payload: any }>()
);

