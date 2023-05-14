import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ParametrizacionModel } from '@core/model/parametrizacion.model';
import { ParametrizacionService } from '@core/services/maestro-general/parametrizacion.service';
import { ParametrizacionEffects } from '@core/store/effects/parametrizacion.effects';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { CheckPermissionModule } from '@shared/components/check-permission/check-permission.module';
import { SharedModule } from '@shared/shared.module';
import { UsuarioModel } from './models/usuario.model';
import { UsuarioService } from './services/usuario.service';
import { UsuarioEffects } from './store/effects/usuario.effects';



@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([UsuarioEffects, ParametrizacionEffects]),
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
    CheckPermissionModule
  ],
  providers: [
    UsuarioService,
    UsuarioModel,
    ParametrizacionModel,
    ParametrizacionService
  ]
})
export class UsuariosModule { }
