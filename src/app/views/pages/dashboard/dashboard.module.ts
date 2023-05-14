import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';

// Ng-ApexCharts
import { NgApexchartsModule } from "ng-apexcharts";

// Ng2-charts
import { ChartsModule } from 'ng2-charts';

import { GoogleMapsModule } from '@angular/google-maps';
import { EdsModel } from '@core/model/eds.model';
import { EdsEffects } from '@core/store/effects/eds.effects';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MaterialModule } from 'src/app/core/material.module';
import { CrearEdsService } from '../../../core/services/crear-eds.service';
import { CrearEdsModel } from '../crear-eds/models/crear-eds.model';
import { GestionDocumentalService } from '../gestion-documental/gestion-documental.service';
import { GestionDocumentalModel } from '../gestion-documental/models/gestion-documental.model';
import { ViewDashboardComponent } from './components/view-dashboard/view-dashboard.component';
import { DashboardComponent } from './dashboard.component';
import { ListarGeoreferenciacionComponent } from './georeferenciacion/listar-georeferenciacion/listar-georeferenciacion.component';
import { ListarGeoreferenciacionModel } from './georeferenciacion/listar-georeferenciacion/model/listar-georeferenciacion.model';
import { ListadoEdsComponent } from './listado-eds/listado-eds.component';

const routes: Routes = [
  {
    path: '',
    component: ViewDashboardComponent,
  },
  {
    path: 'eds',
    data: {
      title: 'Crear EDS',
      breadcrumbs: 'Crear EDS',
    },
    loadChildren: () => import('../crear-eds/crear-eds.module').then(m => m.CrearEdsModule)
  },
  {
    path: 'eds/consultar/:idEds',
    data: {
      title: 'Consultar EDS',
      breadcrumbs: 'Consultar EDS',
    },
    loadChildren: () => import('../consulta-crear-eds/consulta-crear-eds.module').then((m) => m.ConsultaCrearEdsModule),
  },
]
//TODO:jperez: se debe reestructurar el routing del presente modulo

@NgModule({
  declarations: [DashboardComponent, ListarGeoreferenciacionComponent, ListadoEdsComponent, ViewDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    EffectsModule.forFeature([EdsEffects]),
    FeahterIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgbTooltipModule,
    ChartsModule,
    TranslateModule,
    GoogleMapsModule,
    SharedModule,
    NgxDatatableModule,
    MaterialModule,
    UiSwitchModule
  ],
  providers: [
    ListarGeoreferenciacionModel,
    GestionDocumentalModel,
    GestionDocumentalService,
    EdsModel,
    CrearEdsModel,
    CrearEdsService,
    TitleCasePipe
  ]
})
export class DashboardModule { }
