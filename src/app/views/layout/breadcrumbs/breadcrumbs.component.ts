import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivationEnd, Router } from '@angular/router';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { Breadcrumb } from '@core/interfaces/base/breadcrumb.interface';
import { GlobalModel } from '@core/model/global.model';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  /**
   * Titulo del breadcrumb
  */
  public title: string;

  /**
   * Propiedad para saber si la URL accedida es una acción 
  */
  public isAction: boolean;

  /**
   * Propiedad para cerrar el alert-breadcrumb
  */
  public close: boolean;

  /**
   * Variable que contiene el objeto de breadcrumb
   */
  public breadcrumb: Breadcrumb = null;

  /**
   * Variable que permite saber si una ruta es especial o no
   */
  private casoEspecial: boolean = false;

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /**
   * Metodo donde se inyectan las dependencias
  * @param _dialog variable para abrir Modal
   * @param _globalModel Variable que permite acceder a los metodos del modelo global
   * @param location Servicio para interactuar con la URL del navegador
   * @param _router Servicio para acceder a las rutas
   * @param _translateService Variable que permite acceder al servicio de traducciones
  */	
  constructor(
    private _dialog: MatDialog,
    private _globalModel: GlobalModel,
    private location: Location,
    private router: Router,
    private _translateService: TranslateService
  ) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        const path = router.url.split('/');
        this.obtenerRuta();
        const routingPath = data.snapshot.firstChild?.routeConfig?.path;
        const pathTitle = data.snapshot.firstChild?.routeConfig?.data?.title;
        const pathRoute = routingPath != null ? routingPath.split('/') : '';
        if (!!pathTitle) {
          if (path[path.length - 1].includes(pathRoute[pathRoute.length - 1])) {
            this.title = pathTitle;
          }
        }
      }
    });
  }



  
  /**
   * Método que se ejecuta al iniciar el componente
  */
  ngOnInit(): void {
    this._globalModel.breadcrumb$.subscribe(breadcrumb => {
      if (!!breadcrumb) {
        this.breadcrumb = breadcrumb;
        this.isAction = this.breadcrumb.hasBack;
        this.casoEspecial = this.breadcrumb.casoEspecial;
      }
    })
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }


  /**
   * Método que permite regresar a la página anterior y validar si se desea hacerlo
   */
  public goToBack(): void{
    const dialogRef =  this._dialog.open(ModalTiposComponent,{
      data: {
        titulo: "",
        descripcion: this.casoEspecial ? this._translateService.instant('TITULOS.CONFIRMAR_SALIDA') : this._translateService.instant('TITULOS.CONFIRMAR_CANCELAR_PROGRESO'),
        icon: "15",
        button1: true,
        button2: true,
        txtButton1: "Confirmar",
        txtButton2: "Cancelar",
        activarFormulario: false,
      },
      panelClass: "modal-confirmacion",
    })
    this._accionConfirmar(dialogRef);

  }

  /**
   * Método encargado de ejecutar acciones una vez se escoge una opción del modal
   * @param dialogRef Variable de referencia al modal
   */
  private _accionConfirmar(dialogRef: MatDialogRef<ModalTiposComponent>): void{
    const dialogRefSubscription: Subscription = dialogRef 
    .afterClosed()
    .subscribe( result => {
      if(!!result) this.back();
    })
    this._subscriptions.add(dialogRefSubscription);
  }


  /** 
   * Funcion utilizada para que el boton sea capaz de regresar a la pagina padre
   */
  public back(): void {
    this.location.back();
  }

  /* Metodo para validar ruta y generar un booleano para mostrar el boton */
  public obtenerRuta(): void {
    const path = this.router.url;
    const operaciones = [ETiposOperacion.crear, ETiposOperacion.editar, ETiposOperacion.crearDocumento];
    if(operaciones.some(op => path.includes(op))){
      this.isAction = true;
      this.casoEspecial = false;
    }else if(path.includes('crear') || path.includes('editar') || path.includes('crear-documento')){
      this.isAction = true;
      this.casoEspecial = true;
    }else{
      this.isAction = false;
      this.casoEspecial = false;
    }
  }

}

