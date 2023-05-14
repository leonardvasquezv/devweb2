import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { EPermisosEnum } from "@core/enum/permisos.enum";
import { Permiso } from "@core/interfaces/seguridad/permiso.interface";
import { SeguridadModel } from "@core/model/seguridad.model";
import { AuthUtils } from "@core/utils/auth-utils";
import { PermisosUtils } from "@core/utils/permisos-utils";
import { Pagina } from "@shared/models/database/pagina.model";
import { UtilsService } from "@shared/services/utils.service";
import { SimpleCrypt } from "ngx-simple-crypt";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivateChild {
  public globalNext: ActivatedRouteSnapshot;
  public globalState: RouterStateSnapshot;
  public arrayPaginasExcluidas: Array<string>;
  public paginaNext: Pagina;
  public simpleCrypt: SimpleCrypt;
  public idPagina: number;


  /**
   * Método donde se inyectan las dependencias
   * @param router Permite acceder a las funcionalidades de Router
   * @param jwtHelper Permite acceder al servicio JwtHelper
   * @param _utilsService Permite acceder a el servicio de utils
   * @param _seguridadModel Permite acceder al modelo de seguridad
   */
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private _utilsService: UtilsService,
    private _seguridadModel: SeguridadModel,
  ) {
    this.arrayPaginasExcluidas = [
    ];
    this.simpleCrypt = new SimpleCrypt();
  }

  /**
     * Metodo encargado de obtener si una pagina tiene permisos de activacion
     * @param next siguiente pagina a la actual
     * @param state estado de la pagina actual
     * @returns un boolean que define si tiene permiso o no
     */
  public async canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.globalState = state;
    this.globalNext = next;
    this.idPagina = PermisosUtils.ObtenerPagina();
    return this.checkLogin().then(res => {
      if(!!res){
        return res ? true : false;
      }else {
        return true;
      }
    }).catch(err => {
      return false;
    });
  }

  /**
   * Metodo encargado de obtener si se encuentra autenticado en el sistema
   * @returns un boolean que responde si un usuario se encuentra autenticado o no
   */
  public async checkLogin(): Promise<boolean> {
    const token = AuthUtils.getUserToken();
    const getUser = {};
    const tokenExp = !this.jwtHelper.isTokenExpired(token);
    if (getUser && tokenExp) {
      const excluye = this.arrayPaginasExcluidas.findIndex(item => item === this.globalState.url);
      if (excluye > -1) {
        return true;
      } else {
        this.validarPermisos().then(e => {
          if(e) {
            return true;
          }else {
            this.router.navigate(['error/401']);
            return false;
          }
        })
      }
    } else {
      this._seguridadModel.cerrarSesion();
      return false;
    }
  }

  /**
   * Metodo encargado de validar los permisos de las paginas
   * @returns booleano que define si tiene permisos o no
   */
  public async validarPermisos(): Promise<boolean> {
    const arrayPaginas = await this._utilsService.getMenu();
    if(arrayPaginas.length > 0) {
      this.paginaNext = this.buscarPagina(arrayPaginas);
      if (this.paginaNext === undefined || !this.idPagina) {
        return false;
      } else {
        return true;
      }
    }else {
      return true;
    }
    }

  /**
   * Metodo encargado de buscar parginas
   * @param arrayPaginas arraglo que contienetodas las paginas
   * @returns la pagina a buscar
   */
  public buscarPagina(arrayPaginas: any): Pagina {
    let pagina: Pagina;
    let encontrada = false;
    arrayPaginas.forEach(item => {
      if (!encontrada) {
        if (this.validarPermisosPorRuta(item.permisos) && this.globalState.url.includes(item.urlPagina)) {
          pagina = item;
        } else if (item.hijos && item.hijos.length > 0) {
          pagina = item.hijos.find(subPagina => subPagina.id === this.idPagina && this.validarPermisosPorRuta(subPagina.permisos) && this.globalState.url.includes(subPagina.urlPagina));
        }
      }
      if (pagina !== undefined) {
        if (pagina.id !== 0) {
          encontrada = true;
        }
      }
    });
    return pagina;
  }

  /**
   * Metodo usado para obtener los permisos por ruta
   * @param arrayPermisos array de los permisos de la pagina
   * @returns boolean para identificar si existe el permiso
   */
  public validarPermisosPorRuta(arrayPermisos: Permiso[]): boolean {
    let estado = false;
    arrayPermisos.forEach(element => {
      this.validarRuta();
      if(element.id == this.validarRuta()) {
        estado = true;
      }
    })
    return estado;
  }

  /**
   * Metodo usado para devolver el id del permiso
   * @returns number
   */
  public validarRuta(): number {
    let idPermiso: number = 0;
    const buscarPermiso = (caseItem) => {
      if (this.globalState.url.includes(caseItem)) {
        return this.globalState.url;
      }
    };
    switch (this.globalState.url) {
      case buscarPermiso('crear'):
        idPermiso = EPermisosEnum.crear;
        break;
      case buscarPermiso('editar'):
        idPermiso = EPermisosEnum.editar;
        break;
      case buscarPermiso('consultar'):
      idPermiso = EPermisosEnum.consultar;
        break;
      default:
        idPermiso = EPermisosEnum.leer;
        break;
    }
    return idPermiso;
  }

  /**
   * Metodo para saber si el usuario se encuentra autenticado
   * @returns observable de booleano para saber si esta o no está autenticado
   */
  public isAuthenticated(): Observable<boolean> {
    const localToken = localStorage.getItem('Authorization');
    const helper = new JwtHelperService();
    return !localToken ? of(false) : of(!helper.isTokenExpired(localToken));
  }

}
