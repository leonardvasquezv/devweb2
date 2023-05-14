import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { UtilsService } from '@shared/services/utils.service';
import { Subscription } from 'rxjs';
import { CrearEdsModel } from '../crear-eds/models/crear-eds.model';

@Component({
  selector: 'app-consulta-crear-eds',
  templateUrl: './consulta-crear-eds.component.html',
  styleUrls: ['./consulta-crear-eds.component.scss']
})
export class ConsultaCrearEdsComponent implements OnInit {

  /**
   * Variable que define el modo consulta
   */
  public modoConsulta = true;

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
   * Variable que contiene el progreso del progressbar
   */
  public progreso: number = 50;

  /**
   * Metodo donde se inyectan las dependencias del componente.
   * @param _activatedRoute Variable que define las propíedades y metodos del active router
   * @param _crearEdsModel Servicio para crear EDS
   * @param _formBuilder Servicio para crear formularios
   * @param _router Servicio para navegar entre paginas
   * @param _utilsService Accede a los metodos del servicio de utilidades
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _crearEdsModel: CrearEdsModel,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _utilsService: UtilsService
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this._initForms();
    this.initDataInfoBase();
    this.getInfoCrearEds();
    this._utilsService.setBreadCrumb('consultar',null, false, 'Consultar EDS');
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
   * Metodo para inicializar datos base de formulario
   */
  public initDataInfoBase(): void {
    ((this.formCrearEds.get('formDatosBasicosEDS')) as FormGroup).get('nombreEds').valueChanges.subscribe(value => {
      if (!!value) this.nombreEds = value;
    });
    ((this.formCrearEds.get('formDatosBasicosEDS')) as FormGroup).get('codigoSicom').valueChanges.subscribe(value => {
      if (!!value) this.codigoSicom = value;
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
            telefonoRepresentante: data.representanteLegalObj.telefono
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
            ciudadesUbicacionEds: +data.idMunicipio,
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
   * Metodo que inicializa los formularios
   */
  private _initForms(): void {
    this.formCrearEds = this._formBuilder.group({
      idEds: [1],
      selectedStep: [null],
      formEmpresaAsociadaEDS: this._formBuilder.group({
        idTipoDeDocumento: [null],
        numeroDocumento: [null],
        nombreRepresentante: [null],
        correoElectronicoRepresentante: [null],
        telefonoRepresentante: [null],
      }),
      formDatosBasicosEDS: this._formBuilder.group({
        nombreEds: [null],
        numeroNit: [null],
        codigoSicom: [null],
        idRangoTrabajador: [null],
        cantTrabajadoresDirectos: [null],
        cantTrabajadoresIndirectos: [null],
        telefonoResponsable: [null],
        correoElectronicoResponsable: [null],
        depUbicacionEds: [null],
        ciudadesUbicacionEds: [null],
        direccion: [null],
        sectorEconomico: [null],
        claseRiesgo: [null],
        idMayorista: [null],
        urlLogo: [],
        nombreLogo: [],
        archivo: [],
        latitud: [null, Validators.required],
        longitud: [null, Validators.required]
      }),
      formConfiguracionEds: this._formBuilder.group({
        fechaEvaluacion: [null],
        responsableEjecucionSGSST: [null],
        evaluacionRealizadaPor: [null],
        cargo: [null],
        servicios: [null]
      })
    });

    this.formCrearEds.disable();
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
      stepper.next();
    }
  }

  /**
   * Metodo que valida el step 2
   * @param stepper Referencia al step actual
   */
  public validarStep2(stepper: MatStepper): void {
    if (stepper.selectedIndex === 1) {
    }
  }

  /**
   * Función para regresar a la pagina anterior y validación con modal
   */
  public goToBack(): void {
    this._router.navigate([
      'home/dashboard',
    ]);

  }

  /**
   * Metodo que se encarga de agregar el id de la página en la ruta
   * @param idEds Codigo de la eds a editar
   */
  public botonEditarEds(idEds: number): void {
    this._router.navigate(['home/dashboard/eds/editar', idEds]);
  }

  /**
   * Método para insertar la franja informativa
   */
  private _insertarFranja(): void{
    const padreStepper = document.getElementById('stepper-horizontal-editar');
    const franja = document.getElementById('franja-informativa-editar');
    
    padreStepper.insertBefore(franja,padreStepper.children[1])
    
    padreStepper.children[2].appendChild(document.getElementById('contenedor-hijos-editar'))
    const contenedorHijos = document.getElementById('contenedor-hijos-editar');
    
    contenedorHijos.appendChild(padreStepper.children[2].children[0]);
    contenedorHijos.appendChild(padreStepper.children[2].children[0]);

  }
}
