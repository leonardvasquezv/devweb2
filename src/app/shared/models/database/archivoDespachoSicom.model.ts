export class ArchivoDespachoSicom {
    id = 0;
    nombre = '';
    fecha: Date = null;
    periodo = '';
    cantidadGMC = 0;
    cantidadGME = 0;
    cantidadACPM = 0;
    totalGalones = 0;
    totalRecaudo = 0;
    rutaArchivo = '';
    fechaCreacion: Date = null;
    creadoPor = 0;
    fechaModificacion: Date = null;
    modificadoPor = 0;
    fechaAnulacion: Date = null;
    anuladoPor = 0;
    estadoRegistro = 'A';
    observacionEstado = '';
}