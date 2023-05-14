import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { CheckPermissionModule } from '@shared/components/check-permission/check-permission.module';
import { SharedModule } from '@shared/shared.module';
import { PermisoModel } from './models/permiso.model';
import { PermisoService } from './services/permiso.service';
import { PermisoEffects } from './store/effects/permiso.effects';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PermisoEffects]),
    SharedModule,
    TranslateModule,
    CheckPermissionModule,
  ],
  providers: [
    PermisoService,
    PermisoModel
  ]
})
export class PermisosModule { }
