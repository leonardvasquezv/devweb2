export class AdministradorEstacionServicio {
    id = 0;
    idTipoDocumento = 1;
    idEstacionServicio = 0;
    numeroDocumento = '';
    nombreContacto = '';
    correoElectronico = '';
    telefono = '';
    celular = '';
    fechaCreacion: Date = null;
    creadoPor = 0;
    fechaModificacion: Date = null;
    modificadoPor = 0;
    fechaAnulacion: Date = null;
    anuladoPor = 0;
    estadoRegistro = 'A';
    observacionEstado = '';
}