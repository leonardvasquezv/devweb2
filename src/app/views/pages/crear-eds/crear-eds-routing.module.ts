import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearEdsComponent } from './crear-eds.component';

const routes: Routes = [
  {
    path: 'crear',
    pathMatch: 'full',
    data: {
      title: 'Crear EDS',
      breadcrumbs: 'Crear EDS',
    },
    component: CrearEdsComponent,
  },
  {
    path: 'editar/:idEds',
    pathMatch: 'full',
    data: {
      title: 'Editar EDS',
      breadcrumbs: 'Editar EDS',
    },
    component: CrearEdsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearEdsRoutingModule { }
