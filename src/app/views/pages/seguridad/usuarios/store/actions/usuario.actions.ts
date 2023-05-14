import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Usuario } from '@core/interfaces/seguridad/usuario.interface';
import { createAction, props } from '@ngrx/store';

export enum UsuarioActionsTypes {
  LoadUsuarios = '[USUARIO] Load Usuarios',
  LoadUsuariosSuccess = '[USUARIO] Load Usuarios Success',
  LoadUsuariosError = '[USUARIO] Load Usuarios Error',
  LoadUsuario = '[USUARIO] Load Usuario',
  LoadUsuarioSuccess = '[USUARIO] Load Usuario Success',
  LoadUsuarioError = '[USUARIO] Load Usuario Error',
  CreateUsuario = '[USUARIO] Create Usuario',
  CreateUsuarioSuccess = '[USUARIO] Create Usuario Success',
  CreateUsuarioError = '[USUARIO] Create Usuario Error',
  UpdateUsuario = '[USUARIO] Update Usuario',
  UpdateUsuarioSuccess = '[USUARIO] Update Usuario Success',
  UpdateUsuarioError = '[USUARIO] Update Usuario Error',
  DeleteUsuario = '[USUARIO] Delete Usuario',
  DeleteUsuarioSuccess = '[USUARIO] Delete Usuario Success',
  DeleteUsuarioError = '[USUARIO] Delete Usuario Error',
  ActivarUsuario = '[USUARIO] Activar Usuario',
  ActivarUsuarioSuccess = '[USUARIO] Activar Usuario Success',
  ActivarUsuarioError = '[USUARIO] Activar Usuario Error',
  InactivarUsuario = '[USUARIO] Inactivar Usuario',
  InactivarUsuarioSuccess = '[USUARIO] Inactivar Usuario Success',
  InactivarUsuarioError = '[USUARIO] Inactivar Usuario Error',
  CleanUsuarioList = '[USUARIO] Clean Usuario List'
}

// General
export const cleanUsuarioList = createAction(UsuarioActionsTypes.CleanUsuarioList);

// Create
export const createUsuario = createAction(
  UsuarioActionsTypes.CreateUsuario,
  props<{ payload: Usuario }>()
);

export const createUsuarioSuccess = createAction(
  UsuarioActionsTypes.CreateUsuarioSuccess,
  props<{ payload: Usuario }>()
);

export const createUsuarioError = createAction(
  UsuarioActionsTypes.CreateUsuarioError,
  props<{ payload: any }>()
);


// Update
export const updateUsuario = createAction(
  UsuarioActionsTypes.UpdateUsuario,
  props<{ payload: Usuario }>()
);

export const updateUsuarioSuccess = createAction(
  UsuarioActionsTypes.UpdateUsuarioSuccess,
  props<{ payload: any }>()
);

export const updateUsuarioError = createAction(
  UsuarioActionsTypes.UpdateUsuarioError,
  props<{ payload: any }>()
);

// All
export const loadUsuarios = createAction(
  UsuarioActionsTypes.LoadUsuarios,
  props<{ criterios: Array<ObjParam> }>())
  ;

export const loadUsuariosSuccess = createAction(
  UsuarioActionsTypes.LoadUsuariosSuccess,
  props<{ payload: ResponseWebApi }>()
);

export const loadUsuariosError = createAction(
  UsuarioActionsTypes.LoadUsuariosError,
  props<{ payload: any }>()
);


// One
export const loadUsuario = createAction(
  UsuarioActionsTypes.LoadUsuario,
  props<{ id: number }>()
);

export const loadUsuarioSuccess = createAction(
  UsuarioActionsTypes.LoadUsuarioSuccess,
  props<{ usuario: Usuario }>()
);

export const loadUsuarioError = createAction(
  UsuarioActionsTypes.LoadUsuarioError,
  props<{ payload: any }>()
);

// activar
export const activarUsuario = createAction(
  UsuarioActionsTypes.ActivarUsuario,
  props<{ payload: any }>()
);

export const activarUsuarioSuccess = createAction(
  UsuarioActionsTypes.ActivarUsuarioSuccess,
  props<{ payload: any }>()
);

export const activarUsuarioError = createAction(
  UsuarioActionsTypes.ActivarUsuarioError,
  props<{ payload: any }>()
);

// inactivar
export const inactivarUsuario = createAction(
  UsuarioActionsTypes.InactivarUsuario,
  props<{ payload: any }>()
);

export const inactivarUsuarioSuccess = createAction(
  UsuarioActionsTypes.InactivarUsuarioSuccess,
  props<{ payload: any }>()
);

export const inactivarUsuarioError = createAction(
  UsuarioActionsTypes.InactivarUsuarioError,
  props<{ payload: any }>()
);


