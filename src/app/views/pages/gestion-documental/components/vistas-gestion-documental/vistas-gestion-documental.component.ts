import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vistas-gestion-documental',
  templateUrl: './vistas-gestion-documental.component.html',
  styleUrls: ['./vistas-gestion-documental.component.scss']
})
export class VistasGestionDocumentalComponent implements OnInit {
  /**
  *  Instancia de la clase Subscription para guardar los subscriptions
  */
  private _subscriptions = new Subscription();

  /**
   * Metodo donde se inyectan las dependencias del componente.
   */
  constructor(
  ) { }
  /**
  * inicializador del componente
  */
  ngOnInit(): void {
  }
  /**
   * Metodo donde se destruye el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
