import { ResultadosEvaluacion } from "@core/interfaces/resultados-evaluacion.interface";
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as resultadoEvaluacionActions from '../actions/resultadoEvaluacion.actions';

export interface ResultadoEvaluacionState extends EntityState<ResultadosEvaluacion>{
    ids: Array<any>;
    selectedResultadoEvaluacionid: number;
    loading: boolean;
    loaded: boolean;
    error: string;
    metadata: any;
}

/**
 * Inicialización del estado de Resultados de Evaluación
 */
export const defaultEstado: ResultadoEvaluacionState = {
    ids: [],
    entities: {},
    selectedResultadoEvaluacionid: 0,
    loading: false,
    loaded: false,
    error: "",
    metadata: null,
}

/**
 * Creación del adapter para obtener los métodos que serán utilizados en el reducer
 */
export const ResultadoEvaluacionAdapter: EntityAdapter<ResultadosEvaluacion> = createEntityAdapter<ResultadosEvaluacion>({
    selectId: (resultadoEvaluacion) => resultadoEvaluacion.idArchivo
})

/**
 * Inicialización del estado de Resultado Evaluación
 */
export const estadosInitialState = ResultadoEvaluacionAdapter.getInitialState(defaultEstado);

/**
 * Reducer de Resultado Evaluación
 */
export const reducer = createReducer(
    estadosInitialState,
    on(resultadoEvaluacionActions.LoadResultadoEvaluacion,(state, { idArchivo }) => ({
        ...state,
        entities: {},
        loading: true,
        loaded: false,
        error: "",
        metadata: idArchivo,
    })),
    on(resultadoEvaluacionActions.LoadResultadoEvaluacionSuccess, (state, {payload}) => {
        return ResultadoEvaluacionAdapter.addMany(payload.data,{
            ...state,
            loading: false,
            loaded: true,
            entities: {},
            ids: [],
            metadata: payload.meta,
        })
    }),
    on(resultadoEvaluacionActions.LoadResultadoEvaluacionError, (state, { payload }) => ({
        ...state,
        entities: {},
        loading: false,
        loaded: false,
        error: payload,
    })),
    on(resultadoEvaluacionActions.UpdateResultadoEvaluacionSuccess,
        (state, { payload }) => {
            return ResultadoEvaluacionAdapter.updateOne(
                {
                    id: payload.idArchivo,
                    changes: payload
                },
                state
            )

        }
        
    ),
    
    on(resultadoEvaluacionActions.UpdateResultadoEvaluacionError, (state, { payload }) => ({
        ...state,
        error: payload,
    })),
)

/**
 * Funcion reducer encargada de manejar los estados y las acciones de los Resultados de la Evaluación
 * @param state Estado actual
 * @param action Acción a utilizar
 * @returns Nuevo estado
 */
export function ResultadoEvaluacionReducer(
    state: (EntityState<ResultadosEvaluacion> & ResultadoEvaluacionState) | undefined,
    action: Action
){
    return reducer(state,action);
}