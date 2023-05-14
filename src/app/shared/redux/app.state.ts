import { ActionReducerMap } from '@ngrx/store';
import { User } from '@shared/models/database/usuario.model';
import { CrearEdsReducer, CrearEdsState } from 'src/app/views/pages/crear-eds/store/reducers/crear-eds.reducer';

export interface AppState {
  userIdentity: User;
  crearEds: CrearEdsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  userIdentity: null,
  crearEds: CrearEdsReducer,
};
