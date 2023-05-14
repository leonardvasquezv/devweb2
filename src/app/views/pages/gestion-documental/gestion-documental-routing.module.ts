import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearDocumentoComponent } from './components/crear-documento/crear-documento.component';
import { VistasGestionDocumentalComponent } from './components/vistas-gestion-documental/vistas-gestion-documental.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gestion Documental',
      breadcrumbs: 'Gestion Documental',
    },
    component: VistasGestionDocumentalComponent
  },
  {
    path: 'crear-documento',
    data: {
      title: 'Crear Documento',
      breadcrumbs: 'Crear Documento',
    },
    component: CrearDocumentoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionDocumentalRoutingModule { }
