import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ETiposError } from '@core/enum/tipo-error.enum';
import { ETipo } from '@core/enum/tipo.enum';
import { ETiposOperacion } from '@core/enum/tipoOperacion.enum';
import { TipoDetalle } from '@core/interfaces/maestros-del-sistema/tipoDetalle.interface';
import { Empresa } from '@core/interfaces/seguridad/empresa.interface';
import { GlobalModel } from '@core/model/global.model';
import { ParametrizacionModel } from '@core/model/parametrizacion.model';
import { GeneralUtils } from '@core/utils/general-utils';
import { Departamento } from '@shared/models/database/departamento.model';
import { Municipio } from '@shared/models/database/municipio.model';
import { Pais } from '@shared/models/database/pais.model';
import { UtilsService } from '@shared/services/utils.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, startWith } from 'rxjs/operators';
import { EmpresaModel } from '../../models/empresa.model';

@Component({
  selector: 'app-formulario-informacion-empresa',
  templateUrl: './formulario-informacion-empresa.component.html',
  styleUrls: ['./formulario-informacion-empresa.component.scss']
})
export class FormularioInformacionEmpresaComponent implements OnInit, OnDestroy {
  /**
   * define el observable del campo filtro de departamentos
   */
  public filtrarOpcionesDepartamentos: Observable<Departamento[]>;

  /**
   * Define el observable del campo filtro de ciudades
   */
  public filtrarOpcionesCiudades: Observable<Municipio[]>;

  /**
   * Define el observable del campo filtro de paises
   */
  public filtrarOpcionesPaises: Observable<Pais[]>;

  /**
  * Array de los tipos de identificacion
  */
  public tiposIdentificacion: Array<TipoDetalle> = [];

  /**
  * Array de paises
  */
  public paises: Array<Pais> = [];

  /**
  * Array de departamentos
  */
  public departamentos: Array<Departamento> = [];

  /**
  * Array de municipios
  */
  public municipios: Array<Municipio> = [];

  /**
   * Define el form group de informacion de la empresa
   */
  public formGroupInformacionEmpresa: FormGroup;

  /**
  * Define el form group de informacion del contacto
  */
  public formGroupInformacionContacto: FormGroup;

  /**
  * Define el formControl del  id pais del contacto
  */
  public idPais: FormControl;

  /**
  * Define el formControl del pais del contacto
  */
  public pais: FormControl;
  /**
  * Define el formControl del id departamento del contacto
  */
  public idDepartamento: FormControl;

  /**
  * Define el formControl del departamento del contacto
  */
  public departamento: FormControl;

  /**
  * Define el formControl del id ciudad del contacto
  */
  public idMunicipio: FormControl;

  /**
  * Define el formControl de la ciudad del contacto
  */
  public municipio: FormControl;

  /**
  * Define el id de la empresa a consultar
  */
  @Input() idEmpresa = 0;

  /**
   * Input para recibir codigoSicom a validar
   */
  @Input() codigoSicom: string;

  /**
  * Define si el formulario se puede editar
  */
  @Input() habilitarEditar = true;

  /**
  * Define la empresa seleccionado
  */
  @Input() selectedEmpresa: Empresa;

  /**
  * Instancia de suscripciones
  */
  private _suscripciones = new Subscription();

  /**
   * Metodo constructor de la clase
   * @param _parametrizacionModel define las propiedades y atributos del modelo de parametrizaciones
   * @param _globalModel define las propiedades y atributos del modelo de global
   * @param _activedRoute define las propiedades y atributos  de la ruta activa
   * @param _empresaModel define las propiedades y atributos del modelo de la empresa
   * @param _rootFormGroup define las propiedades y atributos del formulario reactivo
   * @param _utilsService Servicio de utilidades
   */
  constructor(private _parametrizacionModel: ParametrizacionModel,
    private _globalModel: GlobalModel,
    private _activedRoute: ActivatedRoute,
    private _empresaModel: EmpresaModel,
    private _rootFormGroup: FormGroupDirective,
    private _utilsService: UtilsService) { }

  /**
   * get utilizado para obtener el tipo de operacion
   */
  get tipoOperacion() {
    return this._activedRoute.snapshot.url[0].path;
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
    this.inicializarFormGroup();
    this.obtenerTiposIdentificaciones();
  }

  /*
    Función para obtener datos iniciales
  */
  public obtenerDatosIniciales(): void {
    this.obtenerPaises();
  }

