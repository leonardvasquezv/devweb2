import * as Highcharts from 'highcharts/highstock';
import { EClasePuntaje } from '../enum/clasePuntajes.enum';

/**
 * Variables que permiten utlizar la gráfica
 */
const HighchartsMore = require("highcharts/highcharts-more.src");
HighchartsMore(Highcharts);
const HC_solid_gauge = require("highcharts/modules/solid-gauge.src");
HC_solid_gauge(Highcharts);

/**
 * Clase utilizada para definir las configuraciones de la grafica de Indicador de Cumplimiento
 */
export class ConfigGraficaIndicador{

    /**
     * Variable encargada de manejar el porcentaje de la gráfica
     */
    private _porcentaje: number;


    /**
     * Método constructor de la clase
     * @param porcentaje Porcenaje que será mostrado en la gráfica
     * @param titulo Titulo de la gráfica
     */
    constructor(porcentaje: number, titulo: string){
        this._iniciarDatos(porcentaje, titulo);
    }
    
    /**
     * Variable que maneja las opciones de la grafica
     */
    private _chartOptions: Highcharts.Options;

    /**
     * Variable que define el color de la gráfica dependiendo del puntaje obtenido
     */
    private _colorGrafica: string;

    /**
     * Titulo de la gráfica
     */
    private _titulo: string;

    /**
     * Método enecargado de inicializar los datos
     * @param porcentaje Porcentaje que será mostrado en la gráfica
     */
    private _iniciarDatos(porcentaje: number, titulo: string): void{
        this._porcentaje = porcentaje;
        this._colorGrafica = this._obtenerColor(porcentaje);
        this._titulo = titulo;
        this._chartOptions = {
            chart: {
                type: 'solidgauge',
                height: '100%',
                width: 260,
            },

            credits: {
                enabled: false
            },
            
            title: {
                text: this._titulo,
                style: {
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: 'black',
                    fontFamily: 'Montserrat,sans-serif'
                },
                x: -20,
                y: 20
            },
            
            tooltip: {
                enabled: false
            },
            
            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderWidth: 0
                }],
                center: ["45%","55%"]
            },
            
            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: [],
            },
            
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        enabled: true,
                        useHTML: true
                    },
                    linecap: 'round',
                    stickyTracking: false,
                    rounded: true,
                },
            },
            
            series: [{
                name: 'Ejecutado',
                data: [{
                    dataLabels: {
                        verticalAlign: null,
                        y: -30,
                        x: 10,
                        borderColor: 'none',
                        formatter: function(): string {
                            let numero = porcentaje.toString();
                            
                            if(numero.length === 1 || numero.length === 2) numero = EClasePuntaje.caso1;

                            if(numero.length === 3) numero = EClasePuntaje.caso3;
            
                            if(numero.includes('.')) numero = EClasePuntaje.caso2;
                            
                            return `
                                <div class="texto-grafica-indicador texto-grafica-indicador--${numero}">
                                    <h1>${this.point.y}%</h1>
                                    <h3>Ejecutado</h3>
                                </div>
                            `
                        },
                    },
                    color: this._colorGrafica,
                    //@ts-ignore
                    radius: '112%',
                    innerRadius: '88%',
                    y: this._porcentaje,
                }],
            }],

            responsive: {
                rules: [
                    {
                        condition: {
                            callback: () => window.screen.width > 250 && window.screen.width < 600
                        },
                        chartOptions: {
                            chart:{
                                width: 260,
                            },
                            title: {
                                x: 0,
                                y: 20
                            },
                            pane: {
                                center: ["50%","50%"]
                            },
                        }
                    },
                    {
                        condition: {
                            callback: () => window.screen.width >= 600 && window.screen.width < 1024
                        },
                        chartOptions: {
                            chart:{
                                width: 260,
                            },
                            title: {
                                style:{
                                    fontSize: '18px'
                                },
                                x: 0,
                                y: 20
                            },
                            pane: {
                                center: ["50%","50%"]
                            },
                        }
                    },
                    {
                        condition: {
                            callback: () => window.screen.width >= 1024
                        },
                        chartOptions: {
                            chart:{
                                width: 260,
                            },
                            title: {
                                style:{
                                    fontSize: '18px'
                                },
                                x: 0,
                                y: 20
                            },
                            pane: {
                                center: ["50%","50%"]
                            },
                        }
                    },
                ]
            }

        }
    }

    /**
     * Método encargado de devolver las opciones de la gráfica
     * @return Las configuraciones de la gráfica
     */
    public obtenerOpciones(): Highcharts.Options {
        return this._chartOptions;
    }


    /**
     * Método para obtener el color de la gráfica dependiendo del puntaje obtenido
     * @param porcentaje Puntaje obtenido en la evaluación y que define el color de la gráfica
     */
    private _obtenerColor(porcentaje: number): string{
        if(porcentaje < 60){
            return '#F51E1E'
        }else if(porcentaje >= 60 && porcentaje <= 85){
            return '#FACF4C'
        }else{
            return '#3FCD7F'
        }
    }
}
