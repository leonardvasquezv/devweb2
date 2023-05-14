import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETipo } from '@core/enum/tipo.enum';
import { ObjParam } from '@core/interfaces/base/objParam.interface';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { Departamento } from '@core/interfaces/departamento.interface';
import { Empresa } from '@core/interfaces/empresa.interface';
import { InformacionDeUbicacionEds } from '@core/interfaces/informacionDeUbicacionEds.interface';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { Municipio } from '@core/interfaces/municipio.interface';
import { GlobalModel } from '@core/model/global.model';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { FileUtils } from '@core/utils/file-utils';
import { SortUtils } from '@core/utils/sort-utils';
import { TranslateService } from '@ngx-translate/core';
import { Enum } from '@shared/global/enum';
import { UtilsService } from '@shared/services/utils.service';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { CrearEdsModel } from '../../crear-eds/models/crear-eds.model';
import { ModalBuscarDireccionComponent } from './components/modal-buscar-direccion/modal-buscar-direccion.component';
import { EdsModel } from '@core/model/eds.model';


@Component({
  selector: 'app-formulario-datos-basicos',
  templateUrl: './formulario-datos-basicos.component.html'
})
export class FormularioDatosBasicosComponent implements OnInit, OnDestroy {
  /**
    * Input que establece los inputs en modo consulta
    */
  @Input() modoConsulta: boolean = false;
  /**
   * Input para recibir el nombre del formulario
   */
  @Input() formGroupName: string;

  /**
   * Componente de  html para realizar segumiento
   */
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef<HTMLInputElement>;

  /**
   * Metodo para emitir el nombre y el codigo de la eds
   */
  @Output() datosEds: EventEmitter<{ nombreEds: string; codigoSicom: string }> =
    new EventEmitter();

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();
  /**
   * Variable encargada de crear un Observer
   */
  private _debouncerCodigoSicom: Subject<string> = new Subject();

  /**
    * Metodo que inicializa el formulario de datos basicos
    */
  public formDatosBasicosEDS: FormGroup;

  /**
   * Rangos de trabajadores
   */
  public rangoTrabajadores: Array<TipoDetalle>;

  /**
    * Tipo de sector Economico
    */
  public sectoresEconomicos: Array<TipoDetalle>;

  /**
    * Clases de riesgos
    */
  public claseRiesgos: Array<TipoDetalle>;

  /**
   * Arhivos en temporal
   */
  public files;

  /**
   * Archivo selecionado
   */
  public file: File;

  /**
   * Control de archivo
   */
  public fileControl: FormControl;

  /**
   * Nombre del archivo que se realiza la subida a travez
   */
  public fileName: string;
  /**
    * Variable que almacena el tamaño del documento
    */
  public tamanoDocumento: number;

  /**
 * Array que contiene los departamentos registrados en el sistema
 */
  public arrayDepartamentos: Array<Departamento> = [];
  /**
    * Array que contiene los municipios registrados en el sistema filtrados por departamento
    */
  public arrayMunicipios: Array<Municipio> = [];

  /**
 * Objeto que contiene el departamento seleccionado para filtrar el mapa
 */
  public departamentoSeleccionado: Departamento;
  /**
    * Objeto que contiene el municipio seleccionado para filtrar el mapa
    */
  public municipioSeleccionado: Municipio;
  /**
    * Mayoristas
    */
  public mayoristas: Array<Empresa>;

  /**
 * Ubicacion restriccion
 */
  public departamentoRestriccion: string = '';

  /**
   * Define el idEds
   */
  public idEds: number;

  /**
   * Metodo donde se inyectan las dependencias
   * @param _matDialog Define los atributos y las propiedades de los modales
   * @param _translateService Servicio para traducciones
   * @param _rootFormGroup formulario raiz
   * @param _globalModel Modelo global
   * @param _utils Servicio de utilidades
   * @param _tipoParametrizacionModel Modelo de TipoParametrizacion
   * @param _crearEdsModel Inyeccion de los servicios de _crearEdsModel
   * @param _activeRoute Define los atributos y propiedades de la ruta activa
   * @param _utilService variable con métodos globales
   * @param _edsModel modelo de eds
   */
  constructor(
    private _matDialog: MatDialog,
    private _translateService: TranslateService,
    private _rootFormGroup: FormGroupDirective,
    private _globalModel: GlobalModel,
    private _utils: UtilsService,
    private _tipoParametrizacionModel: TipoParametrizacionModel,
    private _crearEdsModel: CrearEdsModel,
    private _activeRoute: ActivatedRoute,
    private _utilService: UtilsService,
    private _edsModel:EdsModel,
  ) { }

