import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { CrearEds } from '@core/interfaces/crear-eds.interface';
import { DataEds } from '@core/interfaces/data-eds.interface';
import { EdsModel } from '@core/model/eds.model';
import { TranslateService } from '@ngx-translate/core';
import { ModalTiposComponent } from '@shared/components/modal-tipos/modal-tipos.component';
import { UtilsService } from '@shared/services/utils.service';
import { Subscription } from 'rxjs';
import { CrearEdsModel } from './models/crear-eds.model';

@Component({
  selector: 'app-crear-eds',
  templateUrl: './crear-eds.component.html',
  styleUrls: ['./crear-eds.component.scss']
})
export class CrearEdsComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Input que define si los campos estan en modo consulta
   */
  @Input() modoConsulta = false;
 
  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /**
   * Formulario para crear EDS
   */
  public formCrearEds: FormGroup;

  /**
   * Nombre de la EDS
   */
  public nombreEds: string;

  /**
   * Código Sicom
   */
  public codigoSicom: string;

  /**
   * Posición del stepper
   */
  public posicionStepper: number = 0;

  /**
   * Array con los nuevos a agregar a la EDS
   */
  public nuevaEds: DataEds;

  /**
   * Variable que contiene el progreso del progressbar
   */
  public progreso: number = 50;


  /**
   * Metodo donde se inyectan las dependencias del componente.
   * @param _formBuilder Servicio para crear formularios
   * @param _crearEdsModel Servicio para crear EDS
   * @param _router Servicio para navegar entre paginas
   * @param _dialog Servicio que permite abrir un modal
   * @param _utilService Servicio de utilidades
   * @param _activatedRoute Variable que define las propíedades y metodos del active router
   * @param _translateService inyeccion de metodos de traduccion
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _crearEdsModel: CrearEdsModel,
    private _edsModel: EdsModel,
    private _router: Router,
    private _dialog: MatDialog,
    private _utilService: UtilsService,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService
  ) { }
   
  
  /**
   * Método que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this._initForms();
    if (!!this.idEds) this.getInfoCrearEds();
    this._bloquearCamposNecesarios();
    this._utilService.setBreadCrumb(this.idEds ? 'editar':'crear', 'EDS', true, 'EDS');
  }

  /**
   * Metodo que se ejecuta al renderizar el componente
   */
  ngAfterViewInit(): void {
    this._insertarFranja();
  }
  
  
  /**
   * Metodo donde se destruye el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }


  /**
   * get utilizado para saber el tipo de operacion
   */
  get idEds() {
    const key = '_value';
    return this._activatedRoute.params[key].idEds;
  }

  /**
   * Metodo para bloquear campos necesarios
   */
  private _bloquearCamposNecesarios(): void {
    ['fechaEvaluacion', 'evaluacionRealizadaPor', 'cargo'].forEach(control => {
      this.formCrearEds.controls.formConfiguracionEds.get(control).disable();
    });
  }

  /**
   * Metodo para obtener la informacion de crear EDS
   */
  public getInfoCrearEds(): void {
    this._crearEdsModel.obtenerEdsPorId(+this.idEds).subscribe(({ data }: ResponseWebApi) => {
      if (!!data) {
        this.formCrearEds.patchValue({
          idEds: data.idEds,
          formEmpresaAsociadaEDS: {
            idTipoDeDocumento: data.representanteLegalObj.idTipoDocumento,
            numeroDocumento: data.representanteLegalObj.numeroDocumento,
            nombreRepresentante: data.representanteLegalObj.nombreCompleto,
            correoElectronicoRepresentante: data.representanteLegalObj.correoElectronico,
            telefonoRepresentante: data.representanteLegalObj.telefono,
            idTercero: data.representanteLegalObj.idTercero
          },
          formDatosBasicosEDS: {
            nombreEds: data.nombre,
            numeroNit: data.nit,
            codigoSicom: data.codigoSicom,
            idRangoTrabajador: data.idRangoTrabajador,
            cantTrabajadoresDirectos: data.cantidadTrabajadoresDirectos,
            cantTrabajadoresIndirectos: data.cantidadTrabajadoresIndirectos,
            telefonoResponsable: data.telefono,
            correoElectronicoResponsable: data.correoElectronico,
            depUbicacionEds: +data.departamentoMunicipio,
            ciudadesUbicacionEds: data.idMunicipio,
            direccion: data.direccion,
            sectorEconomico: data.idSectorEconomico,
            claseRiesgo: data.idClaseRiesgo,
            idMayorista: data.idMayorista,
            urlArchivo: data.urlLogo,
            longitud: data.longitud,
            latitud: data.latitud,
            nombreLogo: data.nombreLogo,
            urlLogo: data.urlLogo
          },
          formConfiguracionEds: {
            responsableEjecucionSGSST: data.responsableEjecucionSST,
            servicios: data.serviciosEds,
            fechaEvaluacion: !!data.fechaEvaluacion ? new Date(data.fechaEvaluacion).toLocaleDateString() : null,
            cargo: data.cargo,
            evaluacionRealizadaPor: data.evaluacionRealizadaPor,
          }
        });
      }
    });
  }

  /**
   * Metodo para escuchar los cambios del campo nommbre y codigo de la EDS
   */
  public getDatosEds(event): void {
    this.nombreEds = event.nombreEds;
    this.codigoSicom = event.codigoSicom;
  }

  /**
   * Metodo que inicializa los formularios
   */
  private _initForms(): void {
    const patronCorreo = '[a-zA-Z0-9._-]+[@]+[a-zA-Z0-9-]+([.][a-zA-Z]{2,4})+';
    this.formCrearEds = this._formBuilder.group({
      idEds: [null],
      selectedStep: [null],
      formEmpresaAsociadaEDS: this._formBuilder.group({
        idTercero: [null],
        idTipoDeDocumento: [null, Validators.required],
        numeroDocumento: [null, Validators.required],
        nombreRepresentante: [null, Validators.required],
        correoElectronicoRepresentante: [null, Validators.pattern(patronCorreo)],
        telefonoRepresentante: [null, Validators.required],
      }),
      formDatosBasicosEDS: this._formBuilder.group({
        nombreEds: [null, Validators.required],
        numeroNit: [null, Validators.required],
        codigoSicom: [null, Validators.required],
        idRangoTrabajador: [null, Validators.required],
        cantTrabajadoresDirectos: [null, Validators.required],
        cantTrabajadoresIndirectos: [null, Validators.required],
        telefonoResponsable: [null, Validators.required],
        correoElectronicoResponsable: [null, Validators.pattern(patronCorreo)],
        depUbicacionEds: [null, Validators.required],
        ciudadesUbicacionEds: [null, Validators.required],
        direccion: [null, Validators.required],
        sectorEconomico: [null, Validators.required],
        claseRiesgo: [null, Validators.required],
        idMayorista: [null, Validators.required],
        urlLogo: [],
        nombreLogo: [],
        archivo: [],
        latitud: [null, Validators.required],
        longitud: [null, Validators.required]
      }),
      formConfiguracionEds: this._formBuilder.group({
        fechaEvaluacion: [null],
        responsableEjecucionSGSST: [null, Validators.required],
        evaluacionRealizadaPor: [null],
        cargo: [null],
        servicios: [null, Validators.required],
      })
    });
  }


  /**
   * Metodo que guarda el index del stepper
   * @param indexStep Posicion del stepper
   */
  public onStepChange(indexStep: number): void {
    this.formCrearEds.controls.selectedStep.setValue(indexStep);
    this._crearEdsModel.updateInfoCrearEds(this.formCrearEds.value);
    this.progreso = indexStep === 0 ? 50 : 100;
  }

  /**
   * Metodo que valida el step 1
   * @param stepper Referencia al step actual
   */
  public validarStep1(stepper: MatStepper): void {
    if (stepper.selectedIndex === 0) {
      if (this.formCrearEds.controls.formEmpresaAsociadaEDS.valid, this.formCrearEds.controls.formDatosBasicosEDS.valid) {
        this._crearEdsModel.updateInfoCrearEds(this.formCrearEds.value);
        stepper.next();
      } else {
        this.formCrearEds.controls.formEmpresaAsociadaEDS.markAllAsTouched();
        this.formCrearEds.controls.formDatosBasicosEDS.markAllAsTouched();

      }
    }
  }


  /**
   * Metodo que valida el step 2
   * @param stepper Referencia al step actual
   */
  public validarStep2(stepper: MatStepper): void {
    if (stepper.selectedIndex === 1) {
      if (this.formCrearEds.valid) {
        this.nuevaEds = this.parseEds(this.formCrearEds.value)
        this._confirmacionGuardar();
      } else {
        this.formCrearEds.markAllAsTouched();
        if(this.formCrearEds.value.formConfiguracionEds.servicios?.length === 0 || this.formCrearEds.value.formConfiguracionEds.servicios === null){
          this._utilService.procesarMessageWebApi(this._translateService.instant('TITULOS.ESCOGER_SERVICIO'), 'Error');
        }
      }
    }
  }

  /**
   * Abrir modal de confirmación para la creacion de la EDS
   */
  private _confirmacionGuardar(): void {
    const dialogRefSubscription: Subscription = this._modalTipos('TITULOS.CONFIRMAR_CREACION_EDS', '15')
      .afterClosed().subscribe((result) => {
        if (!!result) {
          if (!!this.idEds) {
            this._editarEds();
          } else {
            this._guardarEds();
          }
        }
      });
    this._subscriptions.add(dialogRefSubscription);
  }

  /**
   * Metodo para guardar una eds
   */
  private _guardarEds(): void {
    const crearEdsSubscription: Subscription = this._edsModel.crearEds(this.nuevaEds).subscribe(({ status, message }: ResponseWebApi) => {
      this._utilService.procesarMessageWebApi(message, status ? ETiposError.correcto : ETiposError.error);
      if (status) this._router.navigateByUrl('home/dashboard');
    }, (err) =>
    this._utilService.procesarMessageWebApi(this._translateService.instant('TITULOS.ERROR_INESPERADO'), ETiposError.error));
    this._subscriptions.add(crearEdsSubscription);
  }

  /**
   * Metodo para guardar una eds
   */
  private _editarEds(): void {
    this._edsModel.editarEds(this.nuevaEds).subscribe(({ status, message }: ResponseWebApi) => {
      this._utilService.procesarMessageWebApi(message, status ? ETiposError.correcto : ETiposError.error);
      if (status) this._router.navigateByUrl('home/dashboard');
    }, (err) =>
    this._utilService.procesarMessageWebApi(this._translateService.instant('TITULOS.ERROR_INESPERADO'), ETiposError.error));
  }

  /**
   * Metodo generico para modal tipo
   * @param descripcion a mostrar
   * @param icon a mostrar
   * @returns Respuesta matdialog
   */
  private _modalTipos(descripcion: string, icon: string): MatDialogRef<ModalTiposComponent> {
    const matDialog = this._dialog.open(ModalTiposComponent, {
      data: {
        descripcion: this._translateService.instant(descripcion),
        icon,
        txtButton1: this._translateService.instant('BOTONES.CONFIRMAR'),
        txtButton2: this._translateService.instant('BOTONES.CANCELAR'),
      },
      panelClass: 'modal-confirmacion',
    });
    return matDialog;
  }


  /**
   * Pasea los datos de Interface CrearEds A DataEds
   */
  public parseEds(eds: CrearEds): DataEds {
    const {
      idEds,
      formEmpresaAsociadaEDS: {
        idTercero,
        idTipoDeDocumento,
        numeroDocumento,
        nombreRepresentante,
        correoElectronicoRepresentante,
        telefonoRepresentante
      },
      formDatosBasicosEDS: {
        cantTrabajadoresDirectos,
        cantTrabajadoresIndirectos,
        ciudadesUbicacionEds,
        claseRiesgo,
        codigoSicom,
        depUbicacionEds,
        direccion,
        nombreEds,
        numeroNit,
        idRangoTrabajador,
        sectorEconomico,
        telefonoResponsable,
        correoElectronicoResponsable,
        urlLogo,
        archivo,
        nombreLogo,
        latitud,
        longitud,
        idMayorista
      },
      formConfiguracionEds: {
        responsableEjecucionSGSST,
        servicios
      } } = eds

    const dataEds: DataEds = {
      idEds,
      nombre: nombreEds,
      nit: numeroNit.toString(),
      codigoSicom,
      idRangoTrabajador,
      cantidadTrabajadoresDirectos: cantTrabajadoresDirectos,
      cantidadTrabajadoresIndirectos: cantTrabajadoresIndirectos,
      telefono: telefonoResponsable,
      correoElectronico: correoElectronicoResponsable,
      idDepartamento: depUbicacionEds,
      idMunicipio: ciudadesUbicacionEds,
      direccion,
      idSectorEconomico: sectorEconomico,
      idClaseRiesgo: claseRiesgo,
      serviciosEds: servicios,
      responsableEjecucionSST: responsableEjecucionSGSST,
      urlLogo,
      archivo,
      nombreLogo,
      latitud: latitud.toString(),
      longitud: longitud.toString(),
      idMayorista,
      representanteLegalObj: {
        idTercero,
        nombreCompleto: nombreRepresentante,
        numeroDocumento,
        idTipoDocumento: idTipoDeDocumento,
        telefono: telefonoRepresentante,
        correoElectronico: correoElectronicoRepresentante,
      }

    }
    return dataEds;
  }

  /**
  * Función para regresar a la pagina anterior y validación con modal
  */
  goToBack(): void {
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
            'home/dashboard',
          ]);
      });
  }

  /**
   * Método para insertar la franja informativa
   */
  private _insertarFranja(): void{
    const padreStepper = document.getElementById('stepper-horizontal');
    const franja = document.getElementById('franja-informativa');
    
    padreStepper.insertBefore(franja,padreStepper.children[1])
    
    padreStepper.children[2].appendChild(document.getElementById('contenedor-hijos'))
    const contenedorHijos = document.getElementById('contenedor-hijos');
    
    contenedorHijos.appendChild(padreStepper.children[2].children[0]);
    contenedorHijos.appendChild(padreStepper.children[2].children[0]);

  }
}

