export class ConciliacionMinorista {
    id = 0;
    periodo = '';
    idMayorista = 0;
    codigoSicomMayorista = '';
    nombreMayorista = '';
    codigoSicomMinorista = '';
    nombreMinorista = '';
    galonesSicom = 0;
    recaudoSicom = 0;
    galonesMayorista = 0;
    recaudoMayorista = 0;
    diferenciaVolumen = 0;
    diferenciaRecaudo = 0;
    clasificacion = '';
    comentariosSicom = '';
    comentariosMayorista = '';
    estadoConciliacion = '';
    fechaCreacion: Date = null;
    creadoPor = 0;
    fechaModificacion: Date = null;
    modificadoPor = 0;
    fechaAnulacion: Date = null;
    anuladoPor = 0;
    estadoRegistro = '';
    observacionEstado = '';
}