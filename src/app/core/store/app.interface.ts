import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { CrearEdsState } from "src/app/views/pages/crear-eds/store/reducers/crear-eds.reducer";
import { ArchivoState } from "src/app/views/pages/gestion-documental/store/reducers/archivo.reducer";
import { EmpresaState } from "src/app/views/pages/seguridad/empresas/store/reducers/empresa.reducers";
import { PerfilState } from "src/app/views/pages/seguridad/perfiles/store/reducers/perfil.reducers";
import { PermisoState } from "src/app/views/pages/seguridad/permisos/store/reducers/permiso.reducers";
import { UsuarioState } from "src/app/views/pages/seguridad/usuarios/store/reducers/usuario.reducers";
import { AlertaState } from '../../views/pages/gestion-documental/store/reducers/alerta.reducer';
import { DocumentoState } from '../../views/pages/gestion-documental/store/reducers/documento.reducer';
import { ProcesoState } from '../../views/pages/gestion-documental/store/reducers/proceso.reducer';
import { ResultadoEvaluacionState } from '../../views/pages/gestion-documental/store/reducers/resultadoEvaluacion.reducer';
import { EdsState } from "./reducers/eds.reducer";
import { GlobalState } from "./reducers/global.reducer";
import { InitState } from "./reducers/init.reducer";
import { NotificacionState } from "./reducers/notificacion.reducer";
import { ParametrizacionState } from "./reducers/parametrizacion.reducers";
import { SeguridadState } from "./reducers/seguridad.reducer";
import { TipoParametrizacionState } from "./reducers/tipo-parametrizacion.reducer";


export interface AppState {
  init: InitState;
  seguridad: SeguridadState;
  global: GlobalState;
  menu: Menu;

  usuario: UsuarioState;

  eds: EdsState;
  proceso: ProcesoState;
  documento: DocumentoState;
  crearEds: CrearEdsState;
  meesagesError: ResponseWebApi;
  tipoParametrizacion: TipoParametrizacionState;
  parametrizacion: ParametrizacionState;
  alerta: AlertaState;
  archivo: ArchivoState;
  resultadoEvaluacion: ResultadoEvaluacionState,
  notificacion: NotificacionState

  //Seguridad
  perfil: PerfilState;
  empresa: EmpresaState;
  permiso: PermisoState;
}

/**
 * interface de modulo
 */
export interface Modulo {
  name: string;
  path: string;
  icon: string;
  activo?: boolean;
  children?: Array<Modulo>;
}
/**
 * interface de Menu
 */
export interface Menu {
  modulos: Array<Modulo>;
}

