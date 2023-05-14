import { FormGroup } from '@angular/forms';
import { User } from '@shared/models/database/usuario.model';
import { ObjPage } from '@shared/models/objPage.model';
import * as cloneDeep from 'lodash/cloneDeep';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Enum } from './enum';

import { DefaultTreeviewI18n, DropdownTreeviewComponent, TreeviewI18n } from 'ngx-treeview';

/**
 * @author acharris
 * @description Definicion de utilidades basicas genericas.
 */
export let Utils = {
    /**
     * @author acharris
     * @description Convierte una fecha en string con el formato especifico
     * @param fecha Objeto tipo fecha o moment que se quiere convertir.
     * @param formato Formato para ser aplicado en la conversión.
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
     * @author acharris
     * @description Valida los tipos de archivos que pueden ser seleccionar para subir
     * @param fileInput Archivo que se quiere subir, sobre el cual se realiza la validación.
     */
    fileExtensionValidation(fileInput: File) {
        if (this.getConfiguracion().ExtensionesArchivos) {
            const extension = this.getConfiguracion().ExtensionesArchivos.toLowerCase();
            const arrayData = fileInput.name.split('.');
            const fileExtension = arrayData[arrayData.length - 1].toLowerCase();
            if (extension.indexOf(fileExtension) !== -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    },
    /**
     * @author acharris
     * @description Permite ordenar un JSONArray con base a un nodo especifico
     * @param jsonArray Array de objetos que desea ser ordenado.
     * @param args Nodo por el cual va a ser ordenado el array.
     * @param tipo Define el tipo de dato del nodo que se desea ordenar.
     * @param desc Define si se quiere ordenar desendentemente por defecto el orden es asendente
     */
    getSortJson: (jsonArray: any[], args: string | number, tipo: string, desc = false) => {
        jsonArray.sort((a: any, b: any) => {
            if (tipo === 'STRING') {
                if (a[args] < b[args]) {
                    return -1;
                } else if (a[args] > b[args]) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (tipo === 'NUMBER') {
                return a[args] - b[args];
            } else if (tipo === 'DATE') {
                a = new Date(a[args]);
                b = new Date(b[args]);
                return a > b ? -1 : a < b ? 1 : 0;
            }
        });
        if (desc) {
            jsonArray = jsonArray.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => b[args] - a[args]);
        }
        return jsonArray;
    },
    getSortJsonV2(data: any[], key: string | number, orden: string) {
        return data.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
            const x = a[key];
            const y = b[key];
            if (orden === 'asc') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }
            if (orden === 'desc') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
    },
    /**
     * Examples
     * objSort(array, 'city') --> sort by city (ascending, case in-sensitive)
     * objSort(array, ['city', true]) --> sort by city (descending, case in-sensitive)
     * objSort(array, 'city', true) --> sort by city then price (ascending, case sensitive)
     * objSort(array, 'city', 'price') --> sort by city then price (both ascending, case in-sensitive)
     * objSort(array, 'city', ['price', true]) --> sort by city (ascending) then price (descending), case in-sensitive)
     */
    getSortJsonV3(argumentos: any[]) {
        const args = argumentos;
        const array = argumentos[0];
        let caseSensitive: boolean;
        let keysLength: number;
        let key: any[];
        let desc: boolean;
        let a: string;
        let b: string;
        let i: number;

        if (typeof argumentos[argumentos.length - 1] === 'boolean') {
            caseSensitive = argumentos[argumentos.length - 1];
            keysLength = argumentos.length - 1;
        } else {
            caseSensitive = false;
            keysLength = argumentos.length;
        }

        return array.sort((obj1: { [x: string]: any; }, obj2: { [x: string]: any; }) => {
            for (i = 1; i < keysLength; i++) {
                key = args[i];
                if (typeof key !== 'string') {
                    desc = key[1];
                    key = key[0];
                    a = obj1[args[i][0]];
                    b = obj2[args[i][0]];
                } else {
                    desc = false;
                    a = obj1[args[i]];
                    b = obj2[args[i]];
                }

                if (caseSensitive === false && typeof a === 'string') {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                }

                if (!desc) {
                    if (a < b) { return -1; }
                    if (a > b) { return 1; }
                } else {
                    if (a > b) { return -1; }
                    if (a < b) { return 1; }
                }
            }
            return 0;
        });
    },
    /**
     * @author acharris
     * @description Retorna el primer dia del mes en curso.
     */
    getFirstDayMonth: () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    /**
     * @author acharris
     * @description Retorna el ultimo dis del mes en curso.
     */
    getLastDayMonth: () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },
    /**
     * @author acharris
     * @description Retorna el primer dia del año en curso.
     */
    getFirstDayYear: () => {
        const date = new Date();
        return new Date(date.getFullYear(), 0, 1);
    },
    /**
     * @author marrieta
     * @description Retorna lista de años desde 1900 hasta el año en curso.
     * @param order Permite ordenar el array ascendente o desendente.
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
     * @author acharris
     * @description Retorna lista de los meses en texto
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
    getLastWeek: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment().subtract(7, 'days');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getLastMonth: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment().subtract(1, 'months');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getLastQuarter: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment().subtract(3, 'months');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getLastSemester: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment().subtract(6, 'months');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getLastYear: () => {
        let rango: { fechaInicial: any; fechaFinal: any; };
        const fechaInicial = moment().subtract(1, 'years');
        const fechaFinal = moment();
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getNextWeek: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment();
        const fechaFinal = moment().add(7, 'days');
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getNextMonth: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment();
        const fechaFinal = moment().add(1, 'months');
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getNextSemester: () => {
        let rango: { fechaInicial: any, fechaFinal: any };
        const fechaInicial = moment();
        const fechaFinal = moment().add(6, 'months');
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getNextYear: () => {
        let rango: { fechaInicial: any; fechaFinal: any; };
        const fechaInicial = moment();
        const fechaFinal = moment().add(1, 'years');
        rango = { fechaInicial, fechaFinal };
        return rango;
    },
    getErrorApi(errors: any) {
        let mensajes = '';
        if (typeof (errors) === 'string') {
            mensajes = errors;
        } else {
            errors.forEach((item: { texto: string; }) => {
                mensajes += item.texto + '<br>';
            });
            mensajes = mensajes.substring(0, mensajes.length - 4);
        }
        return mensajes;
    },
    updatePhotoUserIdentity(url: any) {
        const userIdentity = JSON.parse(localStorage.getItem('userIdentity'));
        if (userIdentity !== 'undefined' && userIdentity !== null) {
            userIdentity.imagen = url;
            localStorage.setItem('userIdentity', JSON.stringify(userIdentity));
        }
    },
    getUserIdentity() {
        const userIdentity = JSON.parse(localStorage.getItem('userIdentity'));
        if (userIdentity !== 'undefined' && userIdentity !== null) {
            return userIdentity;
        } else {
            return new User();
        }
    },
    getUserToken() {
        const userToken = JSON.parse(localStorage.getItem('Authorization'));
        if (userToken !== 'undefined' && userToken !== null) {
            return userToken;
        } else {
            return null;
        }
    },
    getConfiguracion() {
        const config = JSON.parse(localStorage.getItem('configuracion'));
        if (config !== 'undefined' && config !== null) {
            return config;
        } else {
            return {};
        }
    },
    getMenu() {
        const menu = JSON.parse(localStorage.getItem('menu'));
        if (menu !== 'undefined' && menu !== null) {
            return menu;
        } else {
            return {};
        }
    },
    desHabilitarForm(form: FormGroup, emitirEvento: boolean = true) {
        Object.keys(form.controls).forEach((name) => {
            form.controls[name].disable({ emitEvent: emitirEvento });
        });
    },
    habilitarForm(form: FormGroup, emitirEvento: boolean = true) {
        Object.keys(form.controls).forEach((name) => {
            form.controls[name].enable({ emitEvent: emitirEvento });
        });
    },
    dispararValidacionesForm(form: FormGroup) {
        Object.keys(form.controls).forEach((name) => {
            form.controls[name].markAsTouched();
        });
    },
    desHabilitarValidacionesForm(form: FormGroup, input: string = '') {
        if (input === '') {
            Object.keys(form.controls).forEach((name) => {
                form.controls[name].clearValidators();
                form.controls[name].setErrors(null);
            });
        } else {
            form.controls[input].clearValidators();
        }
    },
    getHeaderDefault(idPagina: number) {
        const arrayHeaders = [];
        const header = {
            campo: 'idPagina',
            valor: idPagina
        };
        arrayHeaders.push(header);
        return arrayHeaders;
    },
    getExtensionUrl(url: string) {
        const array = url.split('.');
        const extension = array[(array.length - 1)];
        return extension;
    },
    detectPreviewDoc(url: string, urlGoogleDocView: string) {
        let extension = '';
        if (url !== undefined && url !== null) {
            extension = Utils.getExtensionUrl(url);
        }
        const extDocumentos = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        if (extDocumentos.includes(extension.toLowerCase())) {
            return urlGoogleDocView + url;
        } else {
            return url;
        }
    },
    setPaginacion(pagina: ObjPage) {
        let cantidadPorPag: { campo?: any; valor?: any; };
        let numeroPagina: { campo?: any; valor?: any; };
        const criterios = [];
        cantidadPorPag = {};
        numeroPagina = {};
        cantidadPorPag.campo = 'Size';
        cantidadPorPag.valor = pagina.size;
        numeroPagina.campo = 'PageNumber';
        numeroPagina.valor = pagina.pageNumber + 1;
        criterios.push(cantidadPorPag);
        criterios.push(numeroPagina);
        return criterios;
    },
    padLeft(text: any, padChar: string, size: number): string {
        return (String(padChar).repeat(size) + text).substr((size * -1), size);
    },
    /**
     * @author acharris
     * @description Retorna la seccion de parametros en formato URL para llamar al reporteador
     * @param params Objeto JSON con los valores de cada parametro que se mapea con a ruta.
     */
    urlParamsReport(params: any = {}) {
        let url = '&rs:embed=true&rc:Parameters=false&rc:Format=PDF&rc:Zoom=Page Width';
        Object.keys(params).forEach((name) => {
            if (params[name] !== null && params[name] !== '' && params[name] !== undefined) {
                url += '&' + name + '=' + params[name];
            }
        });
        return url;
    },
    /**
     * @author lmacias
     * @description Retorna el tiempo de animación para el scroll
     */
    timeAnimations: () => {
        const time = 700;
        return time;
    },
    validarObjetoVacio(object: any) {
        if (Object.entries(object).length === 0) {
            return true;
        } else {
            return false;
        }
    },
    getTimeZoneNumber(fecha: Date) {
        const dateString = fecha.toString();
        return +dateString.split(' ')[5].split('GMT')[1].substr(0, 3);
    },
    cloneObject(object: any) {
        return cloneDeep(object);
    },
    trasformRelativeDate(fecha: Date) {
        return moment.utc(fecha).local().fromNow();
    },
    detectMinCurrency(precision: number, base = 1) {
        let valor = '0';
        for (let index = 0; index < precision; index++) {
            if (index === 0) {
                valor = valor + '.';
            } else {
                valor = valor + '0';
            }
        }
        valor = valor + base;
        return Number(valor);
    },
    asignarAuditoria(objeto: any, tipo: string) {
        let newObject: any = {};
        // TODO: Acharris - Caturar el id del usuario logueado.
        let userIdentity = Utils.getUserIdentity();
        if (tipo === Enum.tipoAuditoria.guardar) {
            objeto.fechaCreacion = new Date();
            objeto.creadoPor = 99;
        } else if (tipo === Enum.tipoAuditoria.editar) {
            objeto.fechaModificacion = new Date();
            objeto.modificadoPor = 99;
        } else if (tipo === Enum.tipoAuditoria.anular) {
            objeto.fechaAnulacion = new Date();
            objeto.anuladoPor = 99;
        }
        newObject = Utils.cloneObject(objeto);
        return newObject;
    },
    /**
     * Procesa los errores y los muestra en pantalla como notificacion
     * @param error Objeto del error que se esta enviando
     * @param tipo Determina que tipo de mensaje se quiere mostrar.
     */
    procesarErrorWebApi(error: any, tipo: string) {
        let mensaje = '';
        let tipoIcono;
        let iconColor = '';
        let colorBackgroud = '';
        switch (typeof (error)) {
            case 'string': {
                mensaje = error;
                switch (tipo) {
                    case Enum.tipoError.correcto:
                        tipoIcono = 'assets/images/svg/check-circle-success.svg';
                        iconColor = 'green';
                        colorBackgroud = '#FFFFFF';
                        break;
                    case Enum.tipoError.advertencia:
                        tipoIcono = 'assets/images/svg/alert.svg';
                        iconColor = 'red';
                        colorBackgroud = '#FFFFFF';
                        break;
                    case Enum.tipoError.error:
                        tipoIcono = 'assets/images/svg/alert.svg';
                        iconColor = 'yellow';
                        colorBackgroud = '#FFFFFF';
                        break;
                    case Enum.tipoError.info:
                        tipoIcono = 'assets/images/svg/info.svg';
                        iconColor = 'blue';
                        colorBackgroud = '#FFFFFF';
                        break;
                }
                break;
            }
            case 'object': {
                if (error.status) {
                    switch (error.status) {
                        case 401: {
                            mensaje = 'Su sesion expiro o inicio sesión en otro PC, favor validar.';
                            tipoIcono = 'assets/images/svg/info.svg';
                            iconColor = 'blue';
                            localStorage.clear();
                            this.router.navigate(['/']);
                            break;
                        }
                        case 405: {
                            mensaje = 'No tienes permisos.';
                            tipoIcono = 'assets/images/svg/info.svg';
                            iconColor = 'blue';
                            // TODO: Acharris - Implementar el logout
                            // this.apiConsumer.logout();
                            break;
                        }
                        case 404: {
                            mensaje = 'Recurso [' + error.url + '] no encontrado.';
                            tipoIcono = 'assets/images/svg/info.svg';
                            iconColor = 'blue';
                            break;
                        }
                        case 500: {
                            mensaje = error.error.message;
                            tipoIcono = 'assets/images/svg/alert.svg';
                            iconColor = 'red';
                            break;
                        }
                        default:
                            mensaje = error.message;
                            tipoIcono = 'assets/images/svg/alert.svg';
                            iconColor = 'red';
                            break;
                    }
                } else {
                    if (error.length > 0) {
                        error.forEach(element => {
                            mensaje += element.texto + '<br>';
                        });
                    }
                }
                break;
            }
            default:
                break;
        }
        Swal.fire({
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            background: colorBackgroud,
            imageUrl: tipoIcono,
            iconColor: iconColor,
            text: mensaje,
            customClass: {
                popup: 'cw-swal-confirmation'
            }
        });

    },
    /**
     * Método para normalizar string y remover caracteres especiales
     * @param str String a normalizar
     * @returns String normalizado
     */
    normalizeString(str: String) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
};

export const getTreeViewTextsConfig = [DropdownTreeviewComponent, {
    provide: TreeviewI18n, useValue: Object.assign(new DefaultTreeviewI18n(), {
        getFilterPlaceholder(): string {
            return 'Buscar';
        },
        getAllCheckboxText(): string {
            return 'your custom placeholder';
        },
        getFilterNoItemsFoundText(): string {
            return 'No se encontraron resultados';
        },
    }),
}];
