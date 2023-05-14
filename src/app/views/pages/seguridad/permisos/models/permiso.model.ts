import { Injectable } from '@angular/core';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { Permiso } from '@core/interfaces/seguridad/permiso.interface';
import { AppState } from '@core/store/app.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as permisoActions from '../store/actions/permiso.actions';
import { getAllPermisos, getMetadataPermisos, getSelectedPermiso } from '../store/selectors/permiso.selector';

@Injectable()
export class PermisoModel {

    /**
     * Define el observable de los permisos consumidos
     */
    public permisos$: Observable<any> = this._store.select(getAllPermisos);

    /**
     * Define el observable de la metadata de los permisos
     */
    public metadata$: Observable<any> = this._store.select(getMetadataPermisos);

    /**
     * Define el observable del permiso seleccionado
     */
    public permiso$: Observable<any> = this._store.select(getSelectedPermiso);

    /**
     * Metodo constructor del modelo de permiso, encargado de inyectar dependencias
     * @param store accede a los metodos y configuraciones del store
     */
    constructor(private _store: Store<AppState>) { }

    /**
     * Metodo encarcado de accionar el store para crear un nuevo permiso
     * @param payload permiso que se desea crear
     */
    public create(payload: Permiso): void {
        this._store.dispatch(permisoActions.createPermiso({ payload }));
    }

    /**
     * Metodo encagado de accionar el store para actualizar un permiso existente
     * @param payload permiso que se desea editar
     */
    public update(payload: Permiso): void {
        this._store.dispatch(permisoActions.updatePermiso({ payload }));
    }

    /**
     * Metodo encagado de accionar el store para obtener los permisos por criterios en especifico
     * @param criterios del permiso
     */
    public getAllPermisos(criterios: Array<ObjParam> = []): void {
        this._store.dispatch(permisoActions.cleanPermisoList());
        this._store.dispatch(permisoActions.loadPermisos({ criterios }));
    }

    /**
     * Metodo encagado de accionar el store para obtener un permiso por un Id en especifico
     * @param id del permiso seleccionado
     */
    public selected(id: number): void {
        this._store.dispatch(permisoActions.loadPermiso({ id }));
    }

    /**
     * Metodo encargado de accionar el store para activar un permiso
     */
    public activarPermiso(payload: Permiso): void {
        this._store.dispatch(permisoActions.activarPermiso({ payload }));
    }

    /**
     * Metodo encargado de accionar el store para inactivar un permiso
     */
    public inactivarPermiso(payload: Permiso): void {
        this._store.dispatch(permisoActions.inactivarPermiso({ payload }));
    }

}