import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { CrearEds } from '@core/interfaces/crear-eds.interface';
// import { GeneralUtils } from '@core/utils/general-utils';

import * as crearEdsActions from '../actions/crear-eds.actions';

/**
 * Interfaz que maneja los estado de los totales de los medios de pago por turnos de HO
 */
export interface CrearEdsState extends EntityState<CrearEds> {
  ids: Array<number>;
  selectedCrearEdsId: number;
  loading: boolean;
  loaded: boolean;
}

/**
 * Inicializacón del estado de la informacion de la eds a crear
 */
export const defaultState: CrearEdsState = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,
  selectedCrearEdsId: 0,
};

/**
 * Creacion de adaptador para obtener el estado de la informacion de la eds a crear
 */
const infoEdsAdapter: EntityAdapter<CrearEds> = createEntityAdapter<CrearEds>({
  selectId: (infoEds) => infoEds.idEds,
});

/**
 * Inicializacion del estado de la informacion de la eds a crear
 */
const infoEdsInitialState = infoEdsAdapter.getInitialState(defaultState);

/**
 * Reducer de  la informacion de la eds a crear
 */
export const reducer = createReducer(
  infoEdsInitialState,



  on(crearEdsActions.UpdateInfoCrearEdsSuccess, (state, { infoEds }) => {
    return infoEdsAdapter.updateOne(
      {
        id: infoEds.idEds,
        changes: infoEds,
      },
      state
    );
  }),

  on(crearEdsActions.cleanCrearEdsList, (state) =>
    infoEdsAdapter.removeAll(state)
  )
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de  la informacion de la eds a crear
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function CrearEdsReducer(
  state: (EntityState<CrearEds> & CrearEdsState) | undefined,
  action: Action
) {
  return reducer(state, action);
}
