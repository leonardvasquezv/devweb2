import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/core/material.module';
import { CrearEdsService } from '../../../core/services/crear-eds.service';
import { SharedModule } from '../../../shared/shared.module';
import { ListarGeoreferenciacionModel } from '../dashboard/georeferenciacion/listar-georeferenciacion/model/listar-georeferenciacion.model';
import { FormCrearEdsModule } from '../form-crear-eds/form-crear-eds.module';
import { CrearEdsRoutingModule } from './crear-eds-routing.module';
import { CrearEdsComponent } from './crear-eds.component';
import { CrearEdsModel } from './models/crear-eds.model';


/**
*  iniciar la constante ruta
*/
const routes: Routes = [
  {
    path: '',
    component: CrearEdsComponent
  }
]

@NgModule({
  declarations: [
    CrearEdsComponent
  ],
  imports: [
    CommonModule,
    FormCrearEdsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    TranslateModule,
    SharedModule,
    CrearEdsRoutingModule,
    NgbProgressbarModule
  ],

  providers: [
    CrearEdsModel,
    CrearEdsService,
    ListarGeoreferenciacionModel,

  ]

})
export class CrearEdsModule { }
