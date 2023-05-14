import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@shared/services/utils.service';

@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.component.html',
  styleUrls: ['./view-dashboard.component.scss']
})
export class ViewDashboardComponent implements OnInit {

  /**
   * Metodo donde se inyectan las dependencias del componente.
   * @param _utilsService Accede a los metodos del servicio de utilidades
   */
  constructor(
    private _utilsService: UtilsService
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this._utilsService.setBreadCrumb('', null, false, 'Dashboard');
  }

}
