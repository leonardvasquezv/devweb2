/**
 * Interface para manejar los campos a validar 
 */

export interface ECamposValidar{
  UserNameBack :string,
  UserNameForm :string,
  EmailBack:string,
  EmailForm:string,
  IdentificacionBack:string,
  IdentificacionForm:string,
}

/**
* Objeto estandar de los campos a validar 
*/
export const ObjCamposValidar: ECamposValidar = {
  UserNameBack :'UserName',
  UserNameForm : 'userName',
  EmailBack:'Email',
  EmailForm:'email',
  IdentificacionBack:'Identificacion',
  IdentificacionForm:'identificacion'
}