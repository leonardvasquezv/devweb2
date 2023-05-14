import { Departamento } from './departamento.interface';
import { Documento } from "./documento.interface";
import { Municipio } from './municipio.interface';
import { ServicioEds } from './servicioEds.interface';

/**
 * Interface para definir datos de la EDS
 */
export interface DataEds {
  agregado?: boolean,
  idEds?: number,
  nombre: string,
  nit: string,
  representanteLegal?: string,
  nombreMayorista?: string;
  estadoRegistro?: string,
  checked?: boolean;
  idCiudad?: number,
  idMunicipio?: number,
  idDepartamento: number,
  ciudadEds?: Municipio,
  departamentoEds?: Departamento,
  direccion: string,
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  mensaje?: string,
  urlLogo?: string,
  archivo?: string,
  nombreLogo?: string,
  telefono?: string | number,
  celular?: number,
  serviciosEds?: Array<ServicioEds>
  distanciaDeUsuario?: number
  documentos?: Array<Documento>;
  idRangoTrabajador?: string;
  departamentoMunicipio?: string;
  latitud?: string;
  longitud?: string;
  codigoSicom?: number;
  cantidadTrabajadoresDirectos?: number;
  cantidadTrabajadoresIndirectos?: number;
  correoElectronico?: string;
  idSectorEconomico?: string;
  idClaseRiesgo?: string;
  responsableEjecucionSST?: string;
  idMayorista?: number;
  representanteLegalObj?: {
    idTercero?: number;
    idTipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    correoElectronico?: string;
    telefono?: string | number,
  },
  nombreRangoTrabajador?: string;
}

