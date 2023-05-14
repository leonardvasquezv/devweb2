import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@core/material.module';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { CountdownModule } from 'ngx-countdown';
import { AuthComponent } from './auth.component';
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena.component';
import { LoginComponent } from './components/login/login.component';
import { OlvidoContrasenaComponent } from './components/olvido-contrasena/olvido-contrasena.component';
import { AuthModel } from './models/auth.model';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { AuthEffects } from './store/effects/auth.effects';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'cambio-contrasena/:secret',
        component: CambioContrasenaComponent
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthComponent, OlvidoContrasenaComponent, CambioContrasenaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    CountdownModule,
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [
    AuthModel,
    AuthService
  ]
})
export class AuthModule { }
