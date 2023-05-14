import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '@core/material.module';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { CheckPermissionModule } from '@shared/components/check-permission/check-permission.module';
import { SharedModule } from '@shared/shared.module';
import { PerfilModel } from './models/perfil.model';
import { PerfilService } from './services/perfil.service';
import { PerfilEffects } from './store/effects/perfil.effects';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    EffectsModule.forFeature([PerfilEffects]),
    TranslateModule,
    SharedModule,
    CheckPermissionModule,
  ],
  providers: [
    PerfilService,
    PerfilModel
  ]
})
export class PerfilesModule { }
