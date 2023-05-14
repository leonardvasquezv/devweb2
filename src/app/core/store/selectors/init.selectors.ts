import { AppState } from '@core/store/app.interface';

export const getMenuperfil = (state: AppState) => state.init.menus;
export const getUserIdentity = ({ init }: AppState) => init.userIdentity;
