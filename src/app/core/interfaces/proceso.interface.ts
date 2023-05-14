
/**
 * Interface para definir data necesaria de modal de crear proceso
 */
export interface Proceso {
    idProceso?: number;
    codigo: string;
    nombre: string;
    estadoRegistro: string;
    idPerfil?: number;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
    tieneTipos?: boolean;
    requiereRangoTrabajadores?: boolean;
    checked?: boolean;
}
