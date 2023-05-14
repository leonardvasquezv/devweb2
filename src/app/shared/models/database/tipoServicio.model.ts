export class TipoServicio {
    id = 0;
    codigo = '';
    nombre = '';
    descripcion = '';
    fechaCreacion: Date = null;
    creadoPor = 0;
    fechaModificacion: Date = null;
    modificadoPor = 0;
    fechaAnulacion: Date = null;
    anuladoPor = 0;
    estadoRegistro = 'A';
    observacionEstado = '';
}