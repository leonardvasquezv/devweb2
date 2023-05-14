import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { GlobalModel } from '@core/model/global.model';
import { InitModel } from '@core/model/init.model';
import { PermisosUtils } from '@core/utils/permisos-utils';
import { UtilsService } from '@shared/services/utils.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  isLoading: boolean;

  /**
   * id de pagina Actual O actualizada
   */
  public paginaActual: number;

  /**
   * Metodo constructor para obtener metodos generales del servicio
   * @param _globalModel Modelo de global
   * @param _router Propiedad para obtener la ruta actual de la página
   * @param _initModel Propiedad para inyectar metodos del modelo inicial de la aplicacion
   */
  constructor(private _globalModel: GlobalModel,
              @Inject(DOCUMENT) private document: Document,
              private _router: Router,
              private _initModel: InitModel,
              private _utilsService: UtilsService
  ) {

    // Spinner for lazyload modules
    _router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });


  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.registerRoutes();
  }
  /**
   * Metodo utilizado para obtener todos los datos iniciales en el store
   */
  private cargarDatosIniciales(): void {
    this._globalModel.obtenerGlobals();
    this._initModel.obtenerDatosLogin();
  }

   /**
   * Metodo encargado de registrar rutas
   */
    private registerRoutes() {
      this._router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((val: any) => {
        const url = val.url;
        let idPagina = 0;
        this._utilsService.getPaginaUrl(url).then(pagina => {
          idPagina = pagina?.id
          if (!!idPagina)
            PermisosUtils.GuardarPagina(idPagina); 
            this.paginaActual=idPagina;
        });
      });
    }
  /**
   * Plegar la barra lateral al momento de hacer click fuera del mismo
   * @param event evento de touchEnd
   */
  public cerrarSidebarPlegado(event:any=null):void {
    const target_id:string=event.target.id
      if (this.document.body.classList.contains('sidebar-open') && target_id.includes('main-wrapper')) {
        this.document.body.classList.remove('sidebar-open');
      }
  }

}
