export interface Permiso {
    id: number;
    fechaCreacion: Date;
    creadoPor: number;
    fechaModificacion: Date;
    modificadoPor: number;
    fechaAnulacion: Date;
    anuladoPor: number;
    estadoRegistro: string;
    observacionEstado: string;

    nombre: string;
    descripcion: string;
    nomenclatura: string;
    version: number;

    // Atributo virtuales que no hacen pate del modelo de BD
    idPagina: number;
    seleccionado: boolean;
    checked: boolean;
}