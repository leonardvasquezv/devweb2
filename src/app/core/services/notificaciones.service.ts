import { Injectable } from '@angular/core';
import { Notificacion } from '@core/interfaces/base/notificacion.interface';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import * as signalR from "@microsoft/signalr"
import { AuthUtils } from '@core/utils/auth-utils';
import { GeneralUtils } from '@core/utils/general-utils';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  /**
   * Variable que almacena el signalR
   */
  public hubConnection : signalR.HubConnection;

  /**
   * Variable que alamacena la respuesta de signalR
   */
  public data: any;

  /**
   * Observable que almacena el valor de data
   */
  public dataEndpoint$ = new BehaviorSubject<Array<Notificacion>>(null);
   
  /**
   * Token de la aplicación
   */
  public token: string = ''

  /**
   * Constructor de los servicios de notificaciones
   * @param _httpBaseService inyeccion servicio http base
   */
  constructor(private _httpBaseService: HttpBaseService) { }

  /**
   * Método usado para conectarse a signalR
   */
   public iniciarConexionSignalR():void {
    this.token = '';
    this.token = AuthUtils.getUserToken();
    if (this.hubConnection === null || this.hubConnection === undefined) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .withUrl(GeneralUtils.getUrlWebApiSignalR(), { accessTokenFactory: () => this.token, withCredentials: true })
        .build();
      this.iniciarSignalR();
    } else {
      this.iniciarSignalR();
    }
  }

  /**
   * Inicia la conexión de signalR
   */
  private iniciarSignalR() {
    this.hubConnection
      .start()
      .then(() => {
        this.addLocationDataListener();
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  /**
   * Método encargado de conectarse al canal de signalr que envía la localización de un vehículo
   */
  public addLocationDataListener = () => {
    this.hubConnection.on('BroadcastMessage', (data) => {
      this.data = data;
      this.dataEndpoint$.next(data);
    });
  }

  /**
   * Metodo para cerrar la conexión con signalR
   */
  public desconectar(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.token = '';
    }
  }

  /**
   * Metodo usado para listar las notificaciones del usuario
   * @param Criterios Array de criterios a filtrar
   * @returns Observable<ResponseWebApi>
   */
  public obtenerNotificaciones(criterios:Array<ObjParam>): Observable<ResponseWebApi> {
    return this._httpBaseService.getMethod(`notificaciones`, criterios,false);
  }

  
  /**
   * Metodo usado para actualizar el estado de las notificaciones
   * @returns Observable<ResponseWebApi>
   */
  public cambioEstadoNotificacion(notificacion: Notificacion): Observable<ResponseWebApi> {
    return this._httpBaseService.putMethod(`notificaciones/cambioEstado`, notificacion, null,false);
  }
}