  /*
   * Función para inicializar formgroup
   */
  public inicializarFormGroup(): void {
    this.formGroupInformacionEmpresa = this._rootFormGroup.control.get('formGroupInformacionEmpresa') as FormGroup;
    this.formGroupInformacionContacto = this.formGroupInformacionEmpresa.get('contactoEmpresa') as FormGroup;
    if (this.tipoOperacion !== ETiposOperacion.crear) this.formGroupInformacionEmpresa.get('estadoRegistro').disable()
    this.obtenerDatosIniciales();
  }

  /**
   * Metodo para buscar setear los campos de departamento y pais cuando se consulta una empresa
   * @param pais de la empresa
   */
  public obtenerInformacioUbicacionConsultar(pais: Pais): void {

    this.formGroupInformacionContacto.get('idPais').setValue(pais.id);
    this.formGroupInformacionContacto.get('paisAutoComplete').setValue(pais.nombre);

    const ubicacionSuscripcion = this._globalModel.obtenerDepartamentosPorPais(pais.id).subscribe(({ data }) => {
      this.departamentos = GeneralUtils.cloneObject(data);

      const departamento = this.departamentos.find((departamento) => departamento.idDepartamento === this.formGroupInformacionEmpresa.value.contactoEmpresa.idDepartamento)
      this.formGroupInformacionContacto.get('idDepartamento').setValue(departamento.idDepartamento);
      this.formGroupInformacionContacto.get('departamentoAutoComplete').setValue(departamento.nombre);

      this._globalModel.obtenerMunicipiosPorDepartamento(departamento.idDepartamento).subscribe(({ data }) => {
        this.municipios = GeneralUtils.cloneObject(data);

        const ciudad = this.municipios.find((municipio) => municipio.idMunicipio === this.formGroupInformacionEmpresa.value.contactoEmpresa.idMunicipio)
        this.formGroupInformacionContacto.get('idMunicipio').setValue(ciudad.idMunicipio);
        this.formGroupInformacionContacto.get('municipioAutoComplete').setValue(ciudad.nombre);
      });
    });
    this._suscripciones.add(ubicacionSuscripcion);

  }

