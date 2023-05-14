import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { DataEds } from '../../interfaces/data-eds.interface';
import * as edsAction from '../actions/eds.action';
/**
 * Interfaz que maneja los estado de las EDS
 */
export interface EdsState extends EntityState<DataEds> {
    ids: Array<any>;
    selectedEdsid: number;
    loading: boolean;
    loaded: boolean;
    error: string;
    metadata: any;
    edsSeleccionada: any;
}

/*
 * Inicialización del estado de las EDS
 */
export const defaultEstado: EdsState = {
    ids: [],
    entities: {},
    selectedEdsid: 0,
    loading: false,
    loaded: false,
    error: '',
    metadata: null,
    edsSeleccionada:null
};
/**
 * Creacion de adaptador para obtener los metodos que serán utilizados en el reducer de las EDS
 */
export const edsAdapter: EntityAdapter<DataEds> =
    createEntityAdapter<DataEds>({
        selectId: (eds) => eds.idEds
    })

/**
* Inicializacion del estado de las EDS
*/
export const estadosInitialState = edsAdapter.getInitialState(defaultEstado);
/**
 * Reducer de las eds
 */
const reducer = createReducer(estadosInitialState,
    on(edsAction.LoadEds,
        (state, { payload }) => ({
            ...state,
            entities: {},
            loading: true,
            loaded: false,
            error: '',
            metadata: payload,
        })
    ),
    on(edsAction.LoadEdsSuccess,
        (state, { payload }) => {
            return edsAdapter.addMany(payload.data, {
                ...state,
                loading: false,
                loaded: true,
                entities: {},
                ids: [],
                selectedEdsid: null,
                metadata: payload.meta,
            });
        }
    ),
    on(edsAction.LoadEdsError,
        (state, { payload }) => ({
            ...state,
            entities: {},
            loading: false,
            loaded: false,
            error: payload,
        })
    ),
    on(edsAction.CleanAllEdsList, (state, { }) =>
        edsAdapter.removeAll(state)
    ),
    on(edsAction.UpdateEstadoEds,
        (state, { payload }) => ({
            ...state,
            loading: true,
            loaded: false,
            error: '',
        })
    ),
    on(edsAction.UpdateEstadoEdsSuccess,
        (state, { payload }) => {
            return edsAdapter.updateOne(
                {
                    id: payload.data.idEds,
                    changes: {
                        estadoRegistro: payload.data.estadoRegistro
                    }
                },
                {
                    ...state,
                    loading: false,
                    loaded: true,
                    metadata: payload.meta,
                }
            );
        }
    ),
    on(edsAction.UpdateEstadoEdsError,
        (state, { payload }) => ({
            ...state,
            entities: {},
            loading: false,
            loaded: false,
            error: payload,
        })
    ),
    on(edsAction.CreateEds,
        (state, { eds }) => {
            return edsAdapter.addOne(eds, {
                ...state,
                loading: false,
                loaded: true,
            });
        }
    ),
    on(edsAction.SeleccionarEds,
        (state, { eds }) => ({
            ...state,
            edsSeleccionada:eds
        })
    ),
    on(edsAction.cleanOneEds,
        (state, { }) => ({
            ...state,
            edsSeleccionada:null
        })
    ),
);

/**
 * Funcion reducer encargada de manejar los estados y las acciones de los totales de las eds
 * @param state estado actual
 * @param action accion a utilizar
 * @returns nuevo estado
 */
export function edsReducer(
    state:
        | (EntityState<DataEds> & EdsState)
        | undefined,
    action: Action
) {
    return reducer(state, action);
}
