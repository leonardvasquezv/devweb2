import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@core/material.module';
import { CrearEdsService } from '@core/services/crear-eds.service';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { CrearEdsModel } from '../crear-eds/models/crear-eds.model';
import { ListarGeoreferenciacionModel } from '../dashboard/georeferenciacion/listar-georeferenciacion/model/listar-georeferenciacion.model';
import { FormCrearEdsModule } from '../form-crear-eds/form-crear-eds.module';
import { ConsultaCrearEdsComponent } from './consulta-crear-eds.component';

/**
*  iniciar la constante ruta
*/
const routes: Routes = [
  {
    path: '',
    component: ConsultaCrearEdsComponent
  }
]

@NgModule({
  declarations: [
    ConsultaCrearEdsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    TranslateModule,
    SharedModule,
    FormCrearEdsModule,
    NgbProgressbarModule

  ],
  providers: [
    CrearEdsModel,
    CrearEdsService,
    ListarGeoreferenciacionModel
  ]
})
export class ConsultaCrearEdsModule { }