  /**
   * Metodo donde se inicializa el componente
   */
  ngOnInit(): void {
    this.iniciarFormularios();
    this._inicializarValores();
    this._cambiosCargaInicial();
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
    this._debouncerCodigoSicom.unsubscribe();
  }

  /**
   * Get que valida si los campos de ciudad y departamento son validos
   */
  get validarDepartamentoCiudad(): boolean {
    return this.formDatosBasicosEDS.get('ciudadesUbicacionEds').valid && this.formDatosBasicosEDS.get('depUbicacionEds').valid
  }

  /**
   * Método de cargar los valores iniciales del componente
   */
  private _inicializarValores(): void {
    const criterioRango = [{ campo: 'idTipo', valor: ETipo.rangoTrabajadores }];
    const criterioClaseRiesgos = [{ campo: 'idTipo', valor: ETipo.claseRiesgos }];
    const criterioSectoresEconomicos = [{ campo: 'idTipo', valor: ETipo.sectoresEconomicos }];

    this._activeRoute.params.subscribe((param) => this.idEds = param?.idEds ? param.idEds : 0)

    this.obtenerDepartamentos();

    this._crearEdsModel.obtenerMayoristas([{ campo: 'EstadoRegistro', valor: 'A' }]).subscribe(({ data }: ResponseWebApi) => {
      return this.mayoristas = SortUtils.getSortJson(data, 'nombre', 'STRING')
    });
    this._tipoParametrizacionModel.obtenerTiposParametrizacion(criterioRango).subscribe(({ data }: ResponseWebApi) => {
      return this.rangoTrabajadores = SortUtils.getSortJson(data, 'idTipoDetalle', 'NUMBER')
    });

    this._tipoParametrizacionModel.obtenerTiposParametrizacion(criterioSectoresEconomicos).subscribe(({ data }: ResponseWebApi) => {
      return this.sectoresEconomicos = SortUtils.getSortJson(data, 'nombre', 'STRING')
    });

    this._tipoParametrizacionModel.obtenerTiposParametrizacion(criterioClaseRiesgos).subscribe(({ data }: ResponseWebApi) => {
      return this.claseRiesgos = SortUtils.getSortJson(data, 'nombre', 'STRING')
    });

    this.formDatosBasicosEDS.get('depUbicacionEds').valueChanges.subscribe(idDepartamento => {
      if (!!idDepartamento) {
        this.changeDepartamento(idDepartamento);
      };
    });

    this.formDatosBasicosEDS.get('ciudadesUbicacionEds').valueChanges.subscribe(idCiudad => {
      if (!!idCiudad) {
        this.changeCiudad();
      };
    });

    this.formDatosBasicosEDS.get('ciudadesUbicacionEds').disable();
    this.formDatosBasicosEDS.get('direccion').disable();

    this._debouncerCodigoSicom
      .pipe(
        debounceTime(1000),
        switchMap(codigo => {
          if (!codigo) {
            return of(false)
          }
          if (Number(codigo)==0) {
            this.EstablecerErrorCampoCodigoSweetAlert('FORMULARIOS.NO_VALIDO_CODIGO_CERO')
            return of(false)
          }

          return this.existeCodigoSicom()
        })
      )
      .subscribe(value => {
        if (value) {
          this.formDatosBasicosEDS.get('codigoSicom').setErrors({ repetido: true })
          this.establecerErrorCampoCodigo()
        }
      });
  }

  /**
   * Metodo que inicializa los formularios
   */
  public iniciarFormularios(): void {
    if (this.formGroupName) {
      this.formDatosBasicosEDS = this._rootFormGroup.control.get(
        this.formGroupName
      ) as FormGroup;
    }
  }

  /**
   * Metodo que carga los datos iniciales
   */
  private _cambiosCargaInicial(): void {
    if (this.modoConsulta) this.formDatosBasicosEDS.disable();
    this.formDatosBasicosEDS.get('nombreLogo').valueChanges.subscribe(value => {
      if (!!value) this.fileName = value
    })
  }
  /**
   *  Método donde escuchamos el deboncer
   */
  public validarCodigoSicom(): void {
    this._debouncerCodigoSicom.next(this.formDatosBasicosEDS.get('codigoSicom').value);
    this.onChangeNombreCodigoEds()
  }

