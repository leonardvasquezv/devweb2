import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeguridadModel } from '@core/model/seguridad.model';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { PermisosUtils } from '../utils/permisos-utils';

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  /**
   * Atributo que define el comportamiento del Spinner
   */
  private count = 0;

  constructor(
    private _loading: LoadingService,
    private _seguridadModel: SeguridadModel
  ) { }

  /**
   * Metodo interceptor de peticiones http
   * @param request
   * @param next
   * @returns
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authorization: string | null = this.getUserToken();
    const idPagina: string | null = PermisosUtils.ObtenerPagina() + "";

    if (authorization) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${authorization}` } });
    }

    if (idPagina) {
      request = request.clone({ setHeaders: { idPagina: `${idPagina}` } });
    }

    this._loading.setLoading(true, request.url);

    // header del spinner de la peticion
    if (!request.url.includes('assets')) {
      request = request.clone({ setHeaders: { spinner: 'S' } });
      if (request.headers.get('spinner') === 'S') {
        this._loading.show();
        this.count++;
      }
    }

    return next.handle(request)
      .pipe(
        map<HttpEvent<any>, any>((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this._loading.setLoading(false, request.url);
          }
          return event;
        }),
        finalize(() => {
          if (request.headers.get('spinner') === 'S') {
            this.count--;
          }
          if (this.count === 0) {
            this._loading.hide();
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status == 0 || error.status >= 500 && error.status <= 599) {
            //this._utils.procesarNotificacion("Se ha producido un error en el servidor, Por favor intente más tarde.",ETiposError.error)
          }
          if ([401, 403, 405].includes(error.status)) {
            localStorage.removeItem('Authorization');
            if (!!authorization)
              this._seguridadModel.cerrarSesion();
          }
          this._loading.setLoading(false, request.url);

          this.handleError(error);
          return throwError(error);
        })
      );

  }

  /**
   * Metodo encargado de manejar errores del retorno del interceptor
   * @param error
   * @returns
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';

    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(errorMessage);
  }

  /**
   * Metodo utilizado para obtener el token del usuario
   * @returns una cadena
   */
  getUserToken(): string {
    const userToken = JSON.parse(localStorage.getItem('Authorization'));

    // @ts-ignore
    if (userToken !== 'undefined' && userToken !== null) {
      return userToken;
    } else {
      return null;
    }
  }

}
