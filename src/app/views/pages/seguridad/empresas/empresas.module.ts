import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@core/material.module';
import { GlobalModel } from '@core/model/global.model';
import { ParametrizacionModel } from '@core/model/parametrizacion.model';
import { SeguridadModel } from '@core/model/seguridad.model';
import { ParametrizacionService } from '@core/services/maestro-general/parametrizacion.service';
import { UbicacionService } from '@core/services/ubicacion.service';
import { ParametrizacionEffects } from '@core/store/effects/parametrizacion.effects';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { CheckPermissionModule } from '@shared/components/check-permission/check-permission.module';
import { SharedModule } from '@shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UsuarioModel } from '../usuarios/models/usuario.model';
import { UsuarioService } from '../usuarios/services/usuario.service';
import { UsuarioEffects } from '../usuarios/store/effects/usuario.effects';
import { CrearEmpresaComponent } from './components/crear-empresa/crear-empresa.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { FormularioInformacionEmpresaComponent } from './components/formulario-informacion-empresa/formulario-informacion-empresa.component';
import { FormularioPerfilComponent } from './components/formulario-perfil/formulario-perfil.component';
import { ListarEdsComponent } from './components/listar-eds/listar-eds.component';
import { ListarEmpresaComponent } from './components/listar-empresa/listar-empresa.component';
import { ListarPerfilComponent } from './components/listar-perfil/listar-perfil.component';
import { ListarUsuarioComponent } from './components/listar-usuario/listar-usuario.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EmpresasRoutingModule } from './empresas-routing.module';
import { EmpresasComponent } from './empresas.component';
import { EmpresaModel } from './models/empresa.model';
import { EmpresaService } from './services/empresa.service';
import { EmpresaEffects } from './store/effects/empresa.effects';
import { PermisoComponent } from './components/permiso/permiso.component';
import { ListarPermisoComponent } from './components/listar-permiso/listar-permiso.component';


@NgModule({
  declarations: [
    EmpresasComponent,
    CrearEmpresaComponent,
    ListarEmpresaComponent,
    FormularioInformacionEmpresaComponent,
    PerfilComponent,
    ListarPerfilComponent,
    ListarUsuarioComponent,
    FormularioPerfilComponent,
    CrearUsuarioComponent,
    ListarEdsComponent,
    PermisoComponent,
    ListarPermisoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmpresasRoutingModule,
    NgxDatatableModule,
    EffectsModule.forFeature([UsuarioEffects, EmpresaEffects, ParametrizacionEffects]),
    TranslateModule,
    UiSwitchModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CheckPermissionModule,
    NgbTooltipModule
  ],
  providers: [
    FormGroupDirective,
    EmpresaService,
    EmpresaModel,
    ParametrizacionModel,
    ParametrizacionService,
    GlobalModel,
    UbicacionService,
    UsuarioService,
    UsuarioModel,
    SeguridadModel
  ]
})
export class EmpresasModule { }
