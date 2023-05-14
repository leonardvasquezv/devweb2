import { ObjConfiguracionGeneral } from "@core/interfaces/base/objConfiguracionGeneral.interface";
import { Utils } from "@shared/global/utils";
import { Pagina } from "@shared/models/database/pagina.model";
import { MenuItem } from "src/app/views/layout/sidebar/menu.model";
import { UserIdentity } from "../interfaces/user-identity.interface";
export let AuthUtils = {

  /**
   * Metodo para obtener el menu correspondiente al usuario
   * por localstorage
   * @returns Objeto menu
   */
  getMenu(): Array<Pagina> {
    const menu = localStorage.getItem('menu');
    if (menu !== 'undefined' && menu !== null) {
      return JSON.parse(localStorage.getItem('menu'));;
    }
  },

  /**
   * Metodo utilizado para obtener la entidad de usuario
   * que se encuentra ubicado en el localstorage
   * @returns un objeto usuari
   */
  getUserIdentity(): UserIdentity {
    const userIdentity: UserIdentity = JSON.parse(localStorage.getItem('userIdentity'));
    return userIdentity;
  },

  setLocalStorage(response, proceso = '') {
    localStorage.setItem('isLoggedin', 'true');

    if (proceso === '') {
      //localStorage.setItem('menu', JSON.stringify(response.data.loginUser.menuPerfilDefault));
      //let userIdentity = response.data.loginUser;
      //delete userIdentity.menuPerfilDefault;
      //localStorage.setItem('userIdentity', JSON.stringify(userIdentity));
    }
    localStorage.setItem('Authorization', JSON.stringify(response.data.token));
    localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
  },


  /**
   * Metodo para buscar la informacion de una pagina especifica
   * @param url de la para que se desea obtener
   * @returns un objeto pagina
   */
  getPaginaUrl(url: string) {
    let paginaResult: Pagina = null;
    const arrayPaginas: Array<Pagina> = this.getMenu();
    arrayPaginas?.forEach(pagina => {
      if (pagina.url == url) {
        paginaResult = pagina;
      } else if (pagina.hijos !== undefined && pagina.hijos !== null && pagina.hijos.length !== 0) {
        pagina.hijos.forEach(subPagina => {
          if (subPagina.url === url) {
            paginaResult = subPagina;
          }
        });
      }
    });
    return paginaResult;
  },

  /**
   * Metodo creado para crear el menu de los hijos de un submenu
   * @param hijos paginas hijas de una pagina padre
   * @returns un array de menu items
   */
  crearMenuHijos(hijos): MenuItem[] {
    const arrayItemMenuHijo: MenuItem[] = [];
    hijos.forEach(itemHijo => {
      const itemMenuHijo: MenuItem = {};
      itemMenuHijo.id = itemHijo.idPagina;
      itemMenuHijo.label = itemHijo.nombre;
      itemMenuHijo.icon = itemHijo.icono;
      itemMenuHijo.link = itemHijo.url;
      itemMenuHijo.expanded = false;
      itemMenuHijo.isTitle = itemHijo.esTitulo
      itemMenuHijo.badge = '';
      itemMenuHijo.parentId = itemHijo.idPaginaPadre;

      if (itemHijo.hijos?.length > 0) {
        const subHijos = this.crearMenuHijos(itemHijo.hijos);
        itemMenuHijo.subItems = subHijos;
      }
      if (itemHijo.verEnMenu === true) {
        arrayItemMenuHijo.push(itemMenuHijo);
      }
    });
    return arrayItemMenuHijo;
  },

  /**
   * Metodo utilizado para crear menu del sidebar
   */
  crearMenu(): Array<MenuItem> {
    // se obtiene el menu del localstorage
    let arrayMenu: Pagina[] = AuthUtils.getMenu();

    const arrayItemMenu: MenuItem[] = [];
    arrayMenu?.forEach(item => {

      const itemMenu: MenuItem = <MenuItem>{};
      itemMenu.id = item.idPagina;
      itemMenu.label = item.nombre;
      itemMenu.icon = item.icono;
      itemMenu.link = item.url;
      itemMenu.expanded = false;
      itemMenu.isTitle = item.esTitulo
      itemMenu.badge = '';
      itemMenu.parentId = item.idPaginaPadre;

      if (item.hijos?.length > 0) {
        const arraySubHijos = AuthUtils.crearMenuHijos(item.hijos);
        itemMenu.subItems = arraySubHijos;
      }
      if (item.verEnMenu === true) {
        arrayItemMenu.push(itemMenu);
      }

    });
    return Utils.cloneObject(arrayItemMenu);
  },

  /**
     * Metodo utilizado para obtener el token del usuario
     * @returns una cadena
     */
  getUserToken(): string {
    const userToken = JSON.parse(localStorage.getItem('Authorization'));
    if (userToken !== 'undefined' && userToken !== null) {
      return userToken;
    } else {
      return null;
    }
  },

  /**
  * metodo utilizado para saber si el usuario se encuentra autenticado
  */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  },

  /**
   * Metodo utilizado para obtener las configuraciones del
   * usuario autenticado, almacenado en el localstorage
   * @returns un objeto de configuracion
   */
  getConfiguracion(): ObjConfiguracionGeneral {
    const config = JSON.parse(localStorage.getItem('configuracion'));
    if (config !== 'undefined' && config !== null) {
      return config;
    } else {
      return null;
    }
  },

}
