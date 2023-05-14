import { Injectable } from '@angular/core';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { Breadcrumb } from '@core/interfaces/base/breadcrumb.interface';
import { GlobalModel } from '@core/model/global.model';
import { InitModel } from '@core/model/init.model';
import { PermisosUtils } from '@core/utils/permisos-utils';
import { TranslateService } from '@ngx-translate/core';
import { Pagina } from '@shared/models/database/pagina.model';
import { WindowRef } from '@shared/services/windowref';
import { ETiposError } from 'src/app/core/enum/tipo-error.enum';
import { ETipoIcono } from 'src/app/core/enum/tipo-icono.enum';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  /**
   * @param windowRef Referencia a la clase WindowRef
   * @param _initModel Variable que permite utilizar los métodos de la clase Init
   * @param _globalModel Variable que permite utilizar los métodos del servicio global
   * @param _translateService Permite acceder al servicio de traducciones
   */
  constructor(
    private windowRef: WindowRef,
    private _initModel: InitModel,
    private _globalModel: GlobalModel,
    private _translateService: TranslateService
  ) {}

  refreshViewPage() {
    setTimeout(() => {
      this.windowRef.nativeWindow.dispatchEvent(new Event('resize'));
    }, 0);
  }

  /**
   * Procesa los errores y los muestra en pantalla como notificacion
   * @param error Objeto del error que se esta enviando
   * @param tipo Determina que tipo de mensaje se quiere mostrar.
   * @param errCatch define el error obtenido del catch
   * @param timer Define el tiempo en el que se cerrará el modal de alerta
   */
  public procesarMessageWebApi(
    error: any,
    tipo: string,
    errCatch: any = null,
    timer: number = 2000
  ): void {
    let mensaje =
      'Ha ocurrido un error inesperado, por favor intente de nuevo más tarde';
    let tipoIcono = ETipoIcono.error;
    let colorBackgroud = '';
    switch (typeof error) {
      case 'string': {
        mensaje = error;
        switch (tipo) {
          case ETiposError.correcto:
            tipoIcono = ETipoIcono.success;
            colorBackgroud = '#FFFFFF';
            break;
          case ETiposError.advertencia:
            tipoIcono = ETipoIcono.alert;
            colorBackgroud = '#FFFFFF';
            break;
          case ETiposError.error:
            tipoIcono = ETipoIcono.error;
            colorBackgroud = '#FFFFFF';
            break;
          case ETiposError.info:
            tipoIcono = ETipoIcono.info;
            colorBackgroud = '#FFFFFF';
            break;

          case ETiposError.procesando:
            tipoIcono = ETipoIcono.loading;
            colorBackgroud = '#FFFFFF';
            break;
        }
        break;
      }
      case 'object': {
        if (error?.status) {
          switch (error?.status) {
            case 400: {
              const arrayErrores = error?.error?.errors;
              if (arrayErrores) {
                Object.keys(error?.error?.errors).forEach((prop) => {
                  if (arrayErrores[prop].length > 0) {
                    arrayErrores[prop].forEach((element) => {
                      mensaje += element + '<br>';
                    });
                  }
                });
              }
              tipoIcono = ETipoIcono.error;
              break;
            }
            case 404: {
              if (errCatch.name !== 'HttpErrorResponse') {
                mensaje = 'Recurso [' + error?.url + '] no encontrado.';
                tipoIcono = ETipoIcono.info;
              } else {
                mensaje = 'Error de conexion con el WebApi';
                tipoIcono = ETipoIcono.error;
              }
              break;
            }
            case 405: {
              mensaje = error?.error;
              tipoIcono = ETipoIcono.info;
              break;
            }
            case 500: {
              mensaje = error?.error?.message;
              tipoIcono = ETipoIcono.error;
              break;
            }
            default:
              mensaje = error?.message;
              tipoIcono = ETipoIcono.error;
              break;
          }
        } else if (
          (error?.status === 0 && error?.name === 'HttpErrorResponse') ||
          error === null
        ) {
          mensaje = 'Error de conexion con el WebApi';
          tipoIcono = ETipoIcono.error;
        }
        break;
      }
      default:
        break;
    }

    const html = /*inline-html*/ `
      <div class="row bra-10px">
        <div class="col-12 justify-content-center d-flex align-items-center">
          <img src="${tipoIcono}" class="wd-70 ht-70" />
        </div>
        <div class="col-12 cl-white pt-41px">
          <h2 class="mb-2px titleGrisOscuro">${mensaje}</h2>
        </div>
      </div>
        `;

    Swal.fire({
      html: html,
      position: 'center',
      showCancelButton: false,
      showConfirmButton: false,
      padding: '0em',
      background: '#fffff',
      timer: timer,
      heightAuto: true,
      width: '450px',
      customClass: {
        container: 'custom-container',
        popup: 'custom-swal',
        content: 'custom-content',
      },
    });
  }

  /**
   * Método para validar un permiso requerido por proceso
   * @param accion a evaluar
   * @returns booleano si el usuario tiene permiso o no
   */
  public async validarPermisoAccion(accion: string): Promise<boolean> {
    const idPaginaActual = PermisosUtils.ObtenerPagina();
    const pagina = await this.getPaginaPorId(idPaginaActual);
    const permisosPagina = pagina?.permisos;
    if (!!permisosPagina) {
      const permiso = permisosPagina.find(element => element.nombre === accion);
      return !!permiso;
    }
    return false;
  }

  /**
   * Metodo para buscar la informacion de una pagina por id especifico
   * @param id de la para que se desea obtener
   * @returns un objeto pagina
   */
  public async getPaginaPorId(id: number): Promise<Pagina> {
    let pagina: Pagina;
    const arrayPaginas: Pagina[] = await this.getMenu();
    arrayPaginas.forEach(item => {
      if (pagina === undefined) {
        if (item.id === id) {
          pagina = item;
        } else if (item.hijos !== undefined && item.hijos !== null && item.hijos.length !== 0) {
          pagina = this.buscarEnHijosPorId(item.hijos, id);
        }
      }
    });
    return pagina;
  }

  /**
   * Metodo asincrono para buscar las paginas por ruta
   * @param ruta Ruta a buscar
   * @returns Promesa con la pagina solicitada
   */
  public async getPaginaPorRuta(ruta: string): Promise<Pagina> {
    let pagina: Pagina;
    const arrayPaginas: Pagina[] = await this.getMenu();
    arrayPaginas.forEach(item => {
      if (pagina === undefined) {
        if (item.urlPagina.includes(ruta)) {
          pagina = item;
        } else if (item.hijos !== undefined && item.hijos !== null && item.hijos.length !== 0) {
          pagina = this.buscarEnHijosPorRuta(item.hijos, ruta);
        }
      }
    });
    return pagina;
  }

  /**
   * Metodo usado para buscar las paginas por ruta en los hijos
   * @param arrayHijos Array de hijos
   * @param ruta Ruta a buscar
   * @returns Pagina con la información solicitada
   */
  private buscarEnHijosPorRuta(arrayHijos: Array<Pagina>, ruta: string): Pagina {
    let pagina: Pagina;
    arrayHijos.forEach(subPagina => {
      if (pagina === undefined) {
        if (subPagina.urlPagina.includes(ruta)) {
          pagina = subPagina;
        } else if (subPagina.hijos !== undefined && subPagina.hijos !== null && subPagina.hijos.length !== 0) {
          pagina = this.buscarEnHijosPorRuta(subPagina.hijos, ruta);
        }
      }
    });
    return pagina
  }

  /**
   * Funcion recursiva para buscar la pagina a cualquier nivel de profundidad
   * @param arrayHijos Listado de hijos de una pagina.
   * @param id que se esta buscando
   * @returns Returna la informacion de la pagina buscada
   */
  private buscarEnHijosPorId(arrayHijos: Array<Pagina>, id: number): Pagina {
    let pagina: Pagina;
    arrayHijos.forEach(subPagina => {
      if (pagina === undefined) {
        if (subPagina.id === id) {
          pagina = subPagina;
        } else if (subPagina.hijos !== undefined && subPagina.hijos !== null && subPagina.hijos.length !== 0) {
          pagina = this.buscarEnHijosPorId(subPagina.hijos, id);
        }
      }
    });
    return pagina
  }

  /**
 * Procesa los errores y los muestra en pantalla como notificacion
 * @param error Objeto del error que se esta enviando
 * @param tipo Determina que tipo de mensaje se quiere mostrar.
 * @param errCatch define el error obtenido del catch
 * @param mensaje a mostrar en el sweet alert
 * @param timer Define el tiempo en el que se cerrará el modal de alerta
 */
  public procesarMessageWebApiV2(
    mensaje: string = '',
    error: any,
    tipo: string,
    errCatch: any = null,
    timer: number = 2000
  ): Promise<SweetAlertResult<any>> {
    let tipoIcono = ETipoIcono.error;
    let colorBackgroud = '';
    switch (typeof error) {
      case 'string': {
        mensaje = error;
        switch (tipo) {
          case ETiposError.correcto:
            tipoIcono = ETipoIcono.success;
            colorBackgroud = '#FFFFFF';
            break;
          case ETiposError.advertencia:
            tipoIcono = ETipoIcono.alert;
            colorBackgroud = '#FFFFFF';
            break;
          case ETiposError.error:
            tipoIcono = ETipoIcono.error;
            colorBackgroud = '#FFFFFF';
            break;
          case ETiposError.info:
            tipoIcono = ETipoIcono.info;
            colorBackgroud = '#FFFFFF';
            break;

          case ETiposError.procesando:
            tipoIcono = ETipoIcono.loading;
            colorBackgroud = '#FFFFFF';
            break;
        }
        break;
      }
      case 'object': {
        if (error?.status) {
          switch (error?.status) {
            case 400: {
              const arrayErrores = error?.error?.errors;
              if (arrayErrores) {
                Object.keys(error?.error?.errors).forEach((prop) => {
                  if (arrayErrores[prop].length > 0) {
                    arrayErrores[prop].forEach((element) => {
                      mensaje += element + '<br>';
                    });
                  }
                });
              }
              tipoIcono = ETipoIcono.error;
              break;
            }
            case 404: {
              if (errCatch.name !== 'HttpErrorResponse') {
                mensaje = 'Recurso [' + error?.url + '] no encontrado.';
                tipoIcono = ETipoIcono.info;
              } else {
                mensaje = 'Error de conexion con el WebApi';
                tipoIcono = ETipoIcono.error;
              }
              break;
            }
            case 405: {
              mensaje = error?.error;
              tipoIcono = ETipoIcono.info;
              break;
            }
            case 500: {
              mensaje = error?.error?.message;
              tipoIcono = ETipoIcono.error;
              break;
            }
            default:
              mensaje = error?.message;
              tipoIcono = ETipoIcono.error;
              break;
          }
        } else if (
          (error?.status === 0 && error?.name === 'HttpErrorResponse') ||
          error === null
        ) {
          mensaje = 'Error de conexion con el WebApi';
          tipoIcono = ETipoIcono.error;
        }
        break;
      }
      default:
        break;
    }

    const html = /*inline-html*/ `
        <div class="row bra-10px">
          <div class="col-12 justify-content-center d-flex align-items-center">
            <img src="${tipoIcono}" class="wd-70 ht-70" />
          </div>
          <div class="col-12 cl-white pt-41px">
            <h2 class="mb-2px titleGrisOscuro">${mensaje}</h2>
          </div>
        </div>
          `;

    return Swal.fire({
      html: html,
      position: 'center',
      showCancelButton: false,
      showConfirmButton: false,
      padding: '0em',
      background: '#fffff',
      timer: timer,
      heightAuto: true,
      width: '450px',
      customClass: {
        container: 'custom-container',
        popup: 'custom-swal',
        content: 'custom-content',
      },
    });
  }

  /**
 * Metodo para buscar la informacion de una pagina especifica
 * @param url de la para que se desea obtener
 * @returns un objeto pagina
 */
  public async getPaginaUrlWithArray(url: string, arrayPaginas: Pagina[]): Promise<Pagina> {
    let pagina: Pagina;
    arrayPaginas?.forEach(item => {
      if (pagina === undefined) {
        if (item.urlPagina === url) {
          pagina = item;
        } else if (item.hijos !== undefined && item.hijos !== null && item.hijos.length !== 0) {
          pagina = this.buscarEnHijos(item.hijos, url);
        }
      }
    });
    return pagina;
  }

  /**
   * Funcion recursiva para buscar la pagina a cualquier nivel de profundidad
   * @param arrayHijos Listado de hijos de una pagina.
   * @param url Url que se esta buscando
   * @returns Retorna la informacion de la pagina buscada
   */
  private buscarEnHijos(arrayHijos: Array<Pagina>, url: string): Pagina {
    let pagina: Pagina;
    arrayHijos.forEach(subPagina => {
      if (pagina === undefined) {
        if (subPagina.urlPagina === url) {
          pagina = subPagina;
        } else if (subPagina.hijos !== undefined && subPagina.hijos !== null && subPagina.hijos.length !== 0) {
          pagina = this.buscarEnHijos(subPagina.hijos, url);
        }
      }
    });
    return pagina
  }

  /**
   * Metodo para obtener el menu correspondiente al usuario
   * por localstorage
   * @returns Objeto menu
   */
  public getMenu(): Promise<Array<Pagina>> {
    return new Promise((resolve) => this._initModel.menus$.subscribe((response: Array<Pagina>) => resolve(response)));
  }

  /**
  * Método encargado de obtener los padres de una página por su id
  * @param id Id de la página hijo que se desea buscar sus padres
  */
  public async getPaginasPadre(id: number): Promise<Array<Pagina>> {
    let paginasPadre: Array<Pagina> = [];
    const arrayPaginas: Pagina[] = await this.getMenu();
    arrayPaginas.forEach(item => {
      if (item?.hijos?.length !== 0) {
        paginasPadre = [...paginasPadre, ...this.buscarPaginasPadre(item, id)];
      }
    });
    return paginasPadre;
  }

  /**
   * Método encargado de buscar recursivamente los padres de una página
   * @param paginaPadre Objeto página en que se buscará el id hijo
   * @param idPaginaHijo Id de la página hijo que se desea buscar sus padres
   */
  private buscarPaginasPadre(paginaPadre: Pagina, idPaginaHijo: number): Array<Pagina> {
    let paginasPadre: Array<Pagina> = [];
    paginaPadre.hijos?.forEach((subPagina: Pagina) => {
      if (subPagina.idPagina === idPaginaHijo) {
        paginasPadre.push(paginaPadre);
      } else if (subPagina?.hijos?.length !== 0) {
        paginasPadre = [...paginasPadre, ...this.buscarPaginasPadre(subPagina, idPaginaHijo)];
      }
    });
    return paginasPadre
  }

  /**
 * Metodo para buscar la informacion de una pagina especifica
 * @param url de la para que se desea obtener
 * @returns un objeto pagina
 */
  public async getPaginaUrl(url: string): Promise<Pagina> {
    let pagina: Pagina;
    const arrayPaginas: Pagina[] = await this.getMenu();
    arrayPaginas.forEach(item => {
      if (pagina === undefined) {
        if (url.includes(item.urlPagina)) {
          pagina = item;
        } else if (item.hijos !== undefined && item.hijos !== null && item.hijos.length !== 0) {
          pagina = this.buscarEnHijos(item.hijos, url);
        }
      }
    });
    return pagina;
  }

  /**
   * Metodo usado para asignar el titulo del breadcrumb
   * @param tipoOperacion generico para el titulo
   * @param proceso en el que se encuentra
   * @param hasBack identifica si tiene opcion de volver atras
   * @param titleDefault titulo en caso de no utilizar el tipo de operacion
   * @param casoEspecial caso especial para modificar el titulo de la marcha atras
   */
  public setBreadCrumb(tipoOperacion: string = null, proceso: string, hasBack: boolean, titleDefault: string = null, casoEspecial: boolean = false): void{
    const titulos = {
      [ETiposOperacion.crear]: this._translateService.instant("TITULOS.CREAR"),
      [ETiposOperacion.consultar]: this._translateService.instant("BOTONES.CONSULTAR"),
      [ETiposOperacion.editar]: this._translateService.instant("BOTONES.EDITAR"),
    }
    const title: string = (!!tipoOperacion && !!proceso) ? `${titulos[tipoOperacion]} ${proceso}` : titleDefault;
    const breadcrumb: Breadcrumb = { title, hasBack, casoEspecial};
    this._globalModel.setBreadcrumb(breadcrumb);
  }
}
