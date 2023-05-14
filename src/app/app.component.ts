import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EdSoft';


  /**
  * Constructor de la clase inicial
  * @param _store dependencia para manejar los objetos de estado redux
  * @param _iconRegistry dependencia para acceder a las propiedades de registro de rutas
  * @param _sanitizer depenencia para acceder a las propiedades del DOM
  */
  constructor(
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
  ) {
    this.registerIcons();
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
  }




  /**
   * Metodo encargado de registrar los iconos en el sistema
   */
  private registerIcons(): void {
    this._iconRegistry.addSvgIcon('1', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-feather-info.svg'));
    this._iconRegistry.addSvgIcon('2', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-ios-close2.svg'));
    this._iconRegistry.addSvgIcon('3', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/arrow-breadcrum.svg'));
    this._iconRegistry.addSvgIcon('4', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-eye.svg'));
    this._iconRegistry.addSvgIcon('5', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-close-circle.svg'));
    this._iconRegistry.addSvgIcon('6', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-ionic-ios-alert.svg'));
    this._iconRegistry.addSvgIcon('7', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/1.svg'));
    this._iconRegistry.addSvgIcon('8', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/2.svg'));
    this._iconRegistry.addSvgIcon('9', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-ionic-ios-close-circle-outline.svg'));
    this._iconRegistry.addSvgIcon('10', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/130.svg'));
    this._iconRegistry.addSvgIcon('11', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon awesome-check-circle - White.svg'));
    this._iconRegistry.addSvgIcon('12', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/alert.svg'));
    this._iconRegistry.addSvgIcon('13', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/loading.svg'));
    this._iconRegistry.addSvgIcon('14', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/148.svg'));
    this._iconRegistry.addSvgIcon('15', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/warning.svg'));
    this._iconRegistry.addSvgIcon('16', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Elipse_820.svg'));
    this._iconRegistry.addSvgIcon('17', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-check.svg'));
    this._iconRegistry.addSvgIcon('18', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-proceso-documentos.svg'));
    this._iconRegistry.addSvgIcon('19', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-notificacion-active.svg'));
    this._iconRegistry.addSvgIcon('20', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-notificacion-inactive.svg'));
    this._iconRegistry.addSvgIcon('21', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-alerta.svg'));
    this._iconRegistry.addSvgIcon('22', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-carga.svg'));
    this._iconRegistry.addSvgIcon('23', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-descarga.svg'));
    this._iconRegistry.addSvgIcon('24', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-eliminar.svg'));
    this._iconRegistry.addSvgIcon('25', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-calendar-active.svg'));
    this._iconRegistry.addSvgIcon('26', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-calendar-inactive.svg'));
    this._iconRegistry.addSvgIcon('27', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icono_check_circle_green.svg'));
    this._iconRegistry.addSvgIcon('28', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-add.svg'));
    this._iconRegistry.addSvgIcon('29', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-feather-arrow-down-circle.svg'));
    this._iconRegistry.addSvgIcon('30', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-selector-color.svg'));
    this._iconRegistry.addSvgIcon('31', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/edit.svg'));
    this._iconRegistry.addSvgIcon('32', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/upload-file2.svg'));
    this._iconRegistry.addSvgIcon('33', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-feather-arrow-down-circle.svg'));
    this._iconRegistry.addSvgIcon('34', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/Icon-Document.svg'));
    this._iconRegistry.addSvgIcon('35', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/35.svg'));
    this._iconRegistry.addSvgIcon('36', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/36.svg'));
    this._iconRegistry.addSvgIcon('37', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/37.svg'));
    this._iconRegistry.addSvgIcon('38', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/38.svg'));
    this._iconRegistry.addSvgIcon('39', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/39.svg'));
    this._iconRegistry.addSvgIcon('40', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/button-add.svg'));
    this._iconRegistry.addSvgIcon('41', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icono-logo-FendiPetroleo.svg'));
    this._iconRegistry.addSvgIcon('42', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/logo.png'));
    this._iconRegistry.addSvgIcon('43', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/43.svg'));
    this._iconRegistry.addSvgIcon('44', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/44.svg'));
    this._iconRegistry.addSvgIcon('45', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/45.svg'));
    this._iconRegistry.addSvgIcon('46', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/icon-navigator.svg'));
    this._iconRegistry.addSvgIcon('112', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/112.svg'));
    this._iconRegistry.addSvgIcon('125', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/125.svg'));
    this._iconRegistry.addSvgIcon('129', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/129.svg'));
    this._iconRegistry.addSvgIcon('130', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/130.svg'));
    this._iconRegistry.addSvgIcon('131', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/131.svg'));
    this._iconRegistry.addSvgIcon('146', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/146.svg'));
    this._iconRegistry.addSvgIcon('147', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/147.svg'));
    this._iconRegistry.addSvgIcon('148', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/148.svg'));
    this._iconRegistry.addSvgIcon('112', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/112.svg'));
    this._iconRegistry.addSvgIcon('125', this._sanitizer.bypassSecurityTrustResourceUrl('assets/images/svg/125.svg'));
  }
}