import { CamposAuditoria } from '../base/camporsAuditoria.interface';

/**
 * Define la interfaz de la empresa
 */
export interface Empresa extends CamposAuditoria {
    id?: number;
    nombre?: string;
    idTipoIdenticacion?: number;
    identificacion?: string;
    codigoSicom?: string;

    //Informacion de contacto
    contactoEmpresa?: {
        idTercero?: number,
        nombreCompleto?: string;
        idTipoDocumento?: number;
        numeroDocumento?: string;
        correoElectronico?: string;
        indicativoTelefono?: number;
        telefono?: string;
        indicativoCelular?: number;
        celular?: string;
        idPais?: number;
        idDepartamento?: number;
        idMunicipio?: number;
        direccion?: string;
    }
    checked?: boolean;
}
