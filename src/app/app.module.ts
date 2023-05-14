import { InitService } from './core/services/init.service';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './core/guard/auth.guard';
import { LayoutModule } from './views/layout/layout.module';

import { AppComponent } from './app.component';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';

import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSvgModule } from 'ngx-svg';

import { registerLocaleData } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoaderInterceptor } from '@shared/interceptors/loader.interceptor';
import { LoaderService } from '@shared/services/loader.service';
import { WindowRef } from '@shared/services/windowref';
import { NgxSpinnerModule } from "ngx-spinner";

import localeEsCo from '@angular/common/locales/es-CO';
import { CoreModule } from '@core/core.module';
import { ParametrizacionService } from '@core/services/maestro-general/parametrizacion.service';
import { InterceptorService } from './core/interceptors/interceptor.service';
import { GeneralModule } from './views/pages/general/general.module';
import { NotificacionesService } from '@core/services/notificaciones.service';
registerLocaleData(localeEsCo, 'es-Co');

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    NgxSvgModule,
    // Adicionales a la plantilla
    NgxSpinnerModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter,
      }
    }),
    GeneralModule,
    CoreModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    AuthGuard,
    {
      provide: LOCALE_ID, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: 'es-Co'
    },
    WindowRef,
    LoaderService,
    ParametrizacionService,
    InitService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    NotificacionesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
