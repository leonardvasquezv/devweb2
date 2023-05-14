import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearEmpresaComponent } from './components/crear-empresa/crear-empresa.component';
import { ListarEmpresaComponent } from './components/listar-empresa/listar-empresa.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Empresas',
      breadcrumbs: 'Empresas',
    },
    component: ListarEmpresaComponent
  },
  {
    path: 'crear',
    data: {
      title: 'Crear Empresa',
      breadcrumbs: 'Crear Empresa',
    },
    component: CrearEmpresaComponent
  },
  {
    path: 'editar/:id',
    component: CrearEmpresaComponent,
    data: {
      title: 'Editar Empresa',
      breadcrumbs: 'Editar Empresa'
    }
  },
  {
    path: 'consultar/:id',
    component: CrearEmpresaComponent,
    data: {
      title: 'Consultar Empresa',
      breadcrumbs: 'Consultar Empresa'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule { }
