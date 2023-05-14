import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentAnimateDirective } from '@core/content-animate/content-animate.directive';
import { FeahterIconModule } from '@core/feather-icon/feather-icon.module';
import { MaterialModule } from '@core/material.module';
import { NotificacionModel } from '@core/model/notificaciones.model';
import { BreadcrumbsModule } from '@exalif/ngx-breadcrumbs';
import { NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { BaseComponent } from './base/base.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [BaseComponent, NavbarComponent, SidebarComponent, FooterComponent, ContentAnimateDirective, BreadcrumbsComponent],
  imports: [
    CommonModule,
    BreadcrumbsModule.forRoot({
      postProcess: null,
      applyDistinctOn: 'text',
    }),
    RouterModule,
    FormsModule,
    MaterialModule,
    NgbDropdownModule,
    NgbCollapseModule,
    PerfectScrollbarModule,
    FeahterIconModule,
    SharedModule,
    TranslateModule,
    NgbTooltipModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    NotificacionModel
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }
