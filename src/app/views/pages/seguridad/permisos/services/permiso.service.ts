import { Injectable } from '@angular/core';
import { EPermisosEnum } from '@core/enum/permisos.enum';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Permiso } from '@core/interfaces/seguridad/permiso.interface';
import { HttpBaseService } from '@core/services/base/http-base.service';
import { Observable } from 'rxjs';

@Injectable()
export class PermisoService {

  /**
   * Constructor de los servicios de permiso
   * @param _httpBase accede a las configuraciones y metodos del servicio
   * base de consumo http
   */
  constructor(private _httpBase: HttpBaseService) { }

  /**
   * Metodo para obtener todos los permisos
   * @returns observable con la respuesta de la peticion
   */
  public obtenerPermisos(criterios: Array<ObjParam>): Observable<ResponseWebApi> {
    const mock: ResponseWebApi = {
      "meta": {
        "totalElements": 30,
        "size": 5,
        "pageNumber": 1
      },
      "message": "Operación Exitosa",
      "status": true,
      "data": [
        {
          "id": 45,
          "nombre": "Cargue Masivo",
          "descripcion": " Permiso que permite aplicar cargue masivo",
          "nomenclatura": "",
          "fechaCreacion": "2022-09-21T09:48:10.89",
          "creadoPor": 20,
          "fechaModificacion": "2022-09-21T09:58:50.0133333",
          "modificadoPor": 20,
          "fechaAnulacion": null,
          "anuladoPor": 0,
          "estadoRegistro": "A",
          "observacionEstado": null
        },
        {
          "id": 44,
          "nombre": "Hola",
          "descripcion": "Prueba Hola",
          "nomenclatura": "",
          "fechaCreacion": "2022-08-05T09:55:20.2266667",
          "creadoPor": 15,
          "fechaModificacion": null,
          "modificadoPor": 0,
          "fechaAnulacion": null,
          "anuladoPor": 0,
          "estadoRegistro": "A",
          "observacionEstado": null
        },
        {
          "id": 43,
          "nombre": "Elimina",
          "descripcion": "Eliminar un registro.",
          "nomenclatura": "",
          "fechaCreacion": "2022-07-21T15:08:38.6933333",
          "creadoPor": 15,
          "fechaModificacion": "2022-07-21T15:11:18.5766667",
          "modificadoPor": 15,
          "fechaAnulacion": "2022-07-21T15:11:18.5766667",
          "anuladoPor": 15,
          "estadoRegistro": "I",
          "observacionEstado": "ok"
        },
        {
          "id": 42,
          "nombre": "nuevo permiso",
          "descripcion": "nuevo permiso",
          "nomenclatura": "",
          "fechaCreacion": "2022-05-04T11:01:30.66",
          "creadoPor": 18,
          "fechaModificacion": "2022-07-21T15:11:22.35",
          "modificadoPor": 15,
          "fechaAnulacion": "2022-07-21T15:11:22.35",
          "anuladoPor": 15,
          "estadoRegistro": "I",
          "observacionEstado": "ok"
        },
        {
          "id": 41,
          "nombre": "permis",
          "descripcion": "permis",
          "nomenclatura": "",
          "fechaCreacion": "2022-03-10T14:13:34.8466667",
          "creadoPor": 18,
          "fechaModificacion": "2022-07-21T15:11:25.9633333",
          "modificadoPor": 15,
          "fechaAnulacion": "2022-07-21T15:11:25.9633333",
          "anuladoPor": 15,
          "estadoRegistro": "I",
          "observacionEstado": "ok"
        }
      ]
    }
    //return of(mock);
    return this._httpBase.getMethod('permisos', criterios, false);
  }

  /**
   * Metodo para guardar un permiso
   * @returns observable con la respuesta de la peticion
   */
  public crearPermiso(permiso: Permiso): Observable<ResponseWebApi> {
    return this._httpBase.postMethod('permiso', permiso, [], false);
  }

  /**
   * Metodo para editar un permiso en base un Id en especifico
   * @returns observable con la respuesta de la peticion
   */
  public editarPermiso(permiso: Permiso): Observable<ResponseWebApi> {
    return this._httpBase.putMethod('permiso', permiso, [], false);
  }

  /**
   * Metodo para consumir permisos
   * @returns observable con la respuesta de la peticion
   */
  public obtenerPermisoPorId(id: number): Observable<ResponseWebApi> {
    return this._httpBase.getMethod(`permiso/${id}`, [], false);
  }

  /**
   * Metodo para activar un permiso
   * @returns observable con la respuesta de la peticion
   */
  public ActivarPermiso(permiso: Permiso): Observable<ResponseWebApi> {
    return this._httpBase.putMethod(`permiso/${permiso.id}/activar`, permiso, [], false, EPermisosEnum.activar);
  }

  /**
   * Metodo para inactivar un permiso
   * @returns observable con la respuesta de la peticion
   */
  public InactivarPermiso(permiso: Permiso): Observable<ResponseWebApi> {
    return this._httpBase.putMethod(`permiso/${permiso.id}/inactivar`, permiso, [], false, EPermisosEnum.inactivar);
  }

}
