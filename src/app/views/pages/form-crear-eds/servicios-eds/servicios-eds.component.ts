import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ETipoDetalle } from '@core/enum/tipoDetalle.enum';
import { ResponseWebApi } from '@core/interfaces/base/responseWebApi.interface';
import { ItemData } from '@core/interfaces/multi-select-item-data';
import { TipoParametrizacionModel } from '@core/model/tipo-parametrizacion.model';
import { SortUtils } from '@core/utils/sort-utils';
import { TipoDetalle } from '@shared/models/database/tipoDetalle.model';
import { Subscription } from 'rxjs';
import { ModalCrearServicioComponent } from '../formulario-datos-basicos/components/modal-crear-servicio/modal-crear-servicio.component';




@Component({
  selector: 'app-servicios-eds',
  templateUrl: './servicios-eds.component.html',
  styleUrls: ['./servicios-eds.component.scss'],
})
export class ServiciosEdsComponent implements OnInit, OnDestroy {
  /**
   * Input que establece los inputs en modo consulta
   */
  @Input() modoConsulta: boolean;

  /**
    * Input para recibir el nombre del formulario
    */
  @Input() formGroupName: string;


  /**
   * Formulario  Servicios
   */
  public formConfiguracionEds: FormGroup;

  /**
   * Método utilizado para inicializar las variables
   */
  public servicios: Array<TipoDetalle> = [];

  /**
   * Método utilizado para inicializar las variables
   */
  public serviciosCargados: Array<ItemData> = [];

  /**
   *  Instancia de la clase Subscription para guardar los subscriptions
   */
  private _subscriptions = new Subscription();

  /**
   * Bandera para no repetir cargue de servicios
   */
  private _banderaCargarServicios = false;

  /**
   * Objeto que contiene el array de servicios temporal
   */
  public cardValue: any = {
    servicios: []
  };

  /**
   * Metodo donde se inyectan las dependencias
   * @param _activatedRoute Variable que define las propíedades y metodos del active router
   * @param _matDialog Define los atributos y las propiedades de los modales
   * @param _rootFormGroup formulario raiz
   * @param _tipoParametrizacionModel inyeccion de los servicios de TipoParametrizacionModel
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
    private _rootFormGroup: FormGroupDirective,
    private _tipoParametrizacionModel: TipoParametrizacionModel,

  ) { }

  /**
   * Método que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this.iniciarFormularios();
    this._cambiosCargaInicial();
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
   * Metodo que carga los datos iniciales
   */
  private _cambiosCargaInicial(): void {
    if (this.modoConsulta) this.formConfiguracionEds.disable();
    const criterioServicios = [
      { campo: 'IdTipoDetallePadre', valor: ETipoDetalle.servicios },
      { campo: 'EstadoRegistro', valor: 'A' }
    ];
    this._tipoParametrizacionModel.obtenerTiposParametrizacion(criterioServicios).subscribe(({ data }: ResponseWebApi) => {
      if (!!data) this.servicios = SortUtils.getSortJson(data, 'nombre', 'STRING');
    });

    this.formConfiguracionEds.get('servicios').valueChanges.subscribe(value => {
      if (!!value && !!this.idEds && !this._banderaCargarServicios) {
        value.forEach(servicio => this.serviciosCargados.push({
          nombre: servicio.nombre,
          idTipoDetalle: servicio.idServicio,
          selected: true
        }));
        this._banderaCargarServicios = true;
      }
    });
  }

  /**
   * Metodo que inicializa los formularios
   */
  public iniciarFormularios(): void {
    if (this.formGroupName) {
      this.formConfiguracionEds = this._rootFormGroup.control.get(this.formGroupName) as FormGroup;
    }
  }

  /**
   * Metodo que pasa la seleccion en etiqueta
   */
  selectChange = (event: any) => {
    const key: string = event.key;
    this.cardValue[key] = [...event.data];
    const objetoServicios = [];
    event.ids.forEach((id: number) => { objetoServicios.push({ idServicio: id }) });
    this.formConfiguracionEds.get('servicios').setValue(objetoServicios);
  };



  /**
   * Método encargado de abrir el modal para crear un nuevo servicio
   */
  public abrirModalCrearServicio(): void{
    const modalCrearServicioRef = this._matDialog.open(ModalCrearServicioComponent,
      {
       panelClass: 'modal-crear-servicio'
      }
    )
    this._despuesCerrarModalCrearServicio(modalCrearServicioRef);
  }

  /**
   * Método ejecuta acciones una vez cerrado el modal de crear servicios
   * @param modal Referencia al modal de crear servicios
   */
  private _despuesCerrarModalCrearServicio(modal: MatDialogRef<ModalCrearServicioComponent>): void{
    const dialogRefSubscription: Subscription = modal.afterClosed().subscribe( () => {
      this._cambiosCargaInicial();
    })
    this._subscriptions.add(dialogRefSubscription);
  }

}

