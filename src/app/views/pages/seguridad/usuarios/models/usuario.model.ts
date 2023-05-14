import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { Usuario } from '@core/interfaces/seguridad/usuario.interface';
import { AppState } from '@core/store/app.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as moduleActions from '../store/actions/usuario.actions';
import { getAllUsuarios, getMetadataUsuarios, getSelectedUsuario } from '../store/selectors/usuario.selectors';
import { UsuarioService } from '../services/usuario.service';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';

@Injectable()
export class UsuarioModel {

    /**
     * Define el observable de los usuarios consumidos
     */
    public usuarios$: Observable<any> = this._store.select(getAllUsuarios);

    /**
     * Define el observable de la metadata de los usuarios
     */
    public metadata$: Observable<any> = this._store.select(getMetadataUsuarios);

    /**
     * Define el observable del usuario seleccionado
     */
    public usuario$: Observable<any> = this._store.select(getSelectedUsuario);

    /**
     * Metodo constructor del modelo de usuario, encargado de inyectar dependencias
     * @param store accede a los metodos y configuraciones del store
     * @param usuarioService accede a los metodos de UsuarioService
     */
    constructor(private _store: Store<AppState>, 
                private usuarioService :UsuarioService) { }

    /**
     * Metodo encarcado de accionar el store para crear un nuevo usuario
     * @param payload usuario que se desea crear
     */
    public create(payload: Usuario): void {
        this._store.dispatch(moduleActions.createUsuario({ payload }));
    }

    /**
     * Metodo encagado de accionar el store para actualizar un usuario existente
     * @param payload usuario que se desea editar
     */
    public update(payload: Usuario): void {
        this._store.dispatch(moduleActions.updateUsuario({ payload }));
    }

    /**
     * Metodo encagado de accionar el store para obtener los usuarios por criterios en especifico
     * @param criterios del usuario
     */
    public getAllUsuarios(criterios: Array<ObjParam> = []): void {
        this._store.dispatch(moduleActions.cleanUsuarioList());
        this._store.dispatch(moduleActions.loadUsuarios({ criterios }));
    }

    /**
     * Metodo encagado de accionar el store para obtener un usuario por un Id en especifico
     * @param id del usuario seleccionado
     */
    public selected(id: number): void {
        this._store.dispatch(moduleActions.loadUsuario({ id }));
    }

    /**
     * Metodo encargado de accionar el store para activar un usuario
     */
    public activarUsuario(payload: Usuario): void {
        this._store.dispatch(moduleActions.activarUsuario({ payload }));
    }

    /**
     * Metodo encargado de accionar el store para inactivar un usuario
     */
    public inactivarUsuario(payload: Usuario): void {
        this._store.dispatch(moduleActions.inactivarUsuario({ payload }));
    }

    /**
     * Método encargado de validar si existe usuario con campo
     * @param campoAValidar Tipo de validación que se requiere hacer 
     * @param criterios campos que se envian para validar 
     * @returns observable con la respuesta de la petición 
     */
    public ValidarExisteUsuarioCampos(campoAValidar:string,criterios: Array<ObjParam>): Observable<ResponseWebApi> {
        return this.usuarioService.validarCamposUsuario(campoAValidar,criterios);
    }

}
