import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PermisoService } from '../../services/permiso.service';
import * as PermisoActions from '../actions/permiso.actions';

@Injectable()
export class PermisoEffects {

    /**
     * Define el metodo constructor de los efectos
     * @param _actions$ define las acciones del permiso
     * @param _permisoService define los servicios del permiso
     * @param _router inyeccion de dependecia para instanciar y obtener todas las configuraciones de _router
     */
    constructor(
        private _actions$: Actions,
        private _permisoService: PermisoService,
        private _router: Router,
        private _utils: UtilsService,
    ) { }

    /**
     * Efecto encargado de llamar servicio de crear permiso
     */
    createPermiso$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PermisoActions.createPermiso),
            mergeMap(({ payload }) => this._permisoService.crearPermiso(payload)
                .pipe(
                    map((res: any) => {
                        let payload = {};
                        let errorType = ETiposError.error;
                        if (res.status) {
                            this._router.navigate(['home/seguridad/permisos']);
                            payload = { ...res.data };
                            errorType = ETiposError.correcto;
                        }
                        this._utils.procesarMessageWebApi(res.message, errorType);
                        return PermisoActions.updatePermisoSuccess({ payload });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PermisoActions.createPermisoError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de llamar servicio de editar permiso
     */
    updatePermiso$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PermisoActions.updatePermiso),
            mergeMap(({ payload }) => this._permisoService.editarPermiso(payload)
                .pipe(
                    map((res: any) => {
                        let payload = { id: 0 };
                        let errorType = ETiposError.error;
                        if (res.status) {
                            this._router.navigate(['home/seguridad/permisos']);
                            payload = { ...res, id: payload.id };
                            errorType = ETiposError.correcto;
                        }
                        this._utils.procesarMessageWebApi(res.message, errorType);
                        return PermisoActions.updatePermisoSuccess({ payload });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PermisoActions.updatePermisoError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de cargar todos los Permiso
     */
    loadPermisos$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PermisoActions.loadPermisos),
            mergeMap(({ criterios }) => this._permisoService.obtenerPermisos(criterios)
                .pipe(
                    map((res: ResponseWebApi) => {
                        if (!res.status) {
                            this._utils.procesarMessageWebApi(res.message, ETiposError.error);
                        }
                        return PermisoActions.loadPermisosSuccess({ payload: res });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PermisoActions.loadPermisosError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de cargar un permiso por Id en especifico
     */
    loadPermiso$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PermisoActions.loadPermiso),
            mergeMap(({ id }) => this._permisoService.obtenerPermisoPorId(id)
                .pipe(
                    map((res) => {
                        if (!res.status) {
                            this._utils.procesarMessageWebApi(res.message, ETiposError.error);
                        }
                        return PermisoActions.loadPermisoSuccess({ permiso: res.data })
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PermisoActions.loadPermisoError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de activar un permiso por Id en especifico
     */
    activarPermiso$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PermisoActions.activarPermiso),
            mergeMap(({ payload }) => this._permisoService.ActivarPermiso(payload)
                .pipe(
                    map((res) => {
                        const errorType = res.status ? ETiposError.correcto : ETiposError.error;
                        this._utils.procesarMessageWebApi(res.message, errorType);
                        return PermisoActions.activarPermisoSuccess({ payload: res.data });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PermisoActions.activarPermisoError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de inactivar un permiso por Id en especifico
     */
    inactivarPermiso$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PermisoActions.inactivarPermiso),
            mergeMap(({ payload }) => this._permisoService.InactivarPermiso(payload)
                .pipe(
                    map((res) => {
                        const errorType = res.status ? ETiposError.correcto : ETiposError.error;
                        this._utils.procesarMessageWebApi(res.message, errorType);
                        return PermisoActions.inactivarPermisoSuccess({ payload: res.data });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PermisoActions.inactivarPermisoError({ payload: err }))
                    })
                )
            )
        )
    );

}
