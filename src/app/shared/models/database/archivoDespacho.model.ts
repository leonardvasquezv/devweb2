export class ArchivoDespacho {
    id = 0;
    idMayorista = 0;
    nombreMayorista = '';
    nitMayorista = '';
    codigoSicomMayorista = '';
    nombre = '';
    fecha: Date = null;
    periodo = '';
    cantidadGMC = 0;
    cantidadGME = 0;
    cantidadACPM = 0;
    cantidadTotal = 0;
    montoRecaudado = 0;
    rutaArchivo = '';
    rutaSoporte = '';
    fechaCreacion: Date = null;
    creadoPor = 0;
    fechaModificacion: Date = null;
    modificadoPor = 0;
    fechaAnulacion: Date = null;
    anuladoPor = 0;
    estadoRegistro = 'A';
    observacionEstado = '';
}