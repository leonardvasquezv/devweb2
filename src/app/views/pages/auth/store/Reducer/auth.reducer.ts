import { Action, createReducer, on } from '@ngrx/store';
import * as authActions from '../actions/auth.actions';
import { EntityState } from '@ngrx/entity';
import { defaultInit } from '@core/store/reducers/init.reducer';

/**
 * Reducer de la auth con sus respectivos cambios de estados
 */
const reducer = createReducer(defaultInit,
  on(authActions.LogoutUserSuccess, (state) => ({
    ...state,
    userIdentity: null
  }))
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de Auth
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function authReducer(state: (EntityState<any>) | undefined | any, action: Action) {
  return reducer(state, action);
}
