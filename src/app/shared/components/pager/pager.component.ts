import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResponsiveSize } from '@core/enum/ResponsiveSize.enum';

@Component({
  selector: 'app-datatable-pager',
  templateUrl: './pager.component.html',
  host: {
    class: 'datatable-pager'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class PagerComponent implements OnInit {
  /**
   * Set del total de paginas de la tabla
   */
  @Input()
  set size(val: number) {
    this._size = val;
    this.pages = this.calcPages();
  }

  /**
   * Get del total de paginas de la tabla
   */
  get size(): number {
    return this._size;
  }

  /**
   * Set del total de elementos de la tabla
   */
  @Input()
  set count(val: number) {
    this._count = val;
    this.pages = this.calcPages();
  }

  /**
   * Get del total de elementos de la tabla
   */
  get count(): number {
    return this._count;
  }

  /**
   * Set de la pagina actual
   */
  @Input()
  set page(val: number) {
    this._page = val;
    this.pages = this.calcPages();
  }

  /**
   * Get de la pagina actual
   */
  get page(): number {
    return this._page;
  }

  /**
   * Get del total de paginas de la tabla
   */
  get totalPages(): number {
    const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }

  /**
   * Evento que se lanza cuando se cambia de pagina
   */
  @Output() change: EventEmitter<any> = new EventEmitter();

  /**
   * Variable que contiene el numero de paginas visibles en el footer
   */
  public _visiblePagesCount: number = 3;

  /**
   * Set del total de paginas de la tabla que seran visibles en el footer
   */
  @Input()
  set visiblePagesCount(val: number) {
    this._visiblePagesCount = val;
    this.pages = this.calcPages();
  }

  /**
   * Get del total de paginas de la tabla que seran visibles en el footer
   */
  get visiblePagesCount(): number {
    return this._visiblePagesCount;
  }

  /**
   * Variable que guarda el total de elementos de la tabla
   */
  _count: number = 0;

  /**
   * Variable que guarda la pagina actual
   */
  _page: number = 1;

  /**
   * Variable que guarda el numero de paginas de la tabla
   */
  _size: number = 0;

  /**
   * Variable que guarda el total de paginas de la tabla
   */
  pages: any;
 
  /**
   *  Tamaño de pantalla actual
   */
  private screenWidth:number

  /**
    * Constructor de la clase inicial
    * @param _changeDetectorRef detector de cambios de pantalla
    */
  constructor(private _changeDetectorRef: ChangeDetectorRef){
  }

  /**
   * Método llamado al iniciar el componente, se incializa el listener para el evento de tamaño pantalla
   */
  ngOnInit(): void {
    this.getScreenSize();
  }

  /**
   * Métodos listener que escucha los cambios al tamaño de pantalla
   * @param event Evento del cambio de tamaño de pantalla
   */
  @HostListener('window:resize', ['$event'])
  public getScreenSize(event?):void {
    this.screenWidth = window.innerWidth;
    switch (true) {
      case this.screenWidth > ResponsiveSize.pager.lg:
        this._visiblePagesCount = 3
        break;
      case this.screenWidth < ResponsiveSize.pager.lg && this.screenWidth >= ResponsiveSize.pager.md:
        this._visiblePagesCount = 2
        break;
      case this.screenWidth < ResponsiveSize.pager.md && this.screenWidth >= ResponsiveSize.pager.sm:
        this._visiblePagesCount = 1
        break;
      case this.screenWidth < ResponsiveSize.pager.sm && this.screenWidth >= ResponsiveSize.pager.xsm:
        this._visiblePagesCount = 1
        break;
      case this.screenWidth < ResponsiveSize.pager.xsm:
        this._visiblePagesCount = 1
        break;
      default:
        break;
    }
    this.pages = this.calcPages();
    this._changeDetectorRef.detectChanges();
  }
  /**
   * Metodo que se lanza cuando se cambia de pagina previa
   * @returns boolean que indica si la pagina actual es la primera
   */
  canPrevious(): boolean {
    return this.page > 1;
  }

  /**
   * Metodo que se lanza cuando se cambia de pagina posterior
   * @returns boolean que indica si la pagina actual es la ultima
   */
  canNext(): boolean {
    return this.page < this.totalPages;
  }

  /**
   * Metodo que se lanza cuando se cambia de pagina anterior
   */
  prevPage(): void {
    this.selectPage(this.page - 1);
  }

  /**
   * Metodo que se lanza cuando se cambia de pagina posterior
   */
  nextPage(): void {
    this.selectPage(this.page + 1);
  }

  /**
   * Metodo que se lanza cuando se cambia de pagina
   * @param page  numero de la pagina a cambiar
   */
  selectPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.page) {
      this.page = page;

      this.change.emit({
        page
      });
    }
  }

  /**
   * Metodo que calcula las paginas que seran visibles en el footer
   * @param page numero de la pagina a cambiar
   * @returns Pages
   */
  calcPages(page?: number): any[] {
    const pages = [];
    let startPage = 1;
    let endPage = this.totalPages;
    const maxSize = this.visiblePagesCount;
    const isMaxSized = maxSize < this.totalPages;

    page = page || this.page;

    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, this.totalPages);
      } else if (endPage > this.totalPages) {
        startPage = Math.max(this.totalPages - maxSize + 1, 1);
        endPage = this.totalPages;
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      pages.push({
        number: num,
        text: <string><any>num
      });
    }

    return pages;
  }

}


