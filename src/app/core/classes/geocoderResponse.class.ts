/**
 * Clase utilizada para definir la estructura de la respuesta brindada por la API de Geocode
 */
export class GeocoderResponse{
    /**
     * Variable que contiene el estado de la peticion a la API de Geocode
     */
    public status: string;

    /**
     * Variable que contiene los errores de la petición a la API de Geocode
     */
    public error_message: string;

    /**
     * Variable que contiene los resultados de la petición a la API de Geocode
     */
    public results: google.maps.GeocoderResult[];


    /**
     * Metodo donde se inyectan las dependencias
     * @param status Estado de la peticion
     * @param results Resultados de la peticion
     */
    constructor(status: string, results: google.maps.GeocoderResult[]){
        this.status = status;
        this.results = results;
    }
}