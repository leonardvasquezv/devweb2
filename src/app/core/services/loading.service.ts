import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  /**
   * Variable de se encarga de cargar
   */
  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Contains in-progress loading requests
   */
  loadingMap: Map<string, boolean> = new Map<string, boolean>();

  /**
   * Metodo constructor del servicio
   * @param _spinnerService inyeccion de los servicios de NgxSpinnerService
   */
  constructor(private _spinnerService: NgxSpinnerService) { }

  /**
   * Sets the loadingSub property value based on the following:
   * - If loading is true, add the provided url to the loadingMap with a true value, set loadingSub value to true
   * - If loading is false, remove the loadingMap entry and only when the map is empty will we set loadingSub to false
   * This pattern ensures if there are multiple requests awaiting completion, we don't set loading to false before
   * other requests have completed. At the moment, this function is only called from the @link{HttpRequestInterceptor}
   * @param loading {boolean}
   * @param url {string}
   */
  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function');
    }
    if (loading === true) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    }else if (loading === false && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
  }

  /**
   * Metodo encargado de mostrar el spinner principal
   * @param name nombre del spinner
   */
   public show(name = 'spinnerPrincipal'): void {
    this._spinnerService.show(name);
    this.loadingSub.next(true);
  }

  /**
   * Metodo encargado de ocultar el spinner principal
   * @param name nombre del spinner
   */
  hide(name = 'spinnerPrincipal'): void {
    this._spinnerService.hide(name);
    this.loadingSub.next(false);
  }

}
