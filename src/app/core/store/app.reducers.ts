import { ActionReducerMap } from "@ngrx/store";
import { CrearEdsReducer } from "src/app/views/pages/crear-eds/store/reducers/crear-eds.reducer";
import { documentosReducer } from "src/app/views/pages/gestion-documental/store/reducers/documento.reducer";
import { ResultadoEvaluacionReducer } from "src/app/views/pages/gestion-documental/store/reducers/resultadoEvaluacion.reducer";
import { empresaReducer } from "src/app/views/pages/seguridad/empresas/store/reducers/empresa.reducers";
import { permisoReducer } from "src/app/views/pages/seguridad/permisos/store/reducers/permiso.reducers";
import { usuarioReducer } from "src/app/views/pages/seguridad/usuarios/store/reducers/usuario.reducers";
import { AlertaReducer } from '../../views/pages/gestion-documental/store/reducers/alerta.reducer';
import { ArchivoReducer } from '../../views/pages/gestion-documental/store/reducers/archivo.reducer';
import { procesosReducer } from '../../views/pages/gestion-documental/store/reducers/proceso.reducer';
import { perfilReducer } from '../../views/pages/seguridad/perfiles/store/reducers/perfil.reducers';
import { AppState } from "./app.interface";
import { edsReducer } from "./reducers/eds.reducer";
import { globalReducer } from "./reducers/global.reducer";
import { initReducer } from "./reducers/init.reducer";
import { notificacionReducer } from "./reducers/notificacion.reducer";
import { parametrizacionReducer } from "./reducers/parametrizacion.reducers";
import { seguridadReducer } from "./reducers/seguridad.reducer";
import { tipoParametrizacionReducer } from "./reducers/tipo-parametrizacion.reducer";

export const appReducers: ActionReducerMap<AppState | any> = {
    crearEds: CrearEdsReducer,

    init: initReducer,
    seguridad: seguridadReducer,
    global: globalReducer,
    proceso: procesosReducer,


    tipoParametrizacion: tipoParametrizacionReducer,
    parametrizacion: parametrizacionReducer,
    eds: edsReducer,
    documento: documentosReducer,
    alerta: AlertaReducer,
    archivo: ArchivoReducer,
    resultadoEvaluacion: ResultadoEvaluacionReducer,
    notificacion: notificacionReducer,
    //Seguridad
    perfil: perfilReducer,
    permiso: permisoReducer,
    usuario: usuarioReducer,
    empresa: empresaReducer,
};
