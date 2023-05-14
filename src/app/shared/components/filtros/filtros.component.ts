import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelectChange } from '@angular/material/select';
import { ObjFiltro } from '@core/interfaces/base/objFiltro.interface';
import { ObjSubItem } from '@core/interfaces/base/objSubItem.interface';


@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent implements OnInit {

  /**
   * Variable bandera para el texto predictivo.
   */
  @Input() banderaTextoPredictivo = true;


  /**
   * Variable bandera para el filtro de paginado
   */
  @Input() banderaCantidadFilas = true;

  /**
     * Variable de entrada para definir los filtros de la busqueda.
     */
  @Input() objFiltros: Array<any> = [];
  /**
   * Variable de entrada para definir si se desea ver el filtro categoria.
   */
  @Input() verFiltroCategoria: boolean = true;
  /**
   * Variable de entrada para definir los caracteres predictivos para la busqueda.
   */
  @Input() caracteresPredictivo: number = 0;
  /**
   * Opciones del limitador de registros de la tabla
   */
  @Input() pageSizeOptions: Array<number> = [5, 7, 10];
  /**
   * variable que define el placeholder del campo de busqueda
   */
  @Input() placeholderPredictivo: string;
  /**
   * Variable que define cuando se requiere un texto predictivo sin interactuar con input
   */
  @Input() textoPredictivoSeleccionado: string;
  /**
   * Variable de salida para enviar los filtros escogidos al componente padre.
   */
  @Output() enviaFiltros = new EventEmitter<any>();
  /**
   * Variable de salida para enviar el tamaño de la pagina elegida.
   */
  @Output() pageSize = new EventEmitter<number>();
  /**
   * variable que define el texto predictivo de la busqueda
   */
  @ViewChild('textoPredictivo') textoPredictivo: ElementRef;
  /**
   * variable que hace referencia al elemento DOM de menu de angular material
   */
  @ViewChild(MatMenuTrigger) matMenu: MatMenuTrigger;
  /**
   * Variable que define el array de filtros a representar
   */
  public arrayChips: Array<any> = [];
  /**
   * variable que define los filtros seleccionados
   */
  public arrayMenu: Array<any> = [];
  /**
   * Variable que define si es predictivo o no
   */
  public noMasPredictivo: boolean = true;
  /**
   *variable que define la visibildad del componente en la vista
   */
  public visible: boolean = true;
  /**
   * variable que define si es seleccionable
   */
  public selectable: boolean = true;
  /**
   * variable que define si se puede remover
   */
  public removable: boolean = true;
  /**
   * variable que define si el elemento tiene blur
   */
  public addOnBlur = true;
  /**
   * varibale que define sio el elemento tiene mas filtros
   */
  public masFiltros: number;
  /**
   * variable que define el numero total de filtros seleccionados
   */
  public totalSeleccionado: number;
  /**
   * variable que define el formulario del filtro
   */
  public formGroupFiltros: FormGroup;
  /**
   * Variable que define el index del texto predictivo
   */
  public indexPredictivo: number;
  /**
   * Variable que define si estan cargados los criterios en el sistema
   */
  public loaded: boolean;

  /**
   * Variable de salida para enviar los filtros de texto
   */
  @Output() filtroTextoPredictivo = new EventEmitter<any>();

  /**
   * Constructor del componente de filtros de tablas
   * @param _formBuilder Define las propiedades y atributos de los formularios reactivos
   */
  constructor(private _formBuilder: FormBuilder) { }

  /**
   * Metodo que inicializa el componente de filtros de tablas
   */
  ngOnInit(): void {
    this.pageSize.emit(5);
    this.masFiltros = 0;
    this.arrayChips = [];
    this.iniciarFormularios();
    if (!!this.objFiltros) this.loaded = true;
  }

  /**
   * Escucha cambios en las variables de entrada
   * @param changes Eventos de cambio
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.objFiltros !== undefined && changes.objFiltros.currentValue !== undefined) {
      if (changes.objFiltros.currentValue !== null && changes.objFiltros.currentValue.length > 0) {
        this.configurarFiltro();
      }
    }

    if (changes.textoPredictivoSeleccionado && changes.textoPredictivoSeleccionado.currentValue) {
      this.iniciarFormularios();
      setTimeout(() => {
        if (this.formGroupFiltros) {
          this.formGroupFiltros.get('textoPredictivo').patchValue(this.textoPredictivoSeleccionado);
          this.updateFilter(1);
        }
      }, 50);
    }
  }

  /**
   * Metodo utilizado para armar el array de los filtros seleccionados
   */
  public configurarFiltro(): void {
    this.objFiltros.forEach((criterio, index) => {
      if (criterio.predictivo === true) {
        if (!this.placeholderPredictivo) this.placeholderPredictivo = criterio.nombre
        this.indexPredictivo = index;
      }
    });
    this.arrayMenu = this.objFiltros.filter(opcion => opcion.visible);
  }

  /**
   * Metodo donde se definen las reglas para los campos de los formularios utilizados.
   */
  private iniciarFormularios(): void {
    this.formGroupFiltros = this._formBuilder.group({
      textoPredictivo: ['', Validators.compose([])],
      pageSize: [5]
    });
    this.formGroupFiltros.get('textoPredictivo').valueChanges.subscribe(valor => {
      if (valor.length === 0) {
        this.updateFilter(0);
        this.filtroTextoPredictivo.emit(null);
      }

    });
  }

  /**
   * Metodo utilizado para actualizar los filtros
   * @param opcion Tipo de opción
   */
  public updateFilter(opcion: number): void {
    const texto = this.formGroupFiltros.get('textoPredictivo').value.trim();
    if (opcion === 1 && texto.length !== 0 || opcion === 0) {
      if (this.objFiltros[this.indexPredictivo]) this.objFiltros[this.indexPredictivo].texto = texto;

      if (texto.length >= this.caracteresPredictivo || texto.length === 0 && !this.noMasPredictivo) {
        this.notificaCambios();

        if (texto.length === 0 && this.textoPredictivo !== undefined) this.textoPredictivo.nativeElement.blur()
      }

      this.noMasPredictivo = texto ? false : true;
    }
  }

  /**
   * Metodo seleccionado para cambiar los filtros de emicion
   * @param item Item de objeto filtro
   * @param subItem SubItem de objeto sub item para filtro
   */
  public cambiaCriterios(item: ObjFiltro, subItem: ObjSubItem): void {
    const indexChip = this.arrayChips.findIndex(i => (i.item === item && i.sub === subItem));
    if (indexChip !== -1) {
      this.arrayChips.splice(indexChip, 1);
    }
    const marca = subItem.seleccionado;
    if (item.unico) {
      item.subItems.forEach(element => { element.seleccionado = false; });
      subItem.seleccionado = marca;
    }
    this.notificaCambios();
  }

  /**
   * Metodo donde se elimina los chips de los elementos seleccionados y se deselecciona del json principal.
   * @param chip chip a eliminar
   */
  public remover(chip): void {
    const indexItem = this.objFiltros.findIndex(item => item.nombreApi === chip.item.nombreApi);
    if (indexItem !== -1) {
      const indexSub = this.objFiltros[indexItem].subItems.findIndex(sub => sub.idSubItem === chip.sub.idSubItem);
      if (indexSub !== -1) {
        this.objFiltros[indexItem].subItems[indexSub].seleccionado = false;
        this.arrayChips.splice(this.arrayChips.findIndex(chipTemp => chipTemp.cadena === chip.cadena), 1);
      }
    }
    this.notificaCambios();
  }

  /**
   * Metodo utilizado para representar los filtros de busquedas seleccionados
   */
  public dibujaChips(): void {
    this.masFiltros = 0;
    this.arrayChips = [];
    this.objFiltros.forEach(item => {
      item.subItems.forEach(sub => {
        if (sub.seleccionado) {
          const cadena = `${item.nombre}: ${sub.nombreSubItem}`;
          if (this.arrayChips.length < 3) {
            this.arrayChips.push({ cadena, item, sub });
          } else {
            this.masFiltros++;
          }
        }
      });
    });
  }

  /**
   * Metodo utilizado para emitir los filtros seleccionados al componente padre
   */
  private notificaCambios(): void {
    this.dibujaChips();
    const filtroEnvio = JSON.parse(JSON.stringify(this.objFiltros));
    filtroEnvio.forEach(element => {
      if (!element.predictivo) {
        element.subItems = element.subItems.filter(el => el.seleccionado);
      }
    });

    this.enviaFiltros.emit({ filtros: filtroEnvio });
  }

  /**
   * metodo para emitir el tamaño de la pagina al componente padre
   */
  public PageSizeSeleccionChange(event:MatSelectChange):void{
    if (!!event.value) this.pageSize.emit(event.value);
  }

  /**
   * Metodo para que retorna el texto escrito
   * @param texto a filtrar
   */
  public filtroBasico(texto: any): void {
    this.filtroTextoPredictivo.emit(texto.target.value);
  }
}
