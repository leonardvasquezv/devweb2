export class Empresa {
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
  idTipoIdentificacion = 0;
  identificacion = '';
  indicativoTelefono = 0;
  telefono = '';
  indicativoCelular = 0;
  celular = '';
  idPais = 0;
  idDepartamento = 0;
  idCiudad = 0;
  idBarrio = 0;
  direccion = '';
  codigoPostal = '';

  agregado: boolean;
}
