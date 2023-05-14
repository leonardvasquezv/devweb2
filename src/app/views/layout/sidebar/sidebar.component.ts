import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import MetisMenu from 'metismenujs/dist/metismenujs';
import { Subscription } from 'rxjs';

import { InitModel } from '@core/model/init.model';
import { GeneralUtils } from '@core/utils/general-utils';
import { PermisosUtils } from '@core/utils/permisos-utils';
import { Pagina } from '@shared/models/database/pagina.model';
import { ObjLoginUser } from '@shared/models/objLoginUser.model';
import { UtilsService } from '@shared/services/utils.service';

import { BreakpointObserver } from '@angular/cdk/layout';
import { CrearDocumentoTemporal } from '@core/interfaces/crearDocumento.interface';
import { WindowRef } from '@shared/services/windowref';
import { MenuItem } from './menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * Variable que almacena la al botón toggle del sidebar
   */
  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;

  /**
   * Variable que almacena la referencia al sidebar 
   */
  @ViewChild('sidebarMenu') sidebarMenu: ElementRef;
  /**
   * Variable en la que se almacenan los items del menú
   */
  menuItems = [];
  /**
   * Atributo que captura el id de la pagina en que me encuentro para validar los permisos
   */
  public idPagina: number;
  
  /**
   *  Id de pagina Entrante
   */
  @Input() paginaEntrante:number;
  /**
   * Variable que almacena los estilos del menú
   */
  public styleMenu = '';

  /**
   * Variable que contiene al usuario identificado
   */
  public userIdentity: ObjLoginUser;

  /**
   * Captura el array de los diferentes suscripciones que se realizan en el componente
   */
  private _arraySubcriptors: Array<Subscription> = [];
  /**
   * Lo utilizamos para evaluar la logica de mostrar el logo completo o solamente el icono en el sideBar teniendo en cuenta el responsive
   */
  private mostrarlogoCompleto:boolean;
  /**
   * Variable la utilizamos para ver si está dentro del punto de quiebre (BreakPoint) de la pantalla 
   */
  private dentroPuntoQuiebreResponsive:boolean;
  /**
   *  Variable bandera que utilizamos para saber en pc si el sidebar está abierto o no 
   */
  public banderaSidebar:boolean=true;

  /**
   * Objeto instanciado de la libreria Metis menu para realizar modificaciones 
   */
  public metisMenuObj: MetisMenu;

  /**
   *
   * @param document inyeccion de variable tipo document
   * @param _initModel modelo incial
   * @param _utilsService servicio de utilidades
   * @param _router variable de ruteo
   * @param _breakpointObserver variable para observar u validar los puntos de quiebre  de las pantallas
   * @param windowRef Referencia a la clase WindowRef
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _initModel: InitModel,
    private _utilsService: UtilsService,
    private _router: Router,
    private _breakpointObserver: BreakpointObserver,
    private windowRef: WindowRef,
    ) {
    _router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.idPagina = PermisosUtils.ObtenerPagina();
        if (this.idPagina !== null && this.idPagina > 0) {
          if (window.matchMedia('(max-width: 991px)').matches) {
            this.document.body.classList.remove('sidebar-open');
          }
        }
      }
    });
  }

  /**
   * Método que escucha cambios de parametros de componente
   * @param changes Evento que contiene los cambios 
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paginaEntrante?.currentValue !== changes.paginaEntrante?.previousValue) {
      if (this.paginaEntrante !== null && this.paginaEntrante > 0 && !!this.paginaEntrante) {
        this.idPagina=this.paginaEntrante;
        this._activateMenuDropdown();
      }
    }
  }
  /**
   * Metodo encargado de destruir el componente de modulo
   */
  ngOnDestroy(): void {
    this._arraySubcriptors.forEach(sub => sub.unsubscribe());
  }

  /**
   * Método inicial que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this.idPagina = PermisosUtils.ObtenerPagina();
    this.validarTipoUsuario();
    this.crearMenu();
    const desktopMedium = window.matchMedia('(min-width:992px) ');
    desktopMedium.addListener(this.iconSidebar);
    this.iconSidebar(desktopMedium);
    this.subscripcionBreakPoint();
  }

  /**
   * getter lo utilizamos para validar si mostramos o no el logo grande
   * @returns retorna un boleano 
   */
  get mostrarLogoGrande():boolean{
    if (!this.dentroPuntoQuiebreResponsive) {
      return  this.document.body.classList.contains('open-sidebar-folded')
    }else{
      return  this.mostrarlogoCompleto
    }
  }

 /**
  * Función para corregir Error de bloqueo del menú del sideBar de libreria MetisMenu
  * @param item  item de menú seleccionado
  */ 
  public correccionMetisMenu(item:MenuItem):void{
    this.metisMenuObj.setTransitioning(false);
    const Default = {
      subMenu: 'ul',
    }
    const ClassName = {
      COLLAPSING: 'mm-collapsing',
    };
    if (item) {
      const { label }=item 
      if (label.toLowerCase()!="seguridad") return
    }
    const uls = [...this.sidebarMenu.nativeElement.querySelectorAll(Default.subMenu)];
    if (uls.length === 0) {
        return;
    }
    uls.forEach((ul) => {
      if (ul.classList.contains(ClassName.COLLAPSING)) {
        ul.classList.remove(ClassName.COLLAPSING)
      }
    });
  }
  /**
   * Metodo lo utilizamos para subscribirnos al observer de la pagina para saber el ancho de la pagina en tiempo real  
   */
  public subscripcionBreakPoint():void{
    this._breakpointObserver.observe(['(max-width: 991px)']).subscribe((res) => {
      if (res.matches) {
        this.dentroPuntoQuiebreResponsive=true
        this.document.body.classList.remove('open-sidebar-folded'); 
        this.mostrarlogoCompleto=true;
        this.document.body.classList.remove('sidebar-folded'); 
        this.banderaSidebar=true;
      } else {
        this.dentroPuntoQuiebreResponsive=false
        this.mostrarlogoCompleto=this.document.body.classList.contains('open-sidebar-folded')
        this.document.body.classList.add('sidebar-folded'); 
      }
    });
  }

  /**
   * Toggle sidebar on hamburger button click
   * @param e variable que almacena el evento recibido
   */
  toggleSidebar(e):void {
    this.sidebarToggler.nativeElement.classList.toggle('active');
    this.sidebarToggler.nativeElement.classList.toggle('not-active');
    if (window.matchMedia('(min-width: 992px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-folded');
    } else if (window.matchMedia('(max-width: 991px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-open');
    }
  }

  /**
   * Toggle settings-sidebar
   * @param e variable que almacena el evento recibido
   */
  toggleSettingsSidebar(e):void {
    e.preventDefault();
    this.document.body.classList.toggle('settings-open');
  }

