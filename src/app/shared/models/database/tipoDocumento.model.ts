export class TipoDocumento{
    id = 0;
    creadoPor = 0;
    modificadoPor = 0;
    anuladoPor = 0;
    fechaModificacion: Date = null;
    fechaCreacion: Date = null;
    fechaAnulacion: Date = null;
    estadoRegistro = 'A';
    observacionEstado = '';
    nombre='';
    descripcion='';
}