import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EMensajeModal } from '@core/enum/mensajeModal.enum';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { Empresa } from '@core/interfaces/seguridad/empresa.interface';
import { PermisosUtils } from '@core/utils/permisos-utils';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { UtilsService } from '@shared/services/utils.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { EmpresaModel } from '../../models/empresa.model';

@Component({
  selector: 'app-crear-empresa',
  templateUrl: './crear-empresa.component.html',
  styleUrls: ['./crear-empresa.component.scss']
})
export class CrearEmpresaComponent implements OnInit, OnDestroy, AfterViewChecked {

  /**
   * Instancia de tipos de operacion
   */
  public ETiposOperacion = ETiposOperacion

  /**
    * Define si el formulario se puede editar
    */
  public habilitarEditar:boolean = true;

  /**
    * Define la empresa seleccionado
    */
  public selectedEmpresa: Empresa;

  /**
    * Instancia de suscripciones
    */
  private _suscripciones = new Subscription();

  /**
   * Define le formGroup de empresa
   */
  public formGroupEmpresa: FormGroup;
  
  /**
   * Variable que guarda el codigo SICOM para validar
   */
  
  public codigoSicom: string;
  /**
   * Index del mat tab group
   */
  
  public selectedIndex: number = 0;

  /**
   * Metodo constructor de la clase
   * @param _activedRoute define las propiedades y atributos  de la ruta activa
   * @param _formBuilder inyeccion de referencia del contructor de los formularios
   * @param _utilsService Servicio de utilidades
   * @param _empresaModel modelo de empresa
   * @param _router Servicio para navegar entre paginas
   * @param _changeDetectorRef detector de cambios
   * @param _dialog Servicio que permite abrir un modal
   * @param _translateService inyeccion de metodos de traduccion
   */
  constructor(private _activedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _utilsService: UtilsService,
    private _empresaModel: EmpresaModel,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _dialog: MatDialog,
    private _translateService: TranslateService,
    private _utils: UtilsService
  ) { }

  /**
   * get utilizado para obtener el tipo de operacion
   */
  get tipoOperacion():string {
    return this._activedRoute.snapshot.url[0].path;
  }
  /**
   * get utilizado para obtener el id de la empresa
   */
  get idEmpresa():string{
    return this._activedRoute.snapshot.url[1]?.path;
  }

  /**
   * Get con logica para habilitar/deshabilitar el segundo tab
   * @return true si habilita el tab o false si no
   */
  get habilitarTab(): boolean{
    return Number(this.idEmpresa) > 0 ? (this.formGroupEmpresa.get('formGroupInformacionEmpresa').invalid || (this.formGroupEmpresa.get('formGroupInformacionEmpresa').invalid && this.habilitarEditar)) : this.formGroupEmpresa.get('formGroupInformacionEmpresa').invalid
  }

  /**
   * Metodo donde se destruye el componente
   */
  ngOnDestroy(): void {
    this._suscripciones.unsubscribe();
  }

  /**
   * Metodo donde se inicializa el componente
   */
  ngOnInit(): void {
    this.inicializarFormControl();
    if (this.tipoOperacion === ETiposOperacion.consultar || this.tipoOperacion === ETiposOperacion.editar) {
      this.buscarEmpresaPorId();
    }
    const modoPagina:string=this._activedRoute.snapshot.url[0].path
    this._utilsService.setBreadCrumb(modoPagina===ETiposOperacion.crear ? ETiposOperacion.crear : (modoPagina===ETiposOperacion.editar? ETiposOperacion.editar: ETiposOperacion.consultar)  , 'empresa', true, 'empresa');
  }

