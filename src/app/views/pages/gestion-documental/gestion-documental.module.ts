import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@core/material.module';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HighchartsChartModule } from 'highcharts-angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CargarArchivoModalComponent } from './components/cargar-archivo-modal/cargar-archivo-modal.component';

import { SharedModule } from '@shared/shared.module';
import { ModalVerResultadosService } from './components/modal-ver-resultados/services/modal-ver-resultados.service';
import { GestionDocumentalRoutingModule } from './gestion-documental-routing.module';
import { GestionDocumentalService } from './gestion-documental.service';

import { EdsModel } from '@core/model/eds.model';
import { ModalVerResultadosModel } from './components/modal-ver-resultados/models/modal-ver-resultados.model';
import { GestionDocumentalModel } from './models/gestion-documental.model';

import { EdsEffects } from '@core/store/effects/eds.effects';
import { AlertaEffects } from './store/effects/alerta.effects';
import { ArchivoEffects } from './store/effects/archivo.effects';
import { DocumentoEffects } from './store/effects/documento.effects';
import { ProcesoEffects } from './store/effects/proceso.effects';
import { ResultadoEvaluacionEffects } from './store/effects/resultadoEvaluacion.effects';

import { DirectivesModule } from '@core/directives/directives.module';
import { NotificacionModel } from '@core/model/notificaciones.model';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { TipoParametrizacionService } from '@core/services/maestro-general/tipo-parametrizacion.service';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CheckPermissionModule } from '@shared/components/check-permission/check-permission.module';
import { CrearDocumentoComponent } from './components/crear-documento/crear-documento.component';
import CrearProcesoModalComponent from './components/crear-proceso-modal/crear-proceso-modal.component';
import { HistorialModalComponent } from './components/historial-modal/historial-modal.component';
import { ListarAlertasComponent } from './components/listar-alertas/listar-alertas.component';
import { SliderDosComponent } from './components/modal-ver-resultados/components/slider-dos/slider-dos.component';
import { SliderTresComponent } from './components/modal-ver-resultados/components/slider-tres/slider-tres.component';
import { ModalMensajeInformativoComponent } from './components/modal-ver-resultados/components/slider-uno/components/modal-mensaje-informativo/modal-mensaje-informativo.component';
import { ModalRegistrarComponent } from './components/modal-ver-resultados/components/slider-uno/components/modal-registrar/modal-registrar.component';
import { SliderUnoComponent } from './components/modal-ver-resultados/components/slider-uno/slider-uno.component';
import { ModalVerResultadosComponent } from './components/modal-ver-resultados/modal-ver-resultados.component';
import { TabsProcesoComponent } from './components/tabs-proceso/tabs-proceso.component';
import { VistasGestionDocumentalComponent } from './components/vistas-gestion-documental/vistas-gestion-documental.component';
import { GestionDocumentalComponent } from './gestion-documental.component';

@NgModule({
  declarations: [
    CrearProcesoModalComponent,
    TabsProcesoComponent,
    GestionDocumentalComponent,
    CargarArchivoModalComponent,
    ModalVerResultadosComponent,
    SliderUnoComponent,
    SliderDosComponent,
    SliderTresComponent,
    VistasGestionDocumentalComponent,
    CrearDocumentoComponent,
    ModalMensajeInformativoComponent,
    HistorialModalComponent,
    ModalRegistrarComponent,
    ListarAlertasComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule,
    GestionDocumentalRoutingModule,
    FormsModule,
    HighchartsChartModule,
    UiSwitchModule,
    TranslateModule,
    MaterialModule,
    CheckPermissionModule,
    EffectsModule.forFeature([
      ProcesoEffects,
      EdsEffects,
      DocumentoEffects,
      AlertaEffects,
      ArchivoEffects,
      ResultadoEvaluacionEffects
    ]),
    NgbModule,
    NgxDatatableModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    SharedModule,
    ColorPickerModule,
    DirectivesModule
  ],
  exports: [CrearProcesoModalComponent],
  providers: [
    EdsModel,
    GestionDocumentalService,
    GestionDocumentalModel,
    ModalVerResultadosModel,
    ModalVerResultadosService,
    TipoParametrizacionService,
    TipoParametrizacionModel,
    NotificacionModel
  ],
})
export class GestionDocumentalModule { }
