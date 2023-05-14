import { createAction, props } from '@ngrx/store';
import { ObjLoginUser } from '@shared/models/objLoginUser.model';

/**
 * Enumerable para definir las acciones de la autenticacion
 */
export enum AuthActionsTypes {
    loginUser = '[AUTH] Login User',
    loginUserSuccess = '[AUTH]  LoginSuccess User',
    loginUserError = '[AUTH] Error Login User',
    logoutUser = '[AUTH] Logout User',
    logoutUserSuccess = '[AUTH]  LogoutSuccess User',
    logoutUserError = '[AUTH] Error Logout User',
}

// LOGIN
export const loginUser = createAction(
    AuthActionsTypes.loginUser,
    props<{ login: ObjLoginUser }>()
);
export const loginUserSuccess = createAction(AuthActionsTypes.loginUserSuccess);
export const errorLoginUser = createAction(AuthActionsTypes.loginUserError);


// LOGOUT
export const logoutUser = createAction(AuthActionsTypes.logoutUserSuccess);
export const LogoutUserSuccess = createAction(AuthActionsTypes.logoutUserSuccess);
export const errorLogoutUser = createAction(AuthActionsTypes.loginUserError);
