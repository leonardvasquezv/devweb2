import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MaterialModule } from '@core/material.module';
import { EdsModel } from '@core/model/eds.model';
import { ParametrizacionModel } from '@core/model/parametrizacion.model';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { ParametrizacionService } from '@core/services/maestro-general/parametrizacion.service';
import { TipoParametrizacionService } from '@core/services/maestro-general/tipo-parametrizacion.service';
import { ParametrizacionEffects } from '@core/store/effects/parametrizacion.effects';
import { TipoParametrizacionEffects } from '@core/store/effects/tipo-parametrizacion.effects';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ParametrizacionFormularioModel } from '../maestros-generales/components/parametrizacion-form/models/parametrizacion-formulario.model';
import { ParametrizacionFormularioService } from '../maestros-generales/components/parametrizacion-form/services/parametrizacion-formulario.service';
import { FiltroDireccionesComponent } from './formulario-datos-basicos/components/filtro-direcciones/filtro-direcciones.component';
import { ModalBuscarDireccionComponent } from './formulario-datos-basicos/components/modal-buscar-direccion/modal-buscar-direccion.component';
import { ModalCrearServicioComponent } from './formulario-datos-basicos/components/modal-crear-servicio/modal-crear-servicio.component';
import { FormularioDatosBasicosComponent } from './formulario-datos-basicos/formulario-datos-basicos.component';
import { FormularioEmpresaAsociadaComponent } from './formulario-empresa-asociada/formulario-empresa-asociada.component';
import { InformacionSGSSTComponent } from './informacion-sg-sst/informacion-sg-sst.component';
import { ServiciosEdsComponent } from './servicios-eds/servicios-eds.component';



@NgModule({
  declarations: [
    FormularioEmpresaAsociadaComponent,
    FormularioDatosBasicosComponent,
    ServiciosEdsComponent,
    InformacionSGSSTComponent,
    ModalBuscarDireccionComponent,
    FiltroDireccionesComponent,
    ModalCrearServicioComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([
      TipoParametrizacionEffects,
      ParametrizacionEffects
    ]),
    FormsModule,
    GoogleMapsModule,
    MaterialModule,
    NgxDatatableModule,
    TranslateModule,
    SharedModule,
    UiSwitchModule,
    NgbTooltipModule
  ],
  exports: [
    FormularioEmpresaAsociadaComponent,
    FormularioDatosBasicosComponent,
    ServiciosEdsComponent,
    InformacionSGSSTComponent,

  ],
  providers: [
    EdsModel,
    ParametrizacionModel,
    ParametrizacionService,
    TipoParametrizacionModel,
    TipoParametrizacionService,
    ParametrizacionFormularioModel,
    ParametrizacionFormularioService
  ]
})
export class FormCrearEdsModule { }
