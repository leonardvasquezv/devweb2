import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Permiso } from '@core/interfaces/seguridad/permiso.interface';
import { createAction, props } from '@ngrx/store';

export enum PermisosActionsTypes {
    LoadPermisos = '[PERMISO] Load Permisos',
    LoadPermisosSuccess = '[PERMISO] Load Permisos Success',
    LoadPermisosError = '[PERMISO] Load Permisos Error',
    LoadPermiso = '[PERMISO] Load Permiso',
    LoadPermisoSuccess = '[PERMISO] Load Permiso Success',
    LoadPermisoError = '[PERMISO] Load Permiso Error',
    CreatePermiso = '[PERMISO] Create Permiso',
    CreatePermisoSuccess = '[PERMISO] Create Permiso Success',
    CreatePermisoError = '[PERMISO] Create Permiso Error',
    UpdatePermiso = '[PERMISO] Update Permiso',
    UpdatePermisoSuccess = '[PERMISO] Update Permiso Success',
    UpdatePermisoError = '[PERMISO] Update Permiso Error',
    DeletePermiso = '[PERMISO] Delete Permiso',
    DeletePermisoSuccess = '[PERMISO] Delete Permiso Success',
    DeletePermisoError = '[PERMISO] Delete Permiso Error',
    ActivarPermiso = '[PERMISO] Activar Permiso',
    ActivarPermisoSuccess = '[PERMISO] Activar Permiso Success',
    ActivarPermisoError = '[PERMISO] Activar Permiso Error',
    InactivarPermiso = '[PERMISO] Inactivar Permiso',
    InactivarPermisoSuccess = '[PERMISO] Inactivar Permiso Success',
    InactivarPermisoError = '[PERMISO] Inactivar Permiso Error',
    CleanPermisoList = '[PERMISO] Clean Permiso List'
}

// General
export const cleanPermisoList = createAction(PermisosActionsTypes.CleanPermisoList);

// Create
export const createPermiso = createAction(
    PermisosActionsTypes.CreatePermiso,
    props<{ payload: Permiso }>()
);

export const createPermisoSuccess = createAction(
    PermisosActionsTypes.CreatePermisoSuccess,
    props<{ payload: Permiso }>()
);

export const createPermisoError = createAction(
    PermisosActionsTypes.CreatePermisoError,
    props<{ payload: any }>()
);


// Update
export const updatePermiso = createAction(
    PermisosActionsTypes.UpdatePermiso,
    props<{ payload: Permiso }>()
);

export const updatePermisoSuccess = createAction(
    PermisosActionsTypes.UpdatePermisoSuccess,
    props<{ payload: any }>()
);

export const updatePermisoError = createAction(
    PermisosActionsTypes.UpdatePermisoError,
    props<{ payload: any }>()
);

// All
export const loadPermisos = createAction(
    PermisosActionsTypes.LoadPermisos,
    props<{ criterios: Array<ObjParam> }>())
    ;

export const loadPermisosSuccess = createAction(
    PermisosActionsTypes.LoadPermisosSuccess,
    props<{ payload: ResponseWebApi }>()
);

export const loadPermisosError = createAction(
    PermisosActionsTypes.LoadPermisosError,
    props<{ payload: any }>()
);


// byId
export const loadPermiso = createAction(
    PermisosActionsTypes.LoadPermiso,
    props<{ id: number }>()
);

export const loadPermisoSuccess = createAction(
    PermisosActionsTypes.LoadPermisoSuccess,
    props<{ permiso: Permiso }>()
);

export const loadPermisoError = createAction(
    PermisosActionsTypes.LoadPermisoError,
    props<{ payload: any }>()
);

// activar
export const activarPermiso = createAction(
    PermisosActionsTypes.ActivarPermiso,
    props<{ payload: any }>()
);

export const activarPermisoSuccess = createAction(
    PermisosActionsTypes.ActivarPermisoSuccess,
    props<{ payload: any }>()
);

export const activarPermisoError = createAction(
    PermisosActionsTypes.ActivarPermisoError,
    props<{ payload: any }>()
);

// inactivar
export const inactivarPermiso = createAction(
    PermisosActionsTypes.InactivarPermiso,
    props<{ payload: any }>()
);

export const inactivarPermisoSuccess = createAction(
    PermisosActionsTypes.InactivarPermisoSuccess,
    props<{ payload: any }>()
);

export const inactivarPermisoError = createAction(
    PermisosActionsTypes.InactivarPermisoError,
    props<{ payload: any }>()
);


