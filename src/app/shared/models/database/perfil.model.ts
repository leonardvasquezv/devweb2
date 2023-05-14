import { Pagina } from '@shared/models/database/pagina.model';
import { PerfilesPaginasPermisos } from '@shared/models/database/perfilesPaginasPermisos.model';

export class Perfil {
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

    // Propiedades virtuales que no hacen parte del modelo
    paginas: Pagina[] = [];
    checked = false;
    perfilesPaginasPermisos: PerfilesPaginasPermisos[] = [];
}
