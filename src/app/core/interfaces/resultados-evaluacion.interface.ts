import { DatosGraficaResultado } from "./plan-mejoramiento/datosGraficaResultado.interface";
import { ItemPlanMejoramiento } from "./plan-mejoramiento/itemPlanMejoramiento.interface";

/**
 * Interfaz que define los resultados de una evaluación
 */
export interface ResultadosEvaluacion {
    idArchivo: string;
    puntajeEvaluacion?: number;
    itemsPlanMejoramiento?: Array<ItemPlanMejoramiento>
    resultadosEstandar?: DatosGraficaResultado;
    resultadosCiclos?: DatosGraficaResultado;
}