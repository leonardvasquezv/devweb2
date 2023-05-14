/**
 * respuesta generica de peticiones a la api backend
 */
export interface ResponseWebApi {
    status: boolean,
    message: string,
    data: any,
    meta?: any
}
