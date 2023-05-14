import { createAction, props } from "@ngrx/store";
import { Notificacion } from '../../interfaces/base/notificacion.interface';

export enum NotificacionActionTypes {
    ESeleccionNotificacion = "[Notificacion] Selecionar Notificacion",
    ECleanSeleccionNotificacion = "[Notificacion] Clean Selecionar Notificacion"
}

export const SeleccionarNotificacion = createAction(
    NotificacionActionTypes.ESeleccionNotificacion,
    props<{ notificacion: Notificacion }>()
);

export const CleanSeleccionNotificacion = createAction(
    NotificacionActionTypes.ECleanSeleccionNotificacion,
);
