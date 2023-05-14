export class Permiso {
  id = 0;
  fechaCreacion: Date = null;
  creadoPor = 0;
  fechaModificacion: Date = null;
  modificadoPor = 0;
  fechaAnulacion: Date = null;
  anuladoPor = 0;
  estadoRegistro = 'A';
  observacionEstado = '';

  nombre = '';
  descripcion = '';

  // Variable virtuales que no hacen pate del modelo de BD
  idPagina = 0;


  checked: boolean = false;
}
