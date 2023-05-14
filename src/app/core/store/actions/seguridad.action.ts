import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { createAction, props } from '@ngrx/store';

export enum SeguridadActionsTypes {

    logoutUser = '[SEGURIDAD] Logout User',
    logoutUserSuccess = '[SEGURIDAD]  LogoutSuccess User',
    logoutUserError = '[SEGURIDAD] Error Logout User',

    generarCodigo = '[SEGURIDAD] Generar codigo',
    generarCodigoSuccess = '[SEGURIDAD] Generar codigo Success',
    generarCodigoError = '[SEGURIDAD] Generar codigo Error',

    validarCodigo = '[SEGURIDAD] Validar codigo',
    validarCodigoSuccess = '[SEGURIDAD] Validar codigo Success',
    validarCodigoError = '[SEGURIDAD] Validar codigo Error',

}

// LOGOUT
export const logoutUser = createAction(SeguridadActionsTypes.logoutUser);
export const LogoutUserSuccess = createAction(SeguridadActionsTypes.logoutUserSuccess);
export const errorLogoutUser = createAction(SeguridadActionsTypes.logoutUserError);

// GENERAR CODIGO
export const generarCodigo = createAction(
    SeguridadActionsTypes.generarCodigo,
    props<{ body: any }>()
);

export const generarCodigoSuccess = createAction(
    SeguridadActionsTypes.generarCodigoSuccess,
    props<{ response: ResponseWebApi }>()
);

export const generarCodigoError = createAction(
    SeguridadActionsTypes.generarCodigoError,
    props<{ payload: ResponseWebApi }>()
);


// VALIDAR CODIGO
export const validarCodigo = createAction(
    SeguridadActionsTypes.validarCodigo,
    props<{ body: any }>()
);

export const validarCodigoSuccess = createAction(
    SeguridadActionsTypes.validarCodigoSuccess,
    props<{ response: ResponseWebApi }>()
);

export const validarCodigoError = createAction(
    SeguridadActionsTypes.validarCodigoError,
    props<{ payload: ResponseWebApi }>()
);
