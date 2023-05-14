import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUtils } from 'src/app/core/utils/auth-utils';
import { PermisosUtils } from 'src/app/core/utils/permisos-utils';
import { MenuItem } from 'src/app/views/layout/sidebar/menu.model';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss']
})
export class BlankComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.redirectFirstPage();
  }

  /**
   * Metodo para redireccionar a la pagina principal
   */
    private redirectFirstPage(): void {
      const menuPaginas: Array<MenuItem> = AuthUtils.crearMenu();    
      if(menuPaginas){
        const primeraPagina: MenuItem = menuPaginas[0].subItems ? menuPaginas[0].subItems[0] : menuPaginas[0];
        PermisosUtils.GuardarPagina(primeraPagina.id);
        this._router.navigate([primeraPagina.link])
      }
    }

}
