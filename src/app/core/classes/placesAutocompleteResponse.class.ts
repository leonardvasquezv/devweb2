/**
 * Clase utilizada para definir la estructura de la respuesta brindada por la API de Place Autocomplete
 */
export class PlaceAutocompleteResponse{

    /**
     * Variable que contiene un array de predicciones
     */
    public predictions: Array<google.maps.places.AutocompletePrediction>

    /**
     * Variable que contiene el estado de la petición realizada al api de Places
     */
    public status: string;

    /**
     * Variable que contiene los errores de la petición a la API de Places
     */
     public error_message: string;


     /**
     * Metodo donde se inyectan las dependencias
     * @param status Estado de la peticion
     * @param predictions Resultados de la peticion
     */
    constructor(status: string, predictions: google.maps.places.AutocompletePrediction[]){
        this.status = status;
        this.predictions = predictions;
    }
}