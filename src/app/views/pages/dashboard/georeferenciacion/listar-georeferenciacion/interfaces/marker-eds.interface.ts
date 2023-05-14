import { DataEds } from "@core/interfaces/data-eds.interface";
import { LatitudLongitud } from "@core/interfaces/latlng.interface";

/**
 * Interface para definir data necesaria de un marcador en el mapa
 */
export interface MarkerEds extends DataEds {
    latLng?: LatitudLongitud;
    markerOption?: google.maps.MarkerOptions;
}