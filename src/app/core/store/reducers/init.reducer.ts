import { ObjLoginUser } from '@shared/models/objLoginUser.model';
import { Action, createReducer, on } from '@ngrx/store';
import { MenuItem } from 'src/app/views/layout/sidebar/menu.model';
import { LogoutUserSuccess } from 'src/app/views/pages/auth/store/actions/auth.actions';
import * as initActions from '../actions/init.action';

/**
 * Interfaz que maneja los estado de los inits
 */
export interface InitState {
  menus: Array<MenuItem>;
  userIdentity: ObjLoginUser;
}

/**
 * Inicializacion de las propiedades del estado del init
 */
export const defaultInit: InitState = {
  menus: [],
  userIdentity: null
}

/**
 * Reducer del init con sus respectivos cambios de estados
 */
const reducer = createReducer(defaultInit,
  on(initActions.loadLoginsSuccess, (state, { payload }) => (
    {
      ...state,
      menus: payload[0].data,
      userIdentity: payload[1].data,
    }
  )),
  on(initActions.loadLoginsError, (state, { payload }) => ({ ...state, error: payload })),
  on(LogoutUserSuccess, (state) => ({
    ...state,
    userIdentity: null
  })),
  on(initActions.updateUserIdentitySuccess, (state, { payload }) => (
    {
      ...state,
      userIdentity: payload.data,
    }
  )),
  on(initActions.updateUserIdentityError, (state, { payload }) => ({ ...state, error: payload })),
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de Init
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function initReducer(state: any, action: Action) {
  return reducer(state, action);
}
