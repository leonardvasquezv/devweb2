import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmpresaModel } from './../../models/empresa.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  /**
  * Define el form group de informacion del perfil
  */
  public formGroupPerfil: FormGroup;
  /**
   * Constructor del componente de perfil
   * @param _empresaModel inyeccion del modelo de empresa
   */
  constructor(
    private _empresaModel: EmpresaModel,
  ) { }

  /**
   * Metodo encargado de inicializar el componente de perfil
   */
  ngOnInit(): void {
    this.obtenerPaginas();
  }

  /**
  * Metodo encargado de obtener las paginas
  */
  public obtenerPaginas(): void {
    this._empresaModel.obtenerPaginasPorCriterios([{ campo: 'estadoRegistro', valor: 'A' }]);
    this._empresaModel.obtenerPermisosPorCriterios([{ campo: 'estadoRegistro', valor: 'A' }]);
  }

}
