import { AppState } from "@core/store/app.interface";
import { createSelector } from "@ngrx/store";

export const NotificacionSeleccionada = (state: AppState) =>
    state.notificacion.notificacionSeleccionada;

export const getNotificacionSeleccionada = createSelector(
    NotificacionSeleccionada,
    (notificacion) => notificacion
)