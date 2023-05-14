export class Parametro {
    id = 0;
    fechaCreacion: Date = null;
    creadoPor = 0;
    fechaModificacion: Date = null;
    modificadoPor = 0;
    fechaAnulacion: Date = null;
    anuladoPor = 0;
    estadoRegistro = 'A';
    observacionEstado = '';

    nombreParametro = '';
    descripcionParametro = '';
    valorParametro = '';
    esGeneral = false;
}