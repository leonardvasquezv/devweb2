import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Alerta } from '@core/interfaces/Alerta.interface';
import { ObjPage, pageDefault, pageDefualtAlertas } from '@core/interfaces/base/objPage.interface';
import { ajustesTablas, ObjTabla } from '@core/interfaces/base/objTabla.interface';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-listar-alertas',
  templateUrl: './listar-alertas.component.html',
  styleUrls: ['./listar-alertas.component.scss']
})
export class ListarAlertasComponent implements OnInit, AfterViewChecked {

  /**
   * Define el modo de visualizacion para las columnas de la tabla
   */
  public ColumnMode = ColumnMode;

  /**
   * Define las propiedades para la paginacion de la tabla
   */
  public pageTable: ObjPage = pageDefault;

  /**
   * Variable de entrada con array de alertas
   */
  @Input() arrayAlertas: Array<Alerta> = [];

  /**
   * Variable de entrada bandera consulta
   */
  @Input() esConsulta = false;

  /**
   * Metodo que se emite cuando se edita una alerta
   */
  @Output() eventEditar: EventEmitter<any> = new EventEmitter();

  /**
   * Metodo que se emite cuando se elimina una alerta
   */
  @Output() eventEliminar: EventEmitter<any> = new EventEmitter();

  /**
   * Referencia del elemento contenedor de la tabla
   */
  @ViewChild('tableWrapper') tableWrapper;

  /**
   * Referencia del elemento de la tabla
   */
  @ViewChild(DatatableComponent) table: DatatableComponent;

  /**
   * propiedad que hace regerencia a el tamaño de la tabla
   */
  private _currentComponentWidth;

  /*
   * Variable que contiene medidas y tamaño de las tablas
   */
    public medidasTabla: ObjTabla;

  /**
   * Metodo constructor del componente
   * @param _ref inyeccion de dependencia para la funcionalidad de detectar cambios
   */
  constructor(private _ref: ChangeDetectorRef) { }

  /**
   * Metodo que inicializa el componente
   */
  ngOnInit(): void {
    this.pageTable = pageDefualtAlertas;
    this.medidasTabla = ajustesTablas;
  }

  /**
   * Metodo para detectar cambios despues de inicializar el componente
   */
  ngAfterViewChecked() {
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this._currentComponentWidth)) {
      this._currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this._ref.detectChanges();
    }
  }

  /**
   * Metodo que emite evento para editar
   * @param alerta objeto a editar
   */
  public esEditar(alerta: Alerta, index: number): void {
    const objetoAlerta: Alerta = { ...alerta, index }
    this.eventEditar.emit(objetoAlerta);
  }

  /**
   * Metodo que emite evento para eliminar
   * @param alerta objeto a eliminar
   */
  public esEliminar(alerta: Alerta): void {
    this.eventEliminar.emit(alerta);
  }

}
