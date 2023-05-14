import { createSelector } from "@ngrx/store";
import { AppState } from "../app.interface";



export const getTiposParametrizacion = (state: AppState) => 
    state.tipoParametrizacion.entities


export const getTiposParametrizacionIds = (state: AppState) => 
    state.tipoParametrizacion.ids




export const getTiposParametrizacionEntities = createSelector(
    getTiposParametrizacion,
    getTiposParametrizacionIds,
    (tiposParametrizacion) => tiposParametrizacion    
)

export const getAllTiposParametrizacion = createSelector(
    getTiposParametrizacionEntities,
    (entities) => {
        return Object.values(entities)
    }
)
