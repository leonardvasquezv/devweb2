import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes,RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';

import { SharedModule } from '@shared/shared.module';


import { ParametrizacionTipoDetalleComponent } from './parametrizacion-tipo-detalle/parametrizacion-tipo-detalle.component';
import { MaterialModule } from 'src/app/core/material.module';

import { ParametrizacionModel } from '@core/model/parametrizacion.model';
import { ParametrizacionService } from '@core/services/maestro-general/parametrizacion.service';
import { ParametrizacionFormComponent } from './components/parametrizacion-form/parametrizacion-form.component';
import { ParametrizacionFormularioModel } from './components/parametrizacion-form/models/parametrizacion-formulario.model';
import { ParametrizacionFormularioService } from './components/parametrizacion-form/services/parametrizacion-formulario.service';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { TipoParametrizacionService } from '@core/services/maestro-general/tipo-parametrizacion.service';
import { EffectsModule } from '@ngrx/effects';
import { TipoParametrizacionEffects } from '@core/store/effects/tipo-parametrizacion.effects';
import { ParametrizacionEffects } from '@core/store/effects/parametrizacion.effects';



const routes: Routes = [
  {
    path: '',
    component: ParametrizacionTipoDetalleComponent
  }
]

@NgModule({
  declarations: [
    ParametrizacionTipoDetalleComponent,
    ParametrizacionFormComponent,
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      TipoParametrizacionEffects,
      ParametrizacionEffects
    ]),
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgxDatatableModule,
    UiSwitchModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    ParametrizacionModel,
    ParametrizacionService,
    TipoParametrizacionModel,
    TipoParametrizacionService,
    ParametrizacionFormularioModel,
    ParametrizacionFormularioService
  ]
})
export class MaestrosGeneralesModule { }
