import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/app.interface';
import { loginUser } from '../store/actions/auth.actions';
import { ObjLoginUser } from '@shared/models/objLoginUser.model';

@Injectable()
export class AuthModel {

  /**
   * Metodo contructor del modelo de autenticacion
   * @param store encargado de obtener las confguraciones y acceso al manejador de estados de la aplicacion
   * @param authService objeto de inyeccion para los servicios de AuthService
   */
  constructor(
    private store: Store<AppState>
  ) { }

  /**
   * Metodo utilizado para iniciar sesion
   * @param login cuerpo de peticion para iniciar sesion
   */
  public login(login: ObjLoginUser): void {
    this.store.dispatch(loginUser({ login }));
  }

}
