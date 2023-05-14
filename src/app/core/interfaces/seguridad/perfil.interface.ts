import { Pagina } from './pagina.interface';
import { PerfilesPaginasPermisos } from './perfilesPaginasPermisos.interface';
import { Usuario } from './usuario.interface';

export interface Perfil {
  id: number;
  fechaCreacion?: Date;
  creadoPor?: number;
  usuariosActivos?: number,
  usuariosInactivos?: number,
  usuarios?: Array<Usuario>,
  fechaModificacion?: Date;
  modificadoPor?: number;
  fechaAnulacion?: Date;
  anuladoPor?: number;
  estadoRegistro: string;
  observacionEstado?: string;

  nombre: string;
  descripcion?: string;

  // Propiedades virtuales que no hacen parte del modelo
  paginas?: Array<Pagina>;
  checked?: boolean;
  perfilesPaginasPermisos?: Array<PerfilesPaginasPermisos>;
  agregado?: boolean;
  version?: number;

  nuevo?: boolean;
  temporal?: boolean;
  modificado?: boolean;
  perfilModificado?: boolean;
}
