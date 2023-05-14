import { SeguridadEffects } from './store/effects/seguridad.effects';
import { SeguridadService } from './services/seguridad.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from './material.module';
import { appReducers } from './store/app.reducers';
import { GlobalEffects } from './store/effects/global.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from "src/environments/environment";
import { HttpBaseService } from './services/base/http-base.service';
import { LoadingService } from './services/loading.service';
import { UbicacionService } from "./services/ubicacion.service";
import { GlobalModel } from "./model/global.model";
import { InitEffects } from './store/effects/init.effects';
import { InitModel } from './model/init.model';
import { InitService } from './services/init.service';
import { SeguridadModel } from './model/seguridad.model';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([GlobalEffects, InitEffects, SeguridadEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
    }),
  ],
  providers: [
    UbicacionService,
    GlobalModel,
    HttpBaseService,
    LoadingService,
    InitModel,
    InitService,
    SeguridadModel,
    SeguridadService
  ]
})
export class CoreModule { }
