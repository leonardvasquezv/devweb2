import { ServicioEds } from "./servicioEds.interface";

/**
 * Interface para creacion de la EDS
 */
export interface CrearEds {
  idEds?: number;

  selectedStep?: number;

  formEmpresaAsociadaEDS?: {
    //Datos Empresa Asociada
    idTercero?: number;
    idTipoDeDocumento?: string;
    numeroDocumento?: string;
    nombreRepresentante?: string;
    correoElectronicoRepresentante?: string;
    telefonoRepresentante?: string
  };

  formDatosBasicosEDS: {
    //Datos Basicos
    nombreEds: string;
    numeroNit: number;
    codigoSicom: number;
    idRangoTrabajador: string;
    cantTrabajadoresDirectos: number;
    cantTrabajadoresIndirectos: number;
    telefonoResponsable: string;
    correoElectronicoResponsable?: string;
    depUbicacionEds: number;
    ciudadesUbicacionEds: number;
    direccion: string;
    sectorEconomico: string;
    claseRiesgo: string;
    idMayorista?: number;
    urlLogo?: string,
    archivo?: string,
    nombreLogo?: string
    latitud?: string;
    longitud?: string;
  }

  formConfiguracionEds: {
    //Informacion SG-SST
    fechaEvaluacion?: string;
    responsableEjecucionSGSST: string;
    evaluacionRealizadaPor?: string;
    cargo?: string;
    //Servicios
    servicios: Array<ServicioEds>;
  }

}





