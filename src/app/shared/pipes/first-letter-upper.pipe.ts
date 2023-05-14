import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FirstLetterUpper'
})
export class FirstLetterUpperPipe implements PipeTransform {
    /**
     * Constructor de Pipe
     */
    constructor() { }
    
    /**
     * Realiza la función principal del pipe, transformar el texto primer caracter mayuscula y el restante queda en minuscula
     * Método heredado de la implementación de pipeTransform 
     * @param cadena parametro por donde ingresa la caneda que se desea transformar
     * @returns retorna cadena transformada
     */
    public transform(cadena: String):string {
        const tem=cadena.charAt(0).toUpperCase().concat(cadena.substring(1).toLowerCase())
        return tem;
    }
}