  /**
   * Metodo donde se define el observable del cambio de pais
   */
  public filtrarPaises(): void {
    this.filtrarOpcionesPaises = this.formGroupInformacionContacto.get('paisAutoComplete').valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarPaises(value || '')),
    );
  }

  /**
   * Metodo que se ejecuta al cambiar de pais
   * @param option evento seleccionado
   */
  public changePais({ option }: any): void {
    const idPais: number = this.paises.find(pais => pais.nombre === option.value)?.id;
    this.formGroupInformacionContacto.get('idPais').setValue(idPais);
    this.departamentos.length = 0;
    this.obtenerDepartamentoPorPais(idPais);
    ['idDepartamento', 'idMunicipio', 'departamentoAutoComplete', 'municipioAutoComplete'].forEach(controlName => this.formGroupInformacionContacto.get(controlName).reset());
    ['idMunicipio', 'municipioAutoComplete'].forEach(controlName => this.formGroupInformacionContacto.get(controlName).disable());
    ['idDepartamento', 'departamentoAutoComplete'].forEach(controlName => this.formGroupInformacionContacto.get(controlName).enable());

  }

  /**
   * Metodo donde se define el observable del cambio de departamento
   */
  public filtrarDepartamentos(): void {
    this.filtrarOpcionesDepartamentos = this.formGroupInformacionContacto.get('departamentoAutoComplete').valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarDepartamentos(value || '')),
    );
  }

  /**
  * Metodo que se ejecuta al cambiar de departamento
  * @param option evento seleccionado
  */
  public changeDepartamento({ option }: any): void {
    const idDepartamento: number = this.departamentos.find(departamento => departamento.nombre === option.value)?.idDepartamento;
    this.formGroupInformacionContacto.get('idDepartamento').setValue(idDepartamento);
    this.municipios.length = 0;
    this.obtenerMunicipiosPorDepartamento(idDepartamento);
    ['idMunicipio', 'municipioAutoComplete'].forEach(controlName => {
      const control = this.formGroupInformacionContacto.get(controlName);
      control.reset();
      control.enable();
    });
  }
  /**
  * Metodo que se ejecuta al cambiar de municipio
  * @param option evento seleccionado
  */
  public changeMunicipio({ option }: any): void {
    const idMunicipio: number = this.municipios.find(municipio => municipio.nombre === option.value)?.idMunicipio;
    this.formGroupInformacionContacto.get('idMunicipio').setValue(idMunicipio);
  }

  /**
   * Metodo donde se define el observable del cambio de ciudad
   */
  public filtrarCiudades(): void {
    this.filtrarOpcionesCiudades = this.formGroupInformacionContacto.get('municipioAutoComplete').valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarCiudades(value || '')),
    );
  }

  /**
   * Metodo donde se filtran los departamentos
   * @param value Valor del campo
   * @returns departamentos filtrados
   */
  private _filtrarDepartamentos(value: string): Departamento[] {
    const filterValue = value.toLowerCase();
    return this.departamentos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  /**
 * Metodo donde se filtran las ciudades
 * @param value Valor del campo
 * @returns ciudades filtradas
 */
  private _filtrarCiudades(value: string): Municipio[] {
    const filterValue = value.toLowerCase();
    return this.municipios.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  /**
  * Metodo donde se filtran los paises
  * @param value Valor del campo
  * @returns paises filtradas
  */
  private _filtrarPaises(value: string): Pais[] {
    const filterValue = value.toLowerCase();
    return this.paises.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  /**
   * Metodo utilizado para obtener tipos de identidicaciones
   */
  private obtenerTiposIdentificaciones(): void {
    const identificacionesSuscripcion = this._parametrizacionModel.obtenerParametrizacionesPorCriterios([{ campo: 'idTipo', valor: ETipo.tiposDeDocumentos }])
      .subscribe(({ data }) => this.tiposIdentificacion = data);
    this._suscripciones.add(identificacionesSuscripcion);
  }

  /**
   * Metodo utilizado para obtener tipos de identidicaciones
   */
  private obtenerPaises(): void {
    const paisesSuscripcion = this._globalModel.obtenerPaises().subscribe(({ data }) => {
      this.paises = GeneralUtils.cloneObject(data);
      this.paises.forEach(empresa => empresa.indicativo = isNaN(empresa.indicativo) ? empresa.indicativo : +empresa.indicativo);
      this.filtrarPaises();
      if (this.formGroupInformacionEmpresa.value.id || this.formGroupInformacionEmpresa.value.id !== 0) {
        const pais = this.paises.find((pais) => pais.id === this.formGroupInformacionEmpresa.value.contactoEmpresa.idPais)
        if (pais) this.obtenerInformacioUbicacionConsultar(pais);
      }
    });
    this._suscripciones.add(paisesSuscripcion);
  }

  /**
   * Metodo para obtener los departamentos por un pais
   * @param idPais como parametro de busqueda para filtrar departamentos
   */
  private obtenerDepartamentoPorPais(idPais: number) {
    const departamentosSuscripcion = this._globalModel.obtenerDepartamentosPorPais(idPais).subscribe(({ data }) => {
      this.departamentos = data;
      this.filtrarDepartamentos();
    });
    this._suscripciones.add(departamentosSuscripcion);
  }

  /**
 * Metodo para obtener los departamentos por un pais
 * @param idDepartamento como parametro de busqueda para filtrar municipio
 */
  private obtenerMunicipiosPorDepartamento(idDepartamento: number) {
    const municipiosSuscripcion = this._globalModel.obtenerMunicipiosPorDepartamento(idDepartamento).subscribe(({ data }) => {
      this.municipios = data;
      this.filtrarCiudades();
    });
    this._suscripciones.add(municipiosSuscripcion);
  }

  /**
   * Metodo usado para validar el codigo sicom
   */
  public validarCodigoSicom(): void {
    if (this.codigoSicom !== this.formGroupInformacionEmpresa.get('codigoSicom').value) {
      const codigoSicom = this.formGroupInformacionEmpresa.get('codigoSicom').value;
      if (!!codigoSicom)
        this._empresaModel.validarCodigoSicom(codigoSicom, this.idEmpresa).subscribe(({ data, status, message }) => {
          if (!status && data != 0) {
            this.errorCodigoSicom(message);
          }
        }, error => this.errorCodigoSicom(error.error));
    }
  }

  /**
   * Metodo para realizar accion en caso de que exista codigo sicom
   * @param message mensaje a mostrar
   */
  private errorCodigoSicom(message: string): void {
    this._utilsService.procesarMessageWebApi(message, ETiposError.error);
    this.formGroupInformacionContacto.get('codigoSicom').setValue(null);
    this.formGroupInformacionContacto.get('codigoSicom').markAllAsTouched();
  }
}
