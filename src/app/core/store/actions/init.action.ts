import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { createAction, props } from '@ngrx/store';

export enum InitActionsTypes {

    LoadLogin = '[INIT] Load Login',
    LoadLoginSuccess = '[INIT] Load Login Success',
    LoadLoginError = '[INIT] Load Login Error',

    UpdateUserIdentity = '[GLOBAL] Update UserIdentity',
    UpdateUserIdentitySuccess = '[GLOBAL] Update UserIdentity Success',
    UpdateUserIdentityError = '[GLOBAL] Update UserIdentity Error'
}

export const loadLogins = createAction(InitActionsTypes.LoadLogin);
export const loadLoginsSuccess = createAction(
    InitActionsTypes.LoadLoginSuccess,
    props<{ payload: Array<ResponseWebApi> }>()
);
export const loadLoginsError = createAction(
    InitActionsTypes.LoadLoginError,
    props<{ payload: any }>()
);


export const updateUserIdentity = createAction(InitActionsTypes.UpdateUserIdentity);
export const updateUserIdentitySuccess = createAction(
    InitActionsTypes.UpdateUserIdentitySuccess,
    props<{ payload: ResponseWebApi }>()
);
export const updateUserIdentityError = createAction(
    InitActionsTypes.UpdateUserIdentityError,
    props<{ payload: any }>()
);
