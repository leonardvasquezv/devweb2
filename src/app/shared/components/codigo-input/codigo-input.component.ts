import { Component, ElementRef, OnInit, Output, Input, EventEmitter, ViewChildren, QueryList, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { GeneralUtils } from '@core/utils/general-utils';

@Component({
  selector: 'app-codigo-input',
  templateUrl: './codigo-input.component.html',
  styleUrls: ['./codigo-input.component.scss']
})
export class CodigoInputComponent implements OnInit {

  /**
   * define los elementos de DOM
   */
  @ViewChildren('valorElement') valorElements: QueryList<ElementRef>;

  /**
   * Tamaño del codigo de verificación
   */
  @Input() codeSize: number;

  /**
   * Define la salida del codigo de verificacion
   */
  @Output() codigoEmit = new EventEmitter();

  /**
   * Propiedad que describe el formulario de restablecer contraseña
   */
  public formGroupCodigo = new FormArray([]) as any;

  /**
   * Metodo encargado de construir el formulario de ingreso
   * de codigo de verificacion
   */
  constructor() { }

  /**
   * Metodo encargado de inicializar en componente de
   * codigo de verificacion
   */
  ngOnInit(): void {
    this.formGroupDefine();
  }

  /**
   * Metodo encargado de añadir controles según el tamaño del codigo
   */
  private formGroupDefine(): void {
    for (let index = 0; index < this.codeSize; index++) {
      this.formGroupCodigo.push(new FormControl(''));
    }
  }

  /**
   * metodo utilizado para manejar los campos del codigo
   * @param event accede a los eventos del input
   * @param index del input que se está realizando el cambio
   */
  public onKeyUp(event, index): void {
    const validaNumero = new RegExp(GeneralUtils.obtenerExpresionRegular('integer'));
    const res = validaNumero.test(event.key);
    if (res === true || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace') {
      if ((event.key === 'Backspace' && event.target.value.length === 0) || event.key === 'ArrowLeft') {
        if (index > 0) this.setFocus(index - 1);
      } else if (event.key !== 'Delete') {
        if (index < (this.codeSize - 1)) this.setFocus(index + 1);
      }

      let codigo = '';
      let cont = 0;

      this.formGroupCodigo.value.forEach(element => {
        codigo += element;
        if (element !== '') cont++
      });

      if (cont === this.codeSize) this.codigoEmit.emit(codigo);
      event.stopPropagation();
    }
  }

  /**
   * Metodo que realiza accion despues de escuchar un evento en los capos del codigo
   * @param index del input
   */
  private setFocus(index): void {
    this.valorElements['_results'][index].nativeElement.focus();
  }

}
