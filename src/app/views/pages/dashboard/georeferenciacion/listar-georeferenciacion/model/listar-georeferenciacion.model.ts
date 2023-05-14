import { Injectable } from "@angular/core";
import { MapConfig } from "@core/classes/mapConfig.class";
import { ObjParam } from "@core/interfaces/base/objParam.interface";
import { ResponseWebApi } from "@core/interfaces/base/responseWebApi.interface";
import { Observable } from "rxjs";
import { MarkerEds } from '../interfaces/marker-eds.interface';
import { ListarGeoreferenciacionService } from '../services/listar-georeferenciacion.service';


@Injectable()
export class ListarGeoreferenciacionModel {
    constructor(private _listarGeoreferenciacionService: ListarGeoreferenciacionService) { }
    /**
     * Método para sacar las distancias de todas las eds del ususario, devolviendo únicamente las más cercanas definidas dentro del radio
     * @param ubicacionUsuario coordenadas de la ubicación del usuario
     * @param estaciones listado de las eds
     * @param seleccionarMarker Bandera que permite saber si el marcador estará seleccionado o no
     */
    public distanciasMasCortas(ubicacionUsuario: google.maps.LatLng, estaciones: Array<MarkerEds>, mapConfig: MapConfig, seleccionarMarker: boolean): MarkerEds[] {
        if (ubicacionUsuario) {
            estaciones.forEach(eds => {
                const latLngObj = new google.maps.LatLng(+eds.latitud, +eds.longitud);
                eds.distanciaDeUsuario = google.maps.geometry?.spherical.computeDistanceBetween(ubicacionUsuario, latLngObj);
            });
           estaciones.sort((edsA, edsB) => edsA.distanciaDeUsuario - edsB.distanciaDeUsuario)
        }
        estaciones = estaciones.map((eds, index) => eds = { ...eds, markerOption: mapConfig.configuracionMarker(index == 0  && (ubicacionUsuario && seleccionarMarker) ? true : false, false) })
        return estaciones;
    }
    /**
     * Método para llamar al servicio que obtiene las EDS
     * @param criterios Criterios para traer EDS
     * @returns Array de EDSs
     */
    public obtenerEds(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
        return this._listarGeoreferenciacionService.obtenerGeoInfoEDS(criterios)
    }
    /**
     * Método para obtener los departamentos
     * @returns Array de Departamentos
     */
    public obtenerDepartamentos(): Observable<ResponseWebApi> {
        return this._listarGeoreferenciacionService.obtenerDepartamentos();
    }
    /**
     * Método para obtener los municipios
     * @param criterios Criterios para elegir municipio
     * @returns Respuesta con array de municipios
     */
    public obtenerMunicipios(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
        return this._listarGeoreferenciacionService.obtenerMunicipios(criterios);
    }
}
