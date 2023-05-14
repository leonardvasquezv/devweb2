import { AppState } from "@core/store/app.interface";
import { createSelector } from "@ngrx/store";

export const getResultadoEvaluacion = (state: AppState) => state.resultadoEvaluacion.entities;
export const getResultadoEvaluacionId = (state: AppState) => state.resultadoEvaluacion.ids;

export const getResultadoEvaluacionEntities = createSelector(
    getResultadoEvaluacion,
    getResultadoEvaluacionId,
    (resultadoEvaluacion) => resultadoEvaluacion
);

export const getAllResultadoEvaluacion = createSelector(
    getResultadoEvaluacion,
    (entities) => {
        return Object.values(entities);
    }
)