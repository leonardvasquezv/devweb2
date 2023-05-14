import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as initSelectors from '@core/store/selectors/init.selectors';
import { UtilsService } from '@shared/services/utils.service';
@Directive({
  selector: '[appCheckPermission]'
})
export class CheckPermissionDirective implements OnInit, OnDestroy {

  /**
   * Input de las acciones
   */
  @Input() appCheckPermission: string;

  /**
   * Subject para destruir las suscripciones
   */
  private onDestroy$ = new Subject<boolean>();

  /**
   * Metodo constructor
   * @param store store de redux
   * @param _utilService Servicio de utilidades
   * @param renderer renderizador
   * @param el Elemento a modificar
   */
  constructor(
    private store: Store,
    private _utilService: UtilsService,
    private renderer: Renderer2,
    private el: ElementRef) {
  }

  /**
   * Metodo inicial del componente
   */
  ngOnInit() {
    this.store
      .pipe(
        select(initSelectors.getUserIdentity),
        takeUntil(this.onDestroy$),
      )
      .subscribe(user => {
        if (!!user) {
          this._utilService.validarPermisoAccion(this.appCheckPermission).then(isValid => {
            if (!isValid) {
              this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
            }
          });
        }
      });
  }

  /**
   * Metodo para destruir las sucripciones
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