  /**
   * Método donde validamos si el código del formulario ya existe
   * @returns  true --> Ya existe un codigo /  false --> No existe codigo
   */
  public existeCodigoSicom(): Observable<boolean> {
    let _result: boolean
    const codigoSicom: string = this.formDatosBasicosEDS.get('codigoSicom').value;
    const criterio: Array<ObjParam> = [{ campo: 'CodigoSicom', valor: codigoSicom }, { campo: 'idEds', valor: this.idEds }]
    return this._crearEdsModel.ExisteCodigoSicom(criterio)
      .pipe(
        map((res: ResponseWebApi): boolean => {
          if (res.status) {
            _result = res.data
            if (_result) {
              return true;
            } else {
              return false
            }
          } else {
            return false
          }
        })
      );
  }
  
/**
 * Metodo para validar si existe una eds con un nit Especifico 
 */
  public validaExisteNitEds():void{
    const {  numeroNit } = this.formDatosBasicosEDS.value;
    if (!!numeroNit) {
      const nit: string = this.formDatosBasicosEDS.get('numeroNit').value;
      const criterio: Array<ObjParam> = [{ campo: 'Nit', valor: nit }, { campo: 'idEds', valor: this.idEds }]
      this._subscriptions
      this._edsModel.existeNitEds(criterio).toPromise().then(({ data, status }: ResponseWebApi)=>{
        if (data !== false || !status) {
          this.formDatosBasicosEDS.get('numeroNit').setErrors({ repetido: true })
        }
      });
    }
  }

  /**
   * Método para establecer un mensaje dependiendo del error
   * @returns Mensaje de error para el campo código
   */
  public establecerErrorCampoCodigo(): void {
    return this.formDatosBasicosEDS.get('codigoSicom').hasError('repetido') ? this.EstablecerErrorCampoCodigoSweetAlert('FORMULARIOS.VALIDACION_CAMPO_CODIGO_PARAMETRIZACION') : this._translateService.instant('FORMULARIOS.VALIDACION_CAMPO_REQUERIDO');
  }

  /**
   * Método para establecer un mensaje sweet alert para decir que existe el codigo y limpie el campo
   * @param codigoMensaje Codigo del mensaje que se va a mostrar
   */
  public EstablecerErrorCampoCodigoSweetAlert(codigoMensaje:string): void {
    let mensaje = this._translateService.instant(codigoMensaje)
    this._utils.procesarMessageWebApi(mensaje, 'Error');
    this.formDatosBasicosEDS.get('codigoSicom').setValue('')
  }

  /**
   * Metodo para emitir el nombre y el codigo de la eds
   */
  public onChangeNombreCodigoEds(): void {
    this.datosEds.emit({
      nombreEds: this.formDatosBasicosEDS.get('nombreEds').value,
      codigoSicom: this.formDatosBasicosEDS.get('codigoSicom').value,
    });
  }

  /**
   * Obtiene los departamentos registradas en el sistema.
   */
  private obtenerDepartamentos(): void {
    const { idPais } = JSON.parse(localStorage.getItem('paisUsuario'));
    const suscripcionDepartamentos = this._globalModel.obtenerDepartamentosPorPais(idPais).subscribe(
      (response: ResponseWebApi) => {
        if (response.status) {
          this.arrayDepartamentos = response.data;
        } else {
          this._utils.procesarMessageWebApi(response.message, ETiposError.error);
        }
      },
      (error) => {
        this._utils.procesarMessageWebApi(error, Enum.tipoError.error);
      }
    );
    this._subscriptions.add(suscripcionDepartamentos);
  }

  /**
   * Obtiene los municipios a partir de un departamento.
   * @param idDepartamento del departamento
   */
  public obtenerMunicipios(idDepartamento: number) {
    const suscripcionMunicipios = this._globalModel.obtenerMunicipiosPorDepartamento(idDepartamento).subscribe(
      (response: ResponseWebApi) => {
        if (response.status) {
          this.arrayMunicipios = response.data;
        } else {
          this._utils.procesarMessageWebApi(response.message, ETiposError.error);
        }
      }
    );
    this._subscriptions.add(suscripcionMunicipios);
  }

