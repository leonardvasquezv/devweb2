import * as moment from 'moment';

export let DateUtils = {
    /**
     * Método para convertir un fecha de tipo Moment a string
     * @param fecha entrada de fecha  en tipos string | number | moment.Moment | Date | (string | number)[] | moment.MomentInputObject
     * @param formato Formato deseado de salida del string , por defecto MM-DD-YYYY HH:mm:ss
     * @returns retorna un string con la fecha en el formato estipulado
     */
    dateToString: (fecha: moment.MomentInput, formato = 'MM-DD-YYYY HH:mm:ss') => {
        let fechaConver = '';
        if (fecha instanceof Date) {
            fechaConver = moment(fecha).format(formato);
        } else if (fecha instanceof String) {
            fechaConver = moment(fecha.toString()).format(formato);
        } else {
            fechaConver = moment(fecha).format(formato);
        }
        return fechaConver;
    },
    /**
     * Método para convertir de string  a un objeto tipo fecha 
     * @param fecha  string que contenga la fecha a convertir 
     * @param formato formato de fecha en el que ingrese el parametro FECHA
     * @returns retorna un dato tipo date
     */
    stringToDate:(fecha:string,formato='MM-DD-YYYY HH:mm:ss')=>{
        let fechaConver:Date;
            fechaConver = moment(fecha.toString(),formato).toDate()
           return fechaConver;
    },
    /**
     * Método para Obtener el primer día del mes
     * @returns Retorna objeto de tipo Date 
     */
    getFirstDayMonth: () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    /**
     * Método para Obtener el ultimo día del mes
     * @returns Retorna objeto de tipo Date 
     */
    getLastDayMonth: () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },
    /**
     * Método para retornar el primer día del año
     * @returns Retorna objeto de tipo Date 
     */
    getFirstDayYear: () => {
        const date = new Date();
        return new Date(date.getFullYear(), 0, 1);
    },
    /**
     * Método para retornar los años
     * @param order Ordena el array en orden descendente o acendente (Por Defecto) / parametros a insertar 'desc' o 'asc'  
     * @returns Retorna un array de años
     */
    getYears: (order = 'asc') => {
        const date = new Date();
        let yearsCount = new Array();
        const year = date.getFullYear();
        for (let i = 1900; i <= year; i++) {
            yearsCount.push(i);
        }
        if (order === 'desc') {
            yearsCount = yearsCount.sort((n1, n2) => n2 - n1);
        }
        return yearsCount;
    },
    /**
     * Método para retornar los meses
     * @returns  array de meses con estructura {id,Mes}
     */
    getMoths: () => {
        return [
            { id: 1, mes: 'Enero' },
            { id: 2, mes: 'Febrero' },
            { id: 3, mes: 'Marzo' },
            { id: 4, mes: 'Abril' },
            { id: 5, mes: 'Mayo' },
            { id: 6, mes: 'Junio' },
            { id: 7, mes: 'Julio' },
            { id: 8, mes: 'Agosto' },
            { id: 9, mes: 'Septiembre' },
            { id: 10, mes: 'Octubre' },
            { id: 11, mes: 'Noviembre' },
            { id: 12, mes: 'Diciembre' }
        ];
    },
    /**
     * Obtiene el rango de dias de la ultima semana concurrida del tiempo
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getLastWeek: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment().subtract(7, 'days');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el rango de dias del mes transcurrido
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getLastMonth: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment().subtract(1, 'months');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el rango de dias ultimo trimestre transcurrido 
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getLastQuarter: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment().subtract(3, 'months');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el rango de dias ultimo semestre transcurrido
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getLastSemester: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment().subtract(6, 'months');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el rango de dias ultimo año transcurrido
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getLastYear: () => {
        let rango: { fechaInicial: any; fechaFinal: any; };
        const fechaInicial = moment().subtract(1, 'years');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el rango de dias de la proxima semana  a partir de hoy
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getNextWeek: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment();
        const fechaFinal = moment().add(7, 'days');
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el rango de dias del proximo mes a partir de hoy
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getNextMonth: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment();
        const fechaFinal = moment().add(1, 'months');
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el rango de dias del proximo semestre a partir de hoy
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getNextSemester: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment();
        const fechaFinal = moment().add(6, 'months');
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el rango de dias del proximo año a partir de hoy
     * @returns Obtiene objeto donde con estructura { fechaInicial, fechaFinal }  siendo cada dato de tipo moment
     */
    getNextYear: () => {
        let rango: { fechaInicial: any; fechaFinal: any; };
        const fechaInicial = moment();
        const fechaFinal = moment().add(1, 'years');
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    /**
     * Obtiene el numero de la zona horaria
     * @returns retorna un numero 
     */
    getTimeZoneNumber(fecha: Date) {
        const dateString = fecha.toString();
        return +dateString.split(' ')[5].split('GMT')[1].substr(0, 3);
    },
}
