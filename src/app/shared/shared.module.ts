import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@core/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { CodigoInputComponent } from '@shared/components/codigo-input/codigo-input.component';
import { ModalEstadoRegistroComponent } from '@shared/components/modal-estado-registro/modal-estado-registro.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CheckPermissionModule } from './components/check-permission/check-permission.module';
import { FiltrosConsultaComponent } from './components/filtros-consulta/filtros-consulta.component';
import { FiltrosComponent } from './components/filtros/filtros.component';
import { InfoConsultaComponent } from './components/info-consulta/info-consulta.component';
import { ModalTiposComponent } from './components/modal-tipos/modal-tipos.component';
import { MultiselectAutocompleteComponent } from './components/multiselect-autocomplete/multiselect-autocomplete.component';
import { PagerComponent } from './components/pager/pager.component';
import { TreeComponent } from './components/tree/tree.component';
import { RestrictInputDirective } from './directives/regex.restrict.directive';
import { FirstLetterUpperPipe } from './pipes/first-letter-upper.pipe';
import { HidePhoneOrEmail } from './pipes/hide-phone-email.pipe';
import { MaxCharaptersPipe } from './pipes/max-charapters.pipe';


@NgModule({
  declarations: [
    FiltrosConsultaComponent,
    ModalTiposComponent,
    RestrictInputDirective,
    FiltrosComponent,
    PagerComponent,
    MultiselectAutocompleteComponent,
    FiltrosComponent,
    CodigoInputComponent,
    HidePhoneOrEmail,
    TreeComponent,
    ModalEstadoRegistroComponent,
    InfoConsultaComponent,
    MaxCharaptersPipe,
    FirstLetterUpperPipe,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    TranslateModule
  ],
  exports: [
    TreeComponent,
    FiltrosConsultaComponent,
    ModalTiposComponent,
    RestrictInputDirective,
    FiltrosComponent,
    PagerComponent,
    MultiselectAutocompleteComponent,
    FiltrosComponent,
    CodigoInputComponent,
    HidePhoneOrEmail,
    ModalEstadoRegistroComponent,
    InfoConsultaComponent,
    MaxCharaptersPipe,
    FirstLetterUpperPipe,
    ChangePasswordComponent
  ]
})
export class SharedModule { }
