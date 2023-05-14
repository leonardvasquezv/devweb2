import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'MaxCharapters'
})
export class MaxCharaptersPipe implements PipeTransform {

    constructor() { }

    transform(cadena: string, size: number) {
        if (cadena?.length > size) {
            cadena = cadena.slice(0, size) + '...';
        }
        return cadena;
    }
}
