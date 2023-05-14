import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Utils } from '@shared/global/utils';
import { EPermisosEnum } from 'src/app/core/enum/permisos.enum';

@Injectable({
  providedIn: 'root'
})
export class WebApiConsumerService {

  private _apiUrl: string = environment.webApiUrlBase;
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private _resolvedOptions = Intl.DateTimeFormat().resolvedOptions();

  constructor(
    private http: HttpClient
  ) { }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getMethod(urlResource: string, params: any[], headers: any[], options: any = { auth: false }): Observable<any> {
    let idPermiso: number = EPermisosEnum.leer;
    const urlApiResource = options.dominio ? options.dominio : this._apiUrl + urlResource;    
    let paramHeaders = new HttpHeaders();
    if (options.auth === true) {
      paramHeaders = paramHeaders.append('Authorization', 'Bearer ' + Utils.getUserToken());
    }
    let paramQuery = new HttpParams();
    headers.forEach(item => {
      paramHeaders = paramHeaders.append(item.campo, item.valor);
    });
    paramHeaders = paramHeaders.append('ZonaHoraria', this._resolvedOptions.timeZone);
    if (params === null) {
      params = [];
    }
    params.forEach(item => {
      paramQuery = paramQuery.append(item.campo, item.valor);
    });
    paramHeaders = paramHeaders.append('idPermiso', idPermiso+'');
    return this.http.get(urlApiResource, { headers: paramHeaders, params: paramQuery }).pipe(
      catchError(this.handleError)
    );
  }

  postMethod(urlResource: string, params: any, headers: any[] = [], options: any = { auth: true }): Observable<any> {
    let idPermiso: number = EPermisosEnum.crear;
    const urlApiResource = options.dominio ? options.dominio : this._apiUrl + urlResource;
    let paramHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    if (options.auth) {
      paramHeaders = paramHeaders.append('Authorization', 'Bearer ' + Utils.getUserToken());
    }
    headers.forEach(item => {
      paramHeaders = paramHeaders.append(item.campo, item.valor);
    });
    paramHeaders = paramHeaders.append('ZonaHoraria', this._resolvedOptions.timeZone);
    paramHeaders = paramHeaders.append('idPermiso', idPermiso+'');
    return this.http.post(urlApiResource, params, { headers: paramHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  putMethod(urlResource: string, params: any, headers: any[] = [], options: any = { auth: true }): Observable<any> {
    let idPermiso: number = EPermisosEnum.editar;
    const urlApiResource = options.dominio ? options.dominio : this._apiUrl + urlResource;
    let paramHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    if (options.auth) {
      paramHeaders = paramHeaders.append('Authorization', 'Bearer ' + Utils.getUserToken());
    }
    paramHeaders = paramHeaders.append('ZonaHoraria', this._resolvedOptions.timeZone);
    headers.forEach(item => {
      paramHeaders = paramHeaders.append(item.campo, item.valor);
    });
    paramHeaders = paramHeaders.append('idPermiso', idPermiso+'');
    return this.http.put(urlApiResource, params, { headers: paramHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  deleteMethod(urlResource: string, headers: any[] = [], options: any = { auth: true }): Observable<any> {
    let idPermiso: number = EPermisosEnum.eliminar;
    const urlApiResource = options.dominio ? options.dominio : this._apiUrl + urlResource;
    let paramHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    if (options.auth) {
      paramHeaders = paramHeaders.append('Authorization', 'Bearer ' + Utils.getUserToken());
    }
    headers.forEach(item => {
      paramHeaders = paramHeaders.append(item.campo, item.valor);
    });
    paramHeaders = paramHeaders.append('ZonaHoraria', this._resolvedOptions.timeZone);
    paramHeaders = paramHeaders.append('idPermiso', idPermiso+'');
    return this.http.delete(urlApiResource, { headers: paramHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  postMethodDocument(urlResource: string, files: FormData, headers: any[] = [], options: any = { auth: true }): Observable<any> {
    let idPermiso: number = EPermisosEnum.crear;
    const urlApiResource = options.dominio ? options.dominio : this._apiUrl + urlResource;
    let paramHeaders = new HttpHeaders();
    if (options.auth) {
      paramHeaders = paramHeaders.append('Authorization', 'Bearer ' + Utils.getUserToken());
    }
    headers.forEach(item => {
      paramHeaders = paramHeaders.append(item.campo, item.valor);
    });
    paramHeaders = paramHeaders.append('ZonaHoraria', this._resolvedOptions.timeZone);
    paramHeaders = paramHeaders.append('idPermiso', idPermiso+'');
    return this.http.post(urlApiResource, files, { headers: paramHeaders }).pipe(
      catchError(this.handleError)
    );
  }

  downloadFile(link) {    
    const fileName = link.replace(/^.*[\\\/]/, '');
    this.http.get(link, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        if (fileName)
          downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    );
  }

  loginMethod() {

  }

  

}
