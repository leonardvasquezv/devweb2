import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';

@Pipe({
  name: 'HidePasswordOrEmail'
})
export class HidePhoneOrEmail implements PipeTransform {

  constructor() { }

  transform(cadena: string) {
    if (isNullOrUndefined(cadena)) {
      return cadena;
    }
    if (cadena.includes('@')) {
      const cadenaEmail = cadena.slice(cadena.indexOf('@'), cadena.length);
      const cadenaUsuario = cadena.slice(0, cadena.indexOf('@'));
      return cadenaUsuario.slice(0, 4) + cadenaUsuario.slice(4, cadenaUsuario.length).replace(/./g, '*') + cadenaEmail;
    } else {
      return cadena.slice(0, cadena.length - 4).replace(/./g, '*') + cadena.slice(cadena.length - 4, cadena.length);
    }
  }
}