  ngAfterViewChecked(): void {
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Función para inicializar formControl
   */
  public inicializarFormControl(): void {
    this.formGroupEmpresa = this._formBuilder.group({
      formGroupInformacionEmpresa: this._formBuilder.group({
        id: [0],
        nombre: [null, Validators.compose([Validators.required])],
        idTipoIdentificacion: [null, Validators.compose([Validators.required])],
        identificacion: [null, Validators.compose([Validators.required])],
        codigoSicom: [null, Validators.compose([Validators.required])],
        estadoRegistro: ['A', Validators.compose([Validators.required])],
        tieneEdsAsociada: [true, Validators.compose([Validators.required])],
        contactoEmpresa: this._formBuilder.group({
          idTercero: [0],
          nombreCompleto: [null, Validators.compose([Validators.required])],
          idTipoDocumento: [null, Validators.compose([Validators.required])],
          numeroDocumento: [null, Validators.compose([Validators.required])],
          correoElectronico: [null, [Validators.required, Validators.pattern('[a-zA-Z0-9._-]+[@]+[a-zA-Z0-9-]+([.][a-zA-Z]{2,4})+')]],
          indicativoTelefono: [null, Validators.compose([Validators.required])],
          telefono: [null, Validators.compose([Validators.required])],
          indicativoCelular: [null, Validators.compose([Validators.required])],
          celular: [null, Validators.compose([Validators.required])],
          idPais: [0, Validators.compose([Validators.required])],
          idDepartamento: [0, Validators.compose([Validators.required])],
          idMunicipio: [0, Validators.compose([Validators.required])],
          direccion: [null, Validators.compose([Validators.required])],

          paisAutoComplete: ['', Validators.compose([Validators.required])],
          departamentoAutoComplete: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
          municipioAutoComplete: [{ value: '', disabled: true }, Validators.compose([Validators.required])]
        }),
        perfiles: []
      }),

      formGroupPerfiles: this._formBuilder.group({
        id: [0],
        nombre: [null, Validators.compose([Validators.required])],
        descripcion: [null, Validators.compose([Validators.required])],
        estadoRegistro: ['A', Validators.compose([Validators.required])],
        perfilesPaginasPermisos: [{ value: [] }],
        usuariosActivos: [null],
        usuariosInactivos: [null],
        usuarios: [{ value: [] }],
        nuevo: [],
        temporal: [],
        perfilModificado: [false]
      })
    });
    this._empresaModel.empresaTieneEdsAsociada(this.formGroupEmpresa.get('formGroupInformacionEmpresa.tieneEdsAsociada').value);
    if (this.tipoOperacion === ETiposOperacion.consultar) {
      this.formGroupEmpresa.get('formGroupInformacionEmpresa').disable()
    }
  }
  /**
   * Se encarga de buscar empresa por id en modo consulta/edicion
   */
  public buscarEmpresaPorId(): void {
    this._empresaModel.selected(parseInt(this.idEmpresa));
    const empresaSubscription: Subscription = this._empresaModel.empresa$.subscribe(empresa => {
      if (empresa) {
        this.codigoSicom = empresa.codigoSicom
        this.formGroupEmpresa.get('formGroupInformacionEmpresa').patchValue(empresa)
        this._empresaModel.empresaTieneEdsAsociada(this.formGroupEmpresa.get('formGroupInformacionEmpresa.tieneEdsAsociada').value)
      }
    })
    this._suscripciones.add(empresaSubscription)
  }

  /**
  * Función para regresar a la pagina anterior
  */
  public goToBack(): void {
    if (this.tipoOperacion !== ETiposOperacion.consultar) {
      this._dialog
        .open(ModalTiposComponent, {
          data: {
            descripcion: this._translateService.instant('TITULOS.INFORMACION_NO_SE_GUARDARA'),
            icon: '15',
            button1: true,
            button2: true,
            txtButton1: this._translateService.instant('BOTONES.CONFIRMAR'),
            txtButton2: this._translateService.instant('BOTONES.CANCELAR'),
          },
          panelClass: 'modal-confirmacion',
        })
        .afterClosed()
        .subscribe((data) => {
          if (!!data)
            this._router.navigate([
              'home/seguridad/empresas',
            ]);
        });
    } else {
      this._router.navigate(['home/seguridad/empresas',]);
    }
  }

  /**
   * Abre el modal para confirmar la cancelacion de la accion Crear o Editar
   * @param tipo Determina la logica implementada para mostrar el modal de confirmacion de operacion
   */
  public abrirModalConfirmarOperacion(tipo: boolean): void {
    const { valid } = this.formGroupEmpresa.get('formGroupInformacionEmpresa');
    if ((this.formGroupEmpresa.get('formGroupInformacionEmpresa.perfiles').value.length === 0) && tipo === true) {
      this._utils.procesarMessageWebApi(this._translateService.instant('TITULOS.CREAR_MINIMO_PERFIL'), ETiposError.info);
      this.formGroupEmpresa.get('formGroupInformacionEmpresa').markAllAsTouched();
    } else if (this.formGroupEmpresa.get('formGroupPerfiles').dirty) {
      this._utils.procesarMessageWebApi(this._translateService.instant('TITULOS.CAMBIOS_PERFIL'), ETiposError.info);
    } else {
      if ((tipo && valid) || !tipo) {
        const title = tipo ? (this.idEmpresa && parseInt(this.idEmpresa) !== 0) ?
          EMensajeModal.confirmacionEditar
          : EMensajeModal.confirmacionGuardar
          : EMensajeModal.confirmacionCancelar;

        this._dialog
          .open(ModalTiposComponent, {
            data: {
              descripcion: title,
              icon: '15',
              button1: true,
              button2: true,
              txtButton1: this._translateService.instant('BOTONES.CONFIRMAR'),
              txtButton2: this._translateService.instant('BOTONES.CANCELAR'),
            },
            panelClass: 'modal-confirmacion',
          })
          .afterClosed()
          .subscribe((data) => {
            if (!!data)
              tipo ? this.aceptarSubmit() : this.cancelarSubmit();
          });
      } else {
        this._utils.procesarMessageWebApi(this._translateService.instant('TITULOS.CAMPOS_INCOMPLETOS_FORMULARIO'), ETiposError.info);
        if (this.selectedIndex === 1) this.selectedIndex = 0;
        this.formGroupEmpresa.get('formGroupInformacionEmpresa').markAllAsTouched();
      }
    }
  }

  /**
   * Metodo que se encarga de agregar el id de la página en la ruta
   * @param idEds Codigo de la eds a editar
   */
  public editarEmpresa(): void {
    this._router.navigate(['home/seguridad/empresas/editar/' + this.formGroupEmpresa.get('formGroupInformacionEmpresa.id').value], { queryParams: { idPagina: PermisosUtils.ObtenerPagina() } });
  }

  /**
   * Cancela la operacion y devuelve al usuario al listado de perfiles.
   */
  private cancelarSubmit(): void {
    this._router.navigate(['home/seguridad/empresas']);
  }
  /**
   * Método para guardar empresa
   */
  public aceptarSubmit(): void {
    const empresa: Empresa = this.formGroupEmpresa.get('formGroupInformacionEmpresa').value;
    this.tipoOperacion === ETiposOperacion.editar ? this._empresaModel.update(empresa) : this._empresaModel.create(empresa);
  }

  /**
   * Método para pasar al siguiente tab
   */
  public cambiarTab(): void {
    this.selectedIndex = this.selectedIndex === 0 ? 1 : 0;
  }

  /**
   * Método para validar el formulario
   */
  public validarFormulario(): void{
    let formularioDatosEmpresa = this.formGroupEmpresa.get('formGroupInformacionEmpresa') as FormGroup;
    if(formularioDatosEmpresa.valid){
      this.cambiarTab()
    }else{
      formularioDatosEmpresa.markAllAsTouched();
    }
  }

}
