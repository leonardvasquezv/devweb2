import { Alerta } from './Alerta.interface';
import { Plantilla } from './plantilla.interface';

/**
 * Interfaz que define la estructura de un archivo de un archivo
 */
export interface Archivo{
    idDocumento?: number;
    archivo?: string;
    nombreArchivo?: string;
    fechaVencimiento?: Date;
    idDiaNotificacion?: number;
    idPeriodicidadNotificacion?: number;
    alertas?: Array<Alerta>;
    resultadosEvaluacion?: any;
    activo?: boolean;
    estadoRegistro?: string;
    plantilla?: Array<Plantilla>;
    validarPlantilla: boolean;
}
