import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EstadoNotificacion } from '@core/enum/estado-notificacion.enum';
import { Notificacion } from '@core/interfaces/base/notificacion.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { InitModel } from '@core/model/init.model';
import { NotificacionModel } from '@core/model/notificaciones.model';
import { SeguridadModel } from '@core/model/seguridad.model';
import { NotificacionesService } from '@core/services/notificaciones.service';
import { GeneralUtils } from '@core/utils/general-utils';
import { PermisosUtils } from '@core/utils/permisos-utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { ObjIdioma } from '@shared/models/objIdioma.model';
import { ObjLoginUser } from '@shared/models/objLoginUser.model';
import { UtilsService } from '@shared/services/utils.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public userRole!: number;
  public userName !: string;
  public nameUser !: string;
  public arrayIdiomas: ObjIdioma[] = [];
  public objIdiomaSeleccionado = new ObjIdioma();
  public imgUserSmall!: string;
  public imgUserLarge!: string;

  /**
   * Objeto con los parametros que van dentro del headers de la peticion del WebApi
   */
  public arrayHeaders: Array<any> = [];

  /**
   * Array con la datos de las notificaciones
   */
  public notificaciones: Array<Notificacion>;


  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /*
  * Usuario autenticado en el sistema
  */
  public userIdentity: ObjLoginUser;

  /**
   * Variable para identificar si existen notificaciones nuevas
   */
  public notificacionPendiente = true;

  /**
   * Variable para validar si se abrio o se cerro la campana de notificaciones
   */
  public notificacionesCampana = false;
  
  /**
   * Variable para validar si se concedio permiso para realizar notificaciones push
   */
  public permisoConcedido = false;
  
  /**
   * Metodo encargado de construir el componente de navbar
   * @param document inyeccion de documento
   * @param _translate inyeccion de servicio de traducccion
   * @param _notificacionModel modelo de notificaciones
   * @param _router Servicio para acceder a las rutas
   * @param _seguridadModel inyeccion de modelo de seguridad
   * @param _matDialog servicio para modales
   * @param _translateService inyeccion de servicio de traducciones
   * @param _utilsService utilidades del sistema
   * @param _notificationService inyeccion de servicio de Notificaciones
   * @param _initModel inyeccion de modelo de inicialización
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _translate: TranslateService,
    private _notificacionModel: NotificacionModel,
    private _router: Router,
    private _seguridadModel: SeguridadModel,
    private _matDialog: MatDialog,
    private _translateService: TranslateService,
    private _utilsService: UtilsService,
    private _notificationService:NotificacionesService,
    private _initModel: InitModel
  ) { }

  /**
   * Metodo encargado de inicializar e componente de navbar
   */
  ngOnInit(): void {
    this.arrayIdiomas = [
      {
        title: 'es',
        icono: 'flag-icon-es',
        text: 'Español'
      },
      {
        title: 'us',
        icono: 'flag-icon-us',
        text: 'English'
      }
    ];
    this.objIdiomaSeleccionado = this.arrayIdiomas[0];
    this.cargarUserIdentity();
    this.escucharNotificaciones();
    this.notificaciones=[]
    this.obtenerNotificaciones()
    this.SolicitudPermisoNotificacionPush()
  }

  /**
   * Metodo Para realizar Noticaciones Push al Usuario
   */
  public SolicitudPermisoNotificacionPush():void{
    Notification.requestPermission().then(
      (permission)=>{
        if (permission === "granted") {
          this.permisoConcedido=true;
        }
      });
  }

  /**
   * Función para cargar del localstorage los datos del userIdentity
   */
  public cargarUserIdentity(): void {
    const subscribcionUserEntity=this._initModel.userIdentity$.subscribe(user => {
      if (!!user) {
        const userIdentity = user;
        this.userIdentity = userIdentity;
        this.userName = userIdentity != null && userIdentity.username != null ? userIdentity.username : 'nombre@empresa.com.co';
        this.nameUser = userIdentity != null && userIdentity.primerNombre != null && userIdentity.primerApellido != null ? userIdentity.primerNombre + ' ' + userIdentity.primerApellido : 'Nombre Apellido';
        this.userRole = userIdentity != null && userIdentity.rol != null ? userIdentity.rol : 0;
        this.imgUserSmall = userIdentity != null && userIdentity.rutaAvatar != null ? userIdentity.rutaAvatar : 'https://via.placeholder.com/30x30';
        this.imgUserLarge = userIdentity != null && userIdentity.rutaAvatar != null ? userIdentity.rutaAvatar : 'https://via.placeholder.com/80x80';
      }
    });
    this._subscriptions.add(subscribcionUserEntity)
  }

  /*
    Función para redirigir a los usuarios administradores a HEADOFFICE
  */
  public redireccionHeadOffice(): void {
    window.location.href = environment.routeRedirectSeguridad;
  }
  /**
   * Método para redireccionar desde la notificación al documento correspondiente
   * @param notificacion Notificación con el documento al que se redireccionará
   */
  public redireccionNotificacion(notificacion: Notificacion): void {
    this._notificacionModel.seleccionarNotificacion(notificacion);
    this.marcarNotificacionComoLeida(notificacion);
    const url = '/home/gestion-documental';
    this._utilsService.getPaginaUrl(url).then(pagina => {
      if (!!pagina?.id) {
        PermisosUtils.GuardarPagina(pagina?.id);
        this._router.navigate([url]);
      }
    });
  }

  /**
   * Sidebar toggle on hamburger button click
   * @param e evento que emite al momento de abrir el sidebar
   */
  public toggleSidebar(e: any): void {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Metodo para eliminar archivo
   * @param idDocumento seleccionado
   */
  public abrirModalConfirmarOperacion(): void {
    this._modalTipos('TITULOS.CONFIRMAR_CERRAR_SESION', '15').afterClosed().subscribe((result) => {
      if (!!result) {
        this._seguridadModel.cerrarSesion();
      }
    });
  }

  /**
   * Metodo generico para modal tipo
   * @param descripcion a mostrar
   * @param icon a mostrar
   * @returns Respuesta matdialog
   */
  private _modalTipos(descripcion: string, icon: string): MatDialogRef<ModalTiposComponent> {
    const matDialog = this._matDialog.open(ModalTiposComponent, {
      data: {
        descripcion: this._translateService.instant(descripcion),
        icon,
        txtButton1: this._translateService.instant('BOTONES.CONFIRMAR'),
        txtButton2: this._translateService.instant('BOTONES.CANCELAR'),
      },
      panelClass: 'modal-confirmacion',
    });
    return matDialog;
  }

  /**
   * Metodo encargado de cambiar idioma de la aplicacion
   * @param idioma elegido para asignar
   */
  public cambiarIdioma(idioma: ObjIdioma): void {
    this.objIdiomaSeleccionado = idioma;
    this._translate.use(idioma.title);
  }

  /**
 * Metodo donde se destruye el componente
 */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
    this._notificationService.desconectar();
  }

  /**
   * Metodo para escuchar las notificaciones de signal r
   */
  public escucharNotificaciones(): void {
    this._notificationService.iniciarConexionSignalR();
    const subscripcionNotificaciones=this._notificationService.dataEndpoint$.subscribe(Notificaciones  => {
      if(!!Notificaciones) {
        let NotificacionesUsuario:Array<Notificacion>=Notificaciones.filter(x=>x.idUsuario=this.userIdentity.id)
        if(NotificacionesUsuario.length>0){
          var notification = new Notification('Hola '+this.userIdentity.nombreCompleto, {
            icon: 'https://stgcolconswareit.blob.core.windows.net/edsoft-qas/Imagenes/MicrosoftTeams-image%20(2).png',
            body: 'Tienes Notificaciones nuevas',

           });
        }
        Notificaciones.forEach(item=>{
          if(!!Notificaciones?.length && this.userIdentity.id === item.idUsuario) {
            this.notificacionPendiente = true;
            if(!this.validarMensaje(item)) {
              this.notificaciones.push(item);
              this.reportarNotificacionesRecibidas(item);
            }
          }
        })
      }
    });
    this._subscriptions.add(subscripcionNotificaciones)
  }

  /**
   * Metodo para cargar la lista de notificaciones en la campana
   */
  public abrirNotificaciones(): void {
    if(this.notificacionesCampana === true) {
      this.obtenerNotificaciones();
    }
  }

  /**
   * getter para obtener notificaciones no leidas
   * @returns Retorna array de notificaciones filtradas
   */
  get  notificacionesNoLeidas(): Array<Notificacion> {
      return this.notificaciones.filter(x=>!x.leido)||[]
  }

  /**
   * Método para escuchar el evento si el dropDown está abierto o cerrado
   * @param event booleano indicado si está abierto o cerrado  el Dropdown
   */
  public escucharDropdownAbiertoCerrado(event): void {
    this.notificacionesCampana=event
    this.notificacionPendiente=!event
  }

  /**
   * Método para obtener el listado de las notificaciones
   */
  public obtenerNotificaciones(): void {
    const Criterio: Array<ObjParam> = [
      {
        campo: 'EstadoRegistro',
        valor: 'A'
      }
    ]
    const subscripcionNotificacionListado = this._notificacionModel.obtenerNotificacionesPorCriterios(Criterio)
      .pipe(
        map<ResponseWebApi,Array<Notificacion>>(res => res.data)
      )
      .subscribe(
        (notificaciones: Array<Notificacion>) => {
          this.notificaciones = GeneralUtils.cloneObject(notificaciones)
          this.notificaciones.forEach(x => {
            x.fechaModificacion = new Date(x.fechaModificacion)
            x.fechaCreacion = new Date(x.fechaCreacion)
            x.fechaLeido =!!x.fechaLeido? new Date(x.fechaLeido):null
            x.leido = x.fechaLeido != null
          });
          this.notificaciones.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        }
      );
    this._subscriptions.add(subscripcionNotificacionListado);
  }

  /**
   * Metodo usado para confirmar a todas las notificaciones como leidas
   */
   public confirmarLecturaTodasNotificacion(): void {
    if(this.notificaciones.length > 0) {
      this.notificaciones.forEach(element => {
          if(!element.fechaLeido){
            this.marcarNotificacionComoLeida(element)
          }
      });
    }
  }

  /**
   * Metodo usado para confirmar una notificacion Como leida
   * @param item Objeto de notificacion que se desea marcar como leida
   */
  public marcarNotificacionComoLeida(item:Notificacion):void{
    let notificacion: Notificacion = item;
    notificacion = {...notificacion, fechaLeido: new Date(), idEstadoNotificacion: EstadoNotificacion.leido}
    this._notificacionModel.cambiarEstadoNotificacion(notificacion).pipe(
      map<ResponseWebApi,Notificacion>(response=>response.data)
    )
    .subscribe(x => {
      if (!!x) {
        x.fechaModificacion = new Date(x.fechaModificacion)
        x.fechaCreacion = new Date(x.fechaCreacion)
        x.fechaLeido =!!x.fechaLeido? new Date(x.fechaLeido):null
        x.fechaRecibido =!!x.fechaRecibido? new Date(x.fechaRecibido):null
        x.leido = x.fechaLeido != null
        this.removerActualizarNotificacion(x)
      }
    });
  }

