import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
import { AppState } from '@core/store/app.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PerfilService } from '../services/perfil.service';
import * as perfilActions from '../store/actions/perfil.actions';
import { getAllPerfiles, getMetadataPerfiles, getPerfilesGrupo, getSelectedPerfil } from '../store/selectors/perfil.selectors';

@Injectable()
export class PerfilModel {

    /**
     * Define el observable de los perfiles consumidos
     */
    public perfiles$: Observable<any> = this._store.select(getAllPerfiles);

    /**
     * Define el observable de la metadata de los perfiles
     */
    public metadata$: Observable<any> = this._store.select(getMetadataPerfiles);

    /**
     * Define el observable del perfil seleccionado
     */
    public perfil$: Observable<any> = this._store.select(getSelectedPerfil);

    /**
     * Define el observable del array de los perfiles seleccionados
     */
    public perfilesGrupo$: Observable<any> = this._store.select(getPerfilesGrupo);


    /**
     * Metodo constructor del modelo de perfil, encargado de inyectar dependencias
     * @param store accede a los metodos y configuraciones del store
     */
    constructor(private _store: Store<AppState>, private _perfilService: PerfilService) { }

    /**
     * Metodo encarcado de accionar el store para crear un nuevo perfil
     * @param payload perfil que se desea crear
     */
    public create(payload: Perfil): void {
        this._store.dispatch(perfilActions.createPerfil({ payload }));
    }

    /**
     * Metodo encagado de accionar el store para actualizar un perfil existente
     * @param payload perfil que se desea editar
     */
    public update(payload: Perfil): void {
        this._store.dispatch(perfilActions.updatePerfil({ payload }));
    }

    /**
     * Metodo encagado de accionar el store para obtener los perfiles por criterios en especifico
     * @param criterios del perfil
     */
    public getAllPerfiles(criterios: Array<ObjParam> = []): void {
        this._store.dispatch(perfilActions.cleanPerfilList());
        this._store.dispatch(perfilActions.loadPerfiles({ criterios }));
    }

    /**
     * Metodo encagado de accionar el store para obtener un perfil por un Id en especifico
     * @param id del perfil seleccionado
     */
    public selected(id: number): void {
        this._store.dispatch(perfilActions.loadPerfil({ id }));
    }

    /**
     * Metodo encagado de accionar el store para obtener un historial de la perfil por una Id en especifico
     * @param id del perfil seleccionado
     */
    public selectedHistorial(id: number): void {
        this._store.dispatch(perfilActions.loadPerfilHistorial({ id }));
    }

    /**
     * Metodo encargado de accionar el store para activar un perfil
     */
    public activarPerfil(payload: Perfil): void {
        this._store.dispatch(perfilActions.activarPerfil({ payload }));
    }

    /**
     * Metodo encargado de accionar el store para inactivar un perfil
     */
    public inactivarPerfil(payload: Perfil): void {
        this._store.dispatch(perfilActions.inactivarPerfil({ payload }));
    }

    /**
     * Metodo encargado de accionar el store para obtener perfiles por grupo
     */
    public obtenerPerfilesGrupo(): void {
        this._store.dispatch(perfilActions.loadUsuariosActivosPerfil());
    }

    /**
     * Metodo encargado de accionar el store para obtener perfiles por grupo
     */
    public obtenerMenuPagina(): Observable<ResponseWebApi> {
        return this._perfilService.obtenerMenuPaginas();
    }

}