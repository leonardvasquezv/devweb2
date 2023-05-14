
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemData } from '@core/interfaces/multi-select-item-data';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'multiselect-autocomplete',
  templateUrl: './multiselect-autocomplete.component.html',
  styleUrls: ['./multiselect-autocomplete.component.scss']
})
export class MultiselectAutocompleteComponent implements OnInit, OnChanges {
  /**
    * Input que establece los inputs en modo consulta
    */
  @Input() modoConsulta: boolean;
  /**
   * Output que establece los inputs en modo consulta
   */
  @Output() result = new EventEmitter<{ key: string, data: Array<string>, ids: Array<number> }>();
  /**
    * Input que establece los inputs en modo consulta
    */
  @Input() placeholder: string = 'Select Data';
  /**
    * Input que establece los inputs en modo consulta
    */
  @Input() data: Array<any> = [];

  /**
    * Input que establece los inputs en modo consulta
    */
  @Input() key: string = '';

  /**
   * Variable que maneja el formulario del autocomplete
   */
  public selectControl = new FormControl();


  /**
   * Input que tiene los servicios en la consulta
   */
  @Input() selectData: Array<ItemData> = [];

  /**
   * Observable encargado de detectar los cambios del filtro y filtrar la data
   */
  public filteredData: Observable<Array<ItemData>>;


  /**
   * Variable que contiene el texto por el que se desea filtrar 
   */
  public filterString: string = '';

  /**
   * Método para inyectar dependencias
   */
  constructor() {
  }

  /**
   *  Método de inicialización de componentes
   */
  ngOnInit(): void {
    if (this.modoConsulta) this.selectControl.disable();
  }

  /**
   * Método que se ejecuta al detectar un cambio en la data del componente
   * @param changes Variable que contiene los datos que cambiaron
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue !== changes.data?.previousValue) {
      this._cargarLista();
      this._actualizarSeleccionados();
    }

   
  }

  /**
   * Método encargado de cargar la lista de opciones
   */
  private _cargarLista(): void {
    
    this._marcarValoresCargados();

    this.filteredData = this.selectControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.filterString),
      map(value => this.filter(value || ''))
    );
  }


  /**
   * Metodo encargado de marcar los valores que han sido seleccionados
   */
  private _marcarValoresCargados(): void{
    this.data.forEach(dato => {
      let encontrado = this.selectData.find(sd => sd.idTipoDetalle === dato.idTipoDetalle)
      dato.selected = encontrado ? true : false;
    })
  }

  /**
   *  Método para filtrar data
   */
  filter = (filter: string): Array<ItemData> => {
    this.filterString = filter;
    return this.data.filter(option => option.nombre.toLowerCase().includes(this.filterString.toLowerCase()));
  };

  /**
   * Funcion que retorna lo que se mostrará un principio en el Autocomplete
   */
  displayFn = (): string => '';

  /**
   * Método para marcar la opción clickeada
   * @param event Evento 
   * @param data Item seleccionado
   */
  public optionClicked = (event: Event, data: ItemData): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  /**
   * Método para mostrar etiqueta
   * @param data Elemento que será agregado o eliminado de los datos seleccionados
   */
  public toggleSelection = (data: ItemData): void => {

    data.selected = !data.selected;
    if (data.selected === true) {
      this.selectData.push(data);
    } else {
      const i = this.selectData.findIndex(value => value.nombre === data.nombre);
      this.selectData.splice(i, 1);
    }

    this.selectControl.setValue(this.selectData);
    this.emitAdjustedData();
    this._cargarLista();
  };

  /**
   *  Método para emitir etiquetas
   */
  emitAdjustedData = (): void => {
    const results: Array<string> = [];
    const idsServicios: Array<number> = [];
    this.selectData.forEach((data: ItemData) => {
      results.push(data.nombre);
      idsServicios.push(data.idTipoDetalle);
    });
    this.result.emit({ key: this.key, data: results, ids: idsServicios });
  };

  /**
   * Método para eliminar etiquetas
   * @param data Elemento que será eliminado de los datos seleccionados
   */
  removeChip = (data: ItemData): void => {
    this.toggleSelection(data);
  };


  /**
   * Método encargado de actualizar los servicios seleccionados cuando son editados
   */
  private _actualizarSeleccionados(): void {
    this.selectData.forEach(servicioSeleccionado => {
      const servicioEncontrado = this.data.find(servicio => servicio.idTipoDetalle === servicioSeleccionado.idTipoDetalle);
      servicioSeleccionado.nombre = servicioEncontrado.nombre;
    })
  } 

}