/**
 * Método para abrir y cerrar side bar cuando está en pantalla de escritorio max-width 991px
 */
  public OpenCloseSidebar():void{
    if (this.banderaSidebar) {
      if (this.document.body.classList.contains('sidebar-folded')) {
        this.document.body.classList.remove('sidebar-folded');
        this.document.body.classList.add('open-sidebar-folded');
      }
      this.banderaSidebar=false
    }else {
      if (this.document.body.classList.contains('open-sidebar-folded')) {
        this.document.body.classList.remove('open-sidebar-folded');
        this.document.body.classList.add('sidebar-folded');
      }
      this.banderaSidebar=true
    }

    setTimeout(() => {
      this.windowRef.nativeWindow.dispatchEvent(new Event('resize'));
    }, 70);
    this.metisMenuObj.setTransitioning(false);

  
  }
  /**
   * Sidebar-folded on desktop (min-width:992px and max-width: 1199px) mucho max
   * @param e variable que almacena el evento recibido
   */
  iconSidebar(e):void {
    if(this.document){
      if (e.matches) {
        this.document.body.classList.add('sidebar-folded');
        this.document.body.classList.remove('open-sidebar-folded');
      } else {
        this.document.body.classList.remove('sidebar-folded');
      }
    }
  }

  /**
   * Switching sidebar light/dark
   * @param event variable que almacena el evento recibido
   */
  onSidebarThemeChange(event) {
    this.document.body.classList.remove('sidebar-light', 'sidebar-dark');
    this.document.body.classList.add(event.target.value);
    this.document.body.classList.remove('settings-open');
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Reset the menus then hilight current active menu item
   */
  _activateMenuDropdown() {
    this.resetMenuItems();
    this.activateMenuItems();
  }

  /**
   * Resets the menus
   */
  resetMenuItems() {
    const links = document.getElementsByClassName('nav-link-ref');
    for (let i = 0; i < links.length; i++) {
      const menuItemEl = links[i];
      menuItemEl.classList.remove('mm-active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.remove('mm-active');
        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.remove('mm-show');
        }
        const parent3El = parent2El.parentElement;
        if (parent3El) {
          parent3El.classList.remove('mm-active');

          if (parent3El.classList.contains('side-nav-item')) {
            const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

            if (firstAnchor) {
              firstAnchor.classList.remove('mm-active');
            }
          }
          const parent4El = parent3El.parentElement;
          if (parent4El) {
            parent4El.classList.remove('mm-show');
            const parent5El = parent4El.parentElement;
            if (parent5El) {
              parent5El.classList.remove('mm-active');
            }
          }
        }
      }
    }
  }

  /**
   * Toggles the menu items
   */
  activateMenuItems() {
    const links = document.getElementsByClassName('nav-link-ref');
    let menuItemEl = null;
    for (let i = 0; i < links.length; i++) {
      if (this.idPagina === +links[i].id) {
        menuItemEl = links[i];
        break;
      }
    }
    if (menuItemEl) {
      this.addActiveToAncestry(menuItemEl);
    } else {
      if (!!this.idPagina && !!this.menuItems) {
        this._utilsService.getPaginasPadre(this.idPagina)
          .then(paginasPadre => {
            paginasPadre.forEach(pagina => {
              const menuItem = Array.from(links).find(link => pagina.idPagina === +link.id);
              if (!!menuItem) {
                this.resetMenuItems();
                this.addActiveToAncestry(menuItem);
              }
            });
          });
      }
    }
  }

  /**
   * Metodo utilizado para crear menu del sidebar
   */
  crearMenu() {
    let arrayMenu: Pagina[] = null;
    const initSubscription: Subscription = this._initModel.menus$.subscribe
      (menus => {
        arrayMenu = menus
        const arrayItemMenu: MenuItem[] = [];
        arrayMenu.forEach(item => {
          const itemMenu: MenuItem = {
            id: item.id,
            label: item.nombre,
            icon: item.icono,
            link: item.urlPagina,
            expanded: false,
            isTitle: item.esTitulo,
            badge: '',
            parentId: item.idPaginaPadre,
          };
          if (item.hijos?.length > 0) {
            const arraySubHijos = this.crearMenuHijos(item.hijos);
            itemMenu.subItems = arraySubHijos;
          }
          if (item.verEnMenu === true) {
            arrayItemMenu.push(itemMenu);
          }
        });
        this.menuItems = GeneralUtils.cloneObject(arrayItemMenu);

        setTimeout(() => {
          this.metisMenuObj=  new MetisMenu(this.sidebarMenu.nativeElement);
          this._activateMenuDropdown();
        });
      });
    this._arraySubcriptors.push(initSubscription);
  }

  /**
   * Metodo creado para crear el menu de los hijos de un submenu
   * @param hijos paginas hijas de una pagina padre
   * @returns un array de menu items
   */
  crearMenuHijos(hijos: Pagina[]): MenuItem[] {
    const arrayItemMenuHijo: MenuItem[] = [];
    hijos.forEach(itemHijo => {
      const itemMenuHijo: MenuItem = {
        id: itemHijo.id,
        label: itemHijo.nombre,
        icon: itemHijo.icono,
        link: itemHijo.urlPagina,
        expanded: false,
        isTitle: itemHijo.esTitulo,
        badge: '',
        parentId: itemHijo.idPaginaPadre,
      };
      if (itemHijo.hijos?.length > 0) {
        const subHijos = this.crearMenuHijos(itemHijo.hijos);
        itemMenuHijo.subItems = subHijos;
      }
      if (itemHijo.verEnMenu === true) {
        arrayItemMenuHijo.push(itemMenuHijo);
      }
    });
    return arrayItemMenuHijo;
  }

  /**
   * Realiza la redireccion de cada ruta en las opciones del trablero principal
   * @param option contiene la opción seleccionada
   */
  clickRedirection(option: MenuItem) {
    this._router.navigate([option.link], { queryParams: { idPagina: option.id } });
  }

  /**
   * Metodo utilizado para guardar el id de la pagina de manera temporal
   * @param idPagina id de la página seleccionada
   */
  public guardarIdPagina(idPagina: number): void {
    const objInfoNecesaria: CrearDocumentoTemporal =  this._armarObjetoCrearDocumentoTemporal();
 
    if(objInfoNecesaria) localStorage.setItem('crearDocumentoAux',JSON.stringify(objInfoNecesaria));
    
    if (PermisosUtils.ObtenerPagina() !== idPagina) ['idEds', 'eds', 'idProceso', 'proceso', 'tieneTipos'].forEach(nombre => localStorage.removeItem(nombre));
    PermisosUtils.GuardarPagina(idPagina);
  }

  /**
   * Agregar atributos de estilos a elemento y elementos ancestros
   * @param element elemento a asignar estilos
   */
  private addActiveToAncestry(element: Element): void {
    element.classList.add('mm-active');
    const parentEl = element.parentElement;
    if (parentEl) {
      parentEl.classList.add('mm-active');
      const parent2El = parentEl.parentElement;
      if (parent2El) {
        parent2El.classList.add('mm-show');
      }
      const parent3El = parent2El.parentElement;
      if (parent3El) {
        parent3El.classList.add('mm-active');
        if (parent3El.classList.contains('side-nav-item')) {
          const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');
          if (firstAnchor) {
            firstAnchor.classList.add('mm-active');
          }
        }
        const parent4El = parent3El.parentElement;
        if (parent4El) {
          parent4El.classList.add('mm-show');
          const parent5El = parent4El.parentElement;
          if (parent5El) {
            parent5El.classList.add('mm-active');
          }
        }
      }
    }
  }

  /**
   * Metodo para redireccionar a operaciones
  */
  public redireccionarOperaciones(): void {
    this._router.navigateByUrl('home/dashboard');
  }

  /**
   * Metodo para validar el tipo de usuario
   */
  private validarTipoUsuario() {
    const usuarioSuscripcion: Subscription = this._initModel.userIdentity$.subscribe(user => {
      this.userIdentity = user;
    })
    this._arraySubcriptors.push(usuarioSuscripcion);
  }


  /**
   * Método que permite armar el objeto temporal de crear documento
   */
  private _armarObjetoCrearDocumentoTemporal(): CrearDocumentoTemporal{
    if(localStorage.getItem('idEds') || localStorage.getItem('eds') || localStorage.getItem('idProceso') || localStorage.getItem('proceso')){
      return {
        idEds: +localStorage.getItem('idEds'),
        nombreProceso: JSON.parse(localStorage.getItem('proceso'))?.nombre,
        nombreEds: JSON.parse(localStorage.getItem('eds'))?.nombre,
        idProceso: +localStorage.getItem('idProceso'),
        tieneTipos: localStorage.getItem('tieneTipos')
      }
    }
  }
}
