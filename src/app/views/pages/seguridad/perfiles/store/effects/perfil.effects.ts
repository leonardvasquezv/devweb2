import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { SeguridadService } from '@core/services/seguridad.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PerfilService } from '../../services/perfil.service';
import * as PerfilActions from '../actions/perfil.actions';

@Injectable()
export class PerfilEffects {

    /**
     * Define el metodo constructor de los efectos
     * @param _actions$ define las acciones del perfil
     * @param _perfilService define los servicios del perfil
     * @param _router inyeccion de dependecia para instanciar y obtener todas las configuraciones de _router
     * @param _initModel modelo de init
     */
    constructor(
        private _actions$: Actions,
        private _perfilService: PerfilService,
        private _router: Router,
        private _utils: UtilsService,
        private _seguridadService: SeguridadService,
    ) { }

    /**
     * Efecto encargado de llamar servicio de crear perfil
     */
    createPerfil$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PerfilActions.createPerfil),
            mergeMap(({ payload }) => this._perfilService.crearPerfil(payload)
                .pipe(
                    map((res: any) => {
                        let payload = {};
                        let errorType = ETiposError.error;
                        if (res.status) {
                            this._router.navigate(['home/seguridad/perfiles']);
                            payload = { ...res.data };
                            errorType = ETiposError.correcto;
                        }
                        this._utils.procesarMessageWebApi(res.message, errorType);
                        return PerfilActions.updatePerfilSuccess({ payload });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PerfilActions.createPerfilError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de llamar servicio de editar perfil
     */
    updatePerfil$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PerfilActions.updatePerfil),
            mergeMap(({ payload }) => this._perfilService.editarPerfil(payload)
                .pipe(
                    map((res: any) => {
                        let payload = { id: 0 };
                        let errorType = ETiposError.error;
                        if (res.status) {
                            //TODO: Integrar cuando el LogIn este implementado
                            this._router.navigate(['home/seguridad/perfiles']);
                            payload = { ...res, id: payload.id };
                            errorType = ETiposError.correcto;
                        }
                        this._utils.procesarMessageWebApi(res.message, errorType);
                        return PerfilActions.updatePerfilSuccess({ payload });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PerfilActions.updatePerfilError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de cargar todos los Perfil
     */
    loadPerfiles$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PerfilActions.loadPerfiles),
            mergeMap(({ criterios }) => this._seguridadService.obtenerPerfiles(criterios)
                .pipe(
                    map((res: ResponseWebApi) => {
                        if (!res.status) {
                            this._utils.procesarMessageWebApi(res.message, ETiposError.error);
                        }
                        return PerfilActions.loadPerfilesSuccess({ payload: res });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PerfilActions.loadPerfilesError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de cargar un perfil por Id en especifico
     */
    loadPerfil$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PerfilActions.loadPerfil),
            mergeMap(({ id }) => this._perfilService.obtenerPerfilPorId(id)
                .pipe(
                    map((res) => {
                        if (!res.status) {
                            this._utils.procesarMessageWebApi(res.message, ETiposError.error);
                        }
                        return PerfilActions.loadPerfilSuccess({ perfil: res.data })
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PerfilActions.loadPerfilError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de cargar un historial de un perfil por Id en especifico
     */
    loadPerfilHistorial$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PerfilActions.loadPerfilHistorial),
            mergeMap((action) => this._perfilService.obtenerPerfilPorIdHistorial(action.id)
                .pipe(
                    map((res: ResponseWebApi) => {
                        if (!res.status) {
                            this._utils.procesarMessageWebApi(res.message, ETiposError.error);
                        }
                        return PerfilActions.loadPerfilSuccess({ perfil: res.data })
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PerfilActions.loadPerfilHistorialError({ payload: err }))
                    })
                )
            )
        )
    );


    /**
     * Efecto encargado de activar un perfil por Id en especifico
     */
    activarPerfil$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PerfilActions.activarPerfil),
            mergeMap(({ payload }) => this._perfilService.activarPerfil(payload)
                .pipe(
                    map((res) => {
                        const errorType = res.status ? ETiposError.correcto : ETiposError.error;
                        this._utils.procesarMessageWebApi(res.message, errorType);
                        return PerfilActions.activarPerfilSuccess({ payload: res.data });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PerfilActions.activarPerfilError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de inactivar un perfil por Id en especifico
     */
    inactivarPerfil$: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PerfilActions.inactivarPerfil),
            mergeMap(({ payload }) => this._perfilService.inactivarPerfil(payload)
                .pipe(
                    map((res) => {
                        const errorType = res.status ? ETiposError.correcto : ETiposError.error;
                        this._utils.procesarMessageWebApi(res.message, errorType);
                        return PerfilActions.inactivarPerfilSuccess({ payload: res.data });
                    }),
                    catchError(err => {
                        this._utils.procesarMessageWebApi(err.error, ETiposError.error);
                        return of(PerfilActions.inactivarPerfilError({ payload: err }))
                    })
                )
            )
        )
    );

    /**
     * Efecto encargado de cargar los perfiles por usuarios
     */
    loadPerfilePorUsuario: Observable<Action> = createEffect(
        (): any => this._actions$.pipe(
            ofType(PerfilActions.loadUsuariosActivosPerfil),
            mergeMap(() => this._perfilService.obtenerPerfilesPorGrupo()
                .pipe(
                    map(({ data }: ResponseWebApi) => PerfilActions.loadUsuarioActivosPerfilSuccess({ payload: data })),
                    catchError(err => of(PerfilActions.loadUsuarioActivosPerfilError({ payload: err })))
                )
            )
        )
    );


}
