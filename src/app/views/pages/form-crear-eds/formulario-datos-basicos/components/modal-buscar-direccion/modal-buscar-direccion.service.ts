import { Injectable } from '@angular/core';
import { GeocoderResponse } from '@core/classes/geocoderResponse.class';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalBuscarDireccionService {


  /**
   * Método encargado de realizar la inyección de dependencias
   * @param _httpService Inyección servicio general Http
   */
  constructor(
    private _httpService: HttpBaseService
  ) {
  }

  /**
   * Método encargado de devolver una dirección dada una Longitud y una Latitud
   * @param latitud Latitud a buscar
   * @param longitud Longitud a buscar
   * @returns Una direccion dependiendo de la longitud y latitud dada
   */
  obtenerDireccionPorCoordenadas(latitud: string, longitud: string): Observable<ResponseWebApi> {
    const queryParams: Array<ObjParam> = [
      {
        campo: "latitud",
        valor: latitud
      },
      {
        campo: "longitud",
        valor: longitud
      }
    ]
    return this._httpService.getMethod('map/obtener-direccion', queryParams, false);
  }

  /**
   * Método encargado de devolver las coordenadas Latitud y Longitud dada una dirección
   * @param direccion Direccion a la cual se le buscarán sus coordenadas
   * @returns Coordenadas longitud y latitud
   */
  obtenerCoordenadas(direccion: string): Observable<GeocoderResponse> {
    const queryParams: Array<ObjParam> = [
      {
        campo: "direccion",
        valor: direccion
      }
    ]
    return this._httpService.getMethod('map/obtener-coordenadas', queryParams, false);
  }


  /**
   * Método encargado de buscar un lugar dado un place_id
   * @param place_id Id unico para identificar una ubicación
   * @return Objeto que contiene la información del lugar asociado al place_id
   */
  obtenerCoordenadasPorPlaceId(place_id: string): Observable<any> {
    const queryParams: Array<ObjParam> = [
      {
        campo: "placeId",
        valor: place_id
      }
    ]
    return this._httpService.getMethod('map/obtener-direccion-placeId', queryParams, false);
  }

  /**
   * Método encargado de obtener las ubicaciones parecidas a una cadena dada
   * @param lugar Texto ingresado y del cual se quiere obtener coinsidencias
   * @param types define el tipo de busqueda (por departamentos, ciudades...)
   * @returns observable con array de predicciones del lugar
   */
  obtenerPrediccionesDireccion(lugar: string, types: string = 'administrative_area_level_1'): Observable<ResponseWebApi> {
    const { nombrePais } = JSON.parse(localStorage.getItem('paisUsuario'))
    const ubicacion = `${lugar}, ${nombrePais}`;

    const queryParams: Array<ObjParam> = [
      {
        campo: "ubicacion",
        valor: ubicacion
      },
      {
        campo: 'types',
        valor: types
      }
    ]
    return this._httpService.getMethod('map/obtener-prediccion', queryParams, false);
  }

  /**
   * Método encargado de obtener las ubicaciones parecidas a una cadena dada segun una restriccion de zona
   * @param lugar Texto ingresado y del cual se quiere obtener coinsidencias
   * @param ubicacionBounds Define la zona de restriccion de busqueda
   * @returns observable con array de predicciones del lugar
   */
  obtenerPrediccionesDireccionConReestriccionBounds(lugar: string, ubicacionBounds: google.maps.LatLngBounds): Observable<ResponseWebApi> {
    const { nombrePais } = JSON.parse(localStorage.getItem('paisUsuario'));
    lugar = `${lugar}, ${nombrePais}`;
    const [south, west, north, east] = ubicacionBounds.toUrlValue().split(',');
    const criterios = {
      lugar,
      bordes: {
        north,
        west,
        south,
        east
      }
    }
    const aux = JSON.stringify(criterios)
    const queryParams: Array<ObjParam> = [
      {
        campo: "criterios",
        valor: aux
      }
    ]
    return this._httpService.getMethod('map/obtener-prediccion-limites', queryParams, false);

  }
}


