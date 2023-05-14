import { Directive, ElementRef, Input } from '@angular/core';
import Inputmask from 'inputmask';


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appRestrictInput]',
})
export class RestrictInputDirective {
  private regexMap = {
    integer: '^[0-9]*$',
    integerminone: '^[1-9][0-9]*$',
    float: '^[+-]?([0-9]*[.])?[0-9]+$',
    words: '^[a-zA-Z]*$',
    wordsAndSpace: '^[a-zA-Z ñÑáéíóú]*$',
    alphanumericAndSpace: '^[a-zA-Z0-9 ñÑáéíóú]*$',
    alphanumeric: '^[a-zA-Z0-9]*$',
    identification: '^[a-zA-Z0-9-]*$',
    point25: '^-?[0-9]*(?:\\.25|\\.50|\\.75|)$',
    streetAddress: '^[a-zA-Z0-9- #]*$',
    email: '^[a-zA-Z0-9@._-]*$',
  };

  constructor(private el: ElementRef) {}

  @Input('appRestrictInput')
  public set defineInputType(type: string) {
    if (this.regexMap[type] !== undefined) {
      Inputmask({ regex: this.regexMap[type], placeholder: '' }).mask(
        this.el.nativeElement
      );
    } else {
      Inputmask({ regex: type, placeholder: '' }).mask(this.el.nativeElement);
    }
  }
}
