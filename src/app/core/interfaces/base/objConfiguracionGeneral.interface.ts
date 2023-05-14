export interface ObjConfiguracionGeneral {
    colorFooter: string;
    colorHeader: string;
    colorMenu: string;
    currencyLocate: string;
    currencyPrecision: string;
    prefixCurrency: string;
    formatDate?: string;
    formatDateTime?: string;
    formatDateHtml?: string;
    formatDateTimeHtml?: string;
    formatDateReport?: string;
    extensionesArchivos: string;
    maximoTamanoAdjunto: number;
    language?: string;
}

export const defaultObjConfiguracionGeneral = {
    colorFooter : '',
    colorHeader : '',
    colorMenu : '',
    currencyLocate : '',
    currencyPrecision : '',
    prefixCurrency: '',
    formatDate : '',
    formatDateTime : '',
    formatDateHtml : '',
    formatDateTimeHtml : '',
    extensionesArchivos : '',
    maximoTamanoAdjunto : 0,
}
