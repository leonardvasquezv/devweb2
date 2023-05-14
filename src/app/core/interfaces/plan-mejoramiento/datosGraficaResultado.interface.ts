/**
 * Interfaz que define la estructura de los datos que irán en las gráficas
 */

export interface DatosGraficaResultado{
    secciones: Array<string>;
    resultadosEsperados: Array<number>;
    resultadosObtenido: Array<number>;
}