  /**
   * Metodo para cargar Archivo desde el componente
   * @param event evento de cargue de archivo
   */
  public cargarArchivo(event: any): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const tipados: Array<string> = ['image/png', 'image/jpg', 'image/jpeg'];
    this.file = files[0];
    if (!tipados.includes(this.file.type)) return this._mensajeErrorSubirMensaje();
    this.fileName = this.file.name;
    this.tamanoDocumento = Math.round(this.file.size * 0.001);
    FileUtils.previewFile(event.target.files[0], [], true).pipe(take(1))
      .subscribe(result => {
        this.formDatosBasicosEDS.get('archivo').patchValue(result.archivo);
        this.formDatosBasicosEDS.get('urlLogo').patchValue(result.url);
        this.formDatosBasicosEDS.get('nombreLogo').patchValue(result.nombre);
      });
    this.fileUpload.nativeElement.value = '';
  }

  /**
   * Metodo para mostrar mensaje al subir un documento erroneo
   */
  private _mensajeErrorSubirMensaje(): void {
    this._utilService.procesarMessageWebApi('No es posible subir este documento', ETiposError.error);
    this.borrarArchivo();
  }

  /**
   * Metodo para borrar el archivo cargado
   */
  public borrarArchivo(): void {
    this.fileName = null;
    this.tamanoDocumento = null;
    this.file = null;
    this.formDatosBasicosEDS.get('archivo').patchValue(null);
  }
  /**
 * Metodo para descargar el archivo cargado
 */
  public descargarArchivo(): void {
    window.open(this.formDatosBasicosEDS.get('urlLogo').value);
  }

  /**
   * Metodo para abrir el modal que contiene el mapa para seleccionar la direccion
   */
  public abrirModalDireccion(): void {
    if (this.validarDepartamentoCiudad) {
      let coordenadasAux: any;
      let direccionEscrita: string = '';

      if (this._validarValorEnCampo('latitud') && this._validarValorEnCampo("longitud")) {
        coordenadasAux = {
          lat: Number(this.formDatosBasicosEDS.get('latitud').value),
          lng: Number(this.formDatosBasicosEDS.get('longitud').value)
        };

        direccionEscrita = this.formDatosBasicosEDS.get('direccion').value
      }

      const dialogRef: MatDialogRef<ModalBuscarDireccionComponent> = this._matDialog.open(
        ModalBuscarDireccionComponent, {
        panelClass: 'modal-buscar-direccion',
        data: {
          coordenadas: coordenadasAux,
          direccionEscrita,
          departamentoSeleccionado: this.departamentoSeleccionado?.nombre,
          ciudadSeleccionada: this.municipioSeleccionado?.nombre,
          ubicacionRestriccion: this.departamentoRestriccion
        }
      }
      )

      const dialogRefSubscription: Subscription = dialogRef.afterClosed().subscribe((resultado: InformacionDeUbicacionEds) => {
        if (resultado) {
          this.formDatosBasicosEDS.get('direccion').setValue(resultado.direccion);
          this.formDatosBasicosEDS.get('latitud').setValue(resultado.latitud);
          this.formDatosBasicosEDS.get('longitud').setValue(resultado.longitud);
        }
      })

      this._subscriptions.add(dialogRefSubscription);
    }

  }


  /**
   * Método para validar si un campo tiene o no un valor
   * @param campo Nombre del campo que se quiere validar
   */
  private _validarValorEnCampo(campo: string): boolean {
    return typeof (this.formDatosBasicosEDS.get(campo).value) !== 'object' ? true : false
  }

  /**
   * Metodo que se ejecuta cuando el departamento cambia a un valor nuevo y habilita el campo de ciudad
   * @param idDepartamento id del departamento
   */
  public changeDepartamento(idDepartamento: number): void {
    this.obtenerMunicipios(idDepartamento);


    if (this.modoConsulta) {
      this.formDatosBasicosEDS.get('ciudadesUbicacionEds').disable();
      return
    }

    this.formDatosBasicosEDS.get('ciudadesUbicacionEds').enable();
    this.formDatosBasicosEDS.get('direccion').disable();
    this.formDatosBasicosEDS.get('direccion').reset();
    this.formDatosBasicosEDS.get('ciudadesUbicacionEds').reset();
    this.formDatosBasicosEDS.get('latitud').reset();
    this.formDatosBasicosEDS.get('longitud').reset();
    this.departamentoRestriccion = '';
  }

  /**
 * Metodo que habilita el campo de direccion
 */
  public changeCiudad(): void {

    if (this.modoConsulta) {
      this.formDatosBasicosEDS.get('direccion').disable();
      return
    }
    this.formDatosBasicosEDS.get('direccion').enable();
    this.formDatosBasicosEDS.get('direccion').reset();
    this.formDatosBasicosEDS.get('latitud').reset();
    this.formDatosBasicosEDS.get('longitud').reset();

    setTimeout(() => {
      this.nombresRetriccionDireccion();
    }, 500);

  }


  /**
   * Metodo para traer el nombre de la ciudad y departamento
   */
  public nombresRetriccionDireccion(): void {
    this.departamentoSeleccionado = this.arrayDepartamentos.find(departamento => departamento.idDepartamento === this.formDatosBasicosEDS.get('depUbicacionEds').value);
    this.municipioSeleccionado = this.arrayMunicipios.find(municipio => municipio.idMunicipio === this.formDatosBasicosEDS.get('ciudadesUbicacionEds').value);
    this.departamentoRestriccion = this.departamentoSeleccionado?.nombre;
  }

}
