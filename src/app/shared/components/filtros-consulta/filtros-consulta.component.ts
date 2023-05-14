import {
  Component, EventEmitter,
  Input, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ObjParam } from 'src/app/core/interfaces/base/objParam.interface';

@Component({
  selector: 'app-filtros-consulta',
  templateUrl: './filtros-consulta.component.html',
  styleUrls: ['./filtros-consulta.component.scss'],
})
export class FiltrosConsultaComponent implements OnInit {
  /**
   * Metodo que se dispara cuando se modifica una opcion de filtrado
   */
  @Output() arrayFilter = new EventEmitter<Array<ObjParam>>();

  /**
   * Define el placeholder del filtro predictivo
   */
  @Input() placeHolder: string;

  /**
   * Bolean que define si se muestra el filtro por # de registros
   */
  @Input() filtroRegistro: boolean = false;

  /**
   * Boolean que define si se muestra el filtro por categorias
   */
  @Input() filtroCategoria: boolean = false;

  /**
   * Almacena el campo del query para la consulta
   */
  @Input() categoria: Array<ObjParam> = [];

  /**
   * Tamaño de registros por paginas
   */
  @Input() limit: number = 3;

  /**
   * Opciones del limitador de registros de la tabla
   */
  @Input() sizeOptions: Array<number>;

  /**
   * Opciones de categorias de filtrado
   */
  @Input() categoriasOptions: any;

  /**
   * Opciones para enviar valores por cada cambio
   */
  @Input() emitChangeDinamic: boolean = false;

  /**
   * Opciones del limitador de registros de la tabla
   */
  public pageSizeOptions: Array<number> = [3, 6, 9];

  /**
   * Variable que almacena los datos del formulario
   */
  public filtrosForms: FormGroup;

  /**
   * Variable donde se guardan los parametros de filtrado
   */
  public filterParams: Array<ObjParam> = [];

  /**
   * Variable donde se guarda el numero de registros por paginas
   */
  public pageSize: Array<ObjParam> = [];

  /**
   * Variable donde se guarda el valor del filtro predictivo
   */
  public textoPredictivo: Array<ObjParam> = [];

  /**
   * Se guarda el valor del texto predictivo anterior
   */
  public lastTextoPredictivo: string = '';

  /**
   * Se guarda el valor de la categoria anterior
   */
  public lastCategoria: number = 0;

  /**
   * Metodo donde se inyectan las dependencias
   * @param formBuilder Objeto que contiene los datos del formulario
   * @param _translateService Servicio de traducciones
   */
  constructor(
    private formBuilder: FormBuilder,
    private _translateService: TranslateService
  ) { }

  /**
    * Método de inicialización de componentes
    */
  ngOnInit(): void {
    this.establecerTraducciones();

    if (this.categoriasOptions) {
      this.categoriasOptions = Object.values(this.categoriasOptions);
    }

    this.pageSizeOptions = this.sizeOptions;

    this.filtrosForms = this.formBuilder.group({
      pageSize: [this.limit],
      textoPredictivo: [''],
      categoria: true,
    });

    this.pageSize = [{ campo: 'size', valor: this.limit }];

    this.textoPredictivo = [{ campo: 'textoPredictivo', valor: '' }];

    if (this.emitChangeDinamic) this.enviarCambios();
  }

  /**
   * Funcion que emite el numero de registros cuando se actualiza su valor
   */
  public updateFilterPageSize(): void {
    this.pageSize = [
      { campo: 'size', valor: this.filtrosForms.get('pageSize').value },
    ];

    this.buildFilterParams();
  }

  /**
   * Este metodo se dispara cuando se borra el parametro de busqueda en el filtro predictivo
   * @param event Evento que se dispara al borrar el parametro
   * */
  public resetData(event): void {
    if (!event.target.value) {
      this.filtrosForms.get('textoPredictivo').setValue('');
      this.updateSearch();
    }
  }

  /**
   * Metodo que determina la logica del filtrado
   */
  public updateSearch(): void {
    const textoPredictivo = this.filtrosForms.get('textoPredictivo').value;

    if (textoPredictivo != this.lastTextoPredictivo) {
      this.textoPredictivo = [
        {
          campo: 'textoPredictivo',
          valor: textoPredictivo,
        },
      ];

      this.buildFilterParams();

      this.lastTextoPredictivo = textoPredictivo;
    }
  }

  /**
   * Metodo donde se filtra dependiendo de la categoria seleccionada
   * @param idSeleccionado ID seleccionado
   */
  public categoryFilter(idSeleccionado: number): void {
    if (idSeleccionado != this.lastCategoria) {
      const cloneFilter = { ... this.categoria[0] }
      cloneFilter.valor = idSeleccionado;
      this.categoria[0] = cloneFilter;

      this.buildFilterParams();

      this.lastCategoria = idSeleccionado;
    }
  }

  /**
   * Metodo donde se construye el array de parametros de filtrado
   */
  public buildFilterParams(): void {
    if (this.categoria[0]?.valor === 0) {
      this.filterParams = [...this.pageSize, ...this.textoPredictivo];
    } else {
      this.filterParams = [
        ...this.pageSize,
        ...this.textoPredictivo,
        ...this.categoria,
      ];
    }

    this.arrayFilter.emit(this.filterParams);
  }


  /**
   * Metodo encargado de cargar las traducciones
   */
  public establecerTraducciones(): void {
    this._translateService.get(this.placeHolder || 'TITULOS.BUSCAR').subscribe((text: string) => this.placeHolder = text)
  }

  /**
   * metodo encargado de enviar cambios dependiendo de bandera
   */
  public enviarCambios(): void {
    this.filtrosForms.get('textoPredictivo').valueChanges.subscribe(() => this.updateSearch());
  };

}
