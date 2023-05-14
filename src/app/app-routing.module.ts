import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { BaseComponent } from './views/layout/base/base.component';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'auth/login', pathMatch: 'full'
  },
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'home',
    component: BaseComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        data: {
          title: 'Dashboard',
          breadcrumbs: 'Dashboard'
        },
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'maestros-sistema',
        data: {
          title: 'Maestros del Sistema',
          breadcrumbs: 'Parametrización'
        },
        loadChildren: () => import('./views/pages/maestros-generales/maestros-generales.module').then(m => m.MaestrosGeneralesModule),
      },
      {
        path: 'gestion-documental',
        data: {
          title: 'Gestión Documental',
          breadcrumbs: 'Gestión Documental'
        },
        loadChildren: () => import('./views/pages/gestion-documental/gestion-documental.module').then(m => m.GestionDocumentalModule),
      },
      {
        path: 'seguridad/empresas',
        loadChildren: () => import('./views/pages/seguridad/empresas/empresas.module').then(m => m.EmpresasModule),
        data: {
          title: 'Empresas',
          breadcrumbs: 'Empresas'
        }
      }
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
