import { Injectable } from '@angular/core';
import { AppState } from '@core/store/app.interface';
import * as initSelectors from '@core/store/selectors/init.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as initActions from '../store/actions/init.action';

@Injectable()
export class InitModel {

  /**
   * Metodo constructor del modelo de modulo, encargado de inyectar dependencias
   * @param _store accede a los metodos y configuraciones del store
   */
  constructor(private _store: Store<AppState>) { }
  /**
   * Define el observable de los menus de la persona logueada
   */
  public menus$: Observable<any> = this._store.select(initSelectors.getMenuperfil);

  /**
   * Define el observable de la informacion del useridentity
   */
  public userIdentity$: Observable<any> = this._store.select(initSelectors.getUserIdentity);

  /**
   * Metodo encargado de accionar el store para obtener todos los
   * datos iniciales usados en el sistema cuando se inicia sesion
   */
  public obtenerDatosLogin(): void {
    this._store.dispatch(initActions.loadLogins());
  }
  /**
   * Método encargado de actualizar la información del usuario en el aplicativo
   */
  public updateUserIdentity(): void {
    this._store.dispatch(initActions.updateUserIdentity());
  }

}
