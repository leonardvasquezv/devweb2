/**
 * Interface de departamentos
 */
export interface Departamento {
    nombre: string;
    idDepartamento: number;
    EstadoRegistro?:string;
    FechaCreacion?:Date;
    IdPais?:number
}