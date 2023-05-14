export interface ITipoClasificación {
    id:                number;
    codigo:            string;
    nombre:            string;
    descripcion:       string;
    fechaCreacion:     string;
    creadoPor:         number;
    fechaModificacion: null;
    modificadoPor:     number;
    fechaAnulacion:    null;
    anuladoPor:        number;
    estadoRegistro:    string;
    observacionEstado: null;
}

export class ITipoClasificación implements ITipoClasificación {
    id:                number;
    codigo:            string;
    nombre:            string;
    descripcion:       string;
    fechaCreacion:     string;
    creadoPor:         number;
    fechaModificacion: null;
    modificadoPor:     number;
    fechaAnulacion:    null;
    anuladoPor:        number;
    estadoRegistro:    string;
    observacionEstado: null;
}
