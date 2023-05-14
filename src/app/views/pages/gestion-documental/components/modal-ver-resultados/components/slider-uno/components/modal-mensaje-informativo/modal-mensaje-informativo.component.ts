import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-mensaje-informativo',
  templateUrl: './modal-mensaje-informativo.component.html',
  styleUrls: ['./modal-mensaje-informativo.component.scss']
})
export class ModalMensajeInformativoComponent implements OnInit {

  /**
   * Variable encargada de manejar el titulo dependiendo del puntaje obtenido
   */
  public titulo: string;

  /**
   * Variable encargada de manejar la recomendación dependiendo del puntaje obtenido
   */
  public recomendacion: string;

  /**
   * Método donde se inyectan las dependencias
   * @param _translateService Servicio para traducciones
   * @param MAT_DIALOG_DATA Inyección del servicio de modales
   */
  constructor(
    private _translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) private resultado: { puntajeObtenido: number}
  ) { }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.iniciarValores();
  }


  /**
   * Método encargado de iniciar los valores del modal
   */
  public iniciarValores(): void{
    if(this.resultado.puntajeObtenido < 60){
      this.titulo = this._translateService.instant('TITULOS.RESULTADO_CRITICO');
      this.recomendacion = this._translateService.instant('TITULOS.RECOMENDACION_CRITICO')
    }else if(this.resultado.puntajeObtenido >= 60 && this.resultado.puntajeObtenido <= 85){
      this.titulo = this._translateService.instant('TITULOS.RESULTADO_MODERADAMENTE_ACEPTABLE');
      this.recomendacion = this._translateService.instant('TITULOS.RECOMENDACION_MODERADAMENTE_ACEPTABLE')
    }else{
      this.titulo = this._translateService.instant('TITULOS.RESULTADO_ACEPTABLE');
      this.recomendacion = this._translateService.instant('TITULOS.RECOMENDACION_ACEPTABLE');
    }
  }

}
