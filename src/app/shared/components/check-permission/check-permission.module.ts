import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SeguridadService } from '@core/services/seguridad.service';
import { CheckPermissionDirective } from './check-permission.directive';


@NgModule({
  declarations: [CheckPermissionDirective],
  imports: [
    CommonModule,
  ],
  exports: [CheckPermissionDirective],
  providers: [
    SeguridadService
  ]
})
export class CheckPermissionModule { }