/**
 * Metodo usado para Remover notificacion Desactualizada
 * @param item  notificacion
 */
  public removerActualizarNotificacion(item:Notificacion): void {
    const notificaciones = this.notificaciones.filter(element => {
      if(element.idNotificacion !== item.idNotificacion){
        return element;
      }
    })
    this.notificaciones = [
      item,
      ...notificaciones
    ];
  }


  /**
   * Metodo para validar si existe la notificacion de signal r dentro del array de notificaciones
   * @param mensaje objeto de notificacion que se desea validar
   * @returns boolean
   */
  public validarMensaje(mensaje: Notificacion): boolean {
      let existe = false;
      this.notificaciones.forEach(item => {
        if(mensaje.idNotificacion === item.idNotificacion) {
            existe = true;
        }
      });
      return existe;
    }

  /**
   * Metodo usado para reportar las notificaciones recibidas
   * @param notificacion notificacion a enviar
   */
     public reportarNotificacionesRecibidas(notificacion: Notificacion): void {
      if(!this.validarMensaje(notificacion)) {
        let notificacionEnvio: Notificacion = notificacion;
        notificacionEnvio = {
          ...notificacionEnvio,
          fechaRecibido: new Date(),
          idEstadoNotificacion: EstadoNotificacion.recibido
        }
          const cambioEstado$=this._notificacionModel.cambiarEstadoNotificacion(notificacionEnvio).subscribe(element => {});
          this._subscriptions.add(cambioEstado$)
      }
    }
}
