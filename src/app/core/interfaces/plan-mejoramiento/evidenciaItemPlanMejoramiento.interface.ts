import { ArchivoEvidencia } from "./archivoEvidencia.interface";

/**
 * Interface que define la estructura de la evidencia para un item en el plan de mejoramiento
 */
export interface EvidenciaItemPlanMejoramiento{
    responsable: string;
    fecha: string;
    recursos?: string;
    archivos?: Array<ArchivoEvidencia>;
}
