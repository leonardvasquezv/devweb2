import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { ResultadosEvaluacion } from '@core/interfaces/resultados-evaluacion.interface';
import { createAction, props } from '@ngrx/store';

export enum ResultadoEvaluacionTypes{
    ECleanResultadoEvaluacion = "[ResultadoEvaluacion] Clean Resultado Evaluacion",

    ELoadResultadoEvaluacion = '[ResultadoEvaluacion] Load Resultado Evaluacion',
    ELoadResultadoEvaluacionSuccess = '[ResultadoEvaluacion] Load Resultado Evaluacion Success',
    ELoadResultadoEvaluacionError = '[ResultadoEvaluacion] Load Resultado Evaluacion Error',

    EUpdateResultadoEvaluacion = '[ResultadoEvaluacion] Update Resultado Evaluacion',
    EUpdateResultadoEvaluacionSuccess = '[ResultadoEvaluacion] Update Resultado Evaluacion Success',
    EUpdateResultadoEvaluacionError = '[ResultadoEvaluacion] Update Resultado Evaluacion Error',

}

//Acciones Generales
export const LoadResultadoEvaluacion = createAction(
    ResultadoEvaluacionTypes.ELoadResultadoEvaluacion,
    props<{idArchivo: string}>()
)

export const LoadResultadoEvaluacionSuccess = createAction(
    ResultadoEvaluacionTypes.ELoadResultadoEvaluacionSuccess,
    props<{payload: ResponseWebApi}>()
)

export const LoadResultadoEvaluacionError = createAction(
    ResultadoEvaluacionTypes.ELoadResultadoEvaluacionError,
    props<{payload: any}>()
)

export const UpdateResultadoEvaluacion = createAction(
    ResultadoEvaluacionTypes.EUpdateResultadoEvaluacion,
    props<{payload: ResultadosEvaluacion}>()
)

export const UpdateResultadoEvaluacionSuccess = createAction(
    ResultadoEvaluacionTypes.EUpdateResultadoEvaluacionSuccess,
    props<{payload: any}>()
)

export const UpdateResultadoEvaluacionError = createAction(
    ResultadoEvaluacionTypes.EUpdateResultadoEvaluacionError,
    props<{payload: any}>()
)