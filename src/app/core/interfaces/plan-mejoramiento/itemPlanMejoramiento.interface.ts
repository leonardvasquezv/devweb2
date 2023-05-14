import { EvidenciaItemPlanMejoramiento } from "./evidenciaItemPlanMejoramiento.interface";

/**
 * Interface que define la estructura de un item del plan de mejoramiento de un archivo
 */
export interface ItemPlanMejoramiento{
    idCriterio?: number;
    descripcionCriterio?: string;
    actividad?: string;
    item?: string;
    numeral?: string;
    puntajeEsperado?: number;
    puntajeObtenido?: number;
    cumplimiento?: string;
    evidencias?: EvidenciaItemPlanMejoramiento;
}