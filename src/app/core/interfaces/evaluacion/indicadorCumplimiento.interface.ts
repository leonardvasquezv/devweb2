/**
 * Interfaz encargada de definir la estructura de la gráfica de indicador de cumplimiento
 */

export interface IndicadorCumplimiento{
    idDocumento: number;
    idEvaluacion: number;
    idIndicador: number;
    tituloIndicador: string;
    mensajeInformativo: string;
    puntaje: number;
}