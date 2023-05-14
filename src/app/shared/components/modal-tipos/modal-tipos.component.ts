import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalTipo } from 'src/app/core/interfaces/modalTipo.interface';
@Component({
  selector: 'app-modal-tipos',
  templateUrl: './modal-tipos.component.html',
  styleUrls: ['./modal-tipos.component.scss']
})
export class ModalTiposComponent implements OnInit {

  /**
   * Variable titulo del modal
   */
  public titulo: string = '';

  /**
   * Variable Icono del Modal
   */
  public icono: string = '';

  /**
   * Variable descripcion del Modal
   */
  public descripcion: string = '';

  /**
   * Variable descripcion del Modal
   */
  public descripcion2: string = '';

  /**
   * Variable para mostrar el Boton Confirmar
   */
  public activarBtn1: boolean = true;

  /**
   * Variable para mostrar el Boton Cancelar
   */
  public activarBtn2: boolean = true;

  /**
   * Variable texto para el boton Confirmar
   */
  public txtBoton1: string = '';

  /**
   * Variable texto para el boton Cancelar
   */
  public txtBoton2: string = '';

  /**
   * Varaible para activar el formulario
   */
  public activarFormulario: boolean = false;

  /**
   * Formulario del modal editar consignaciones
   */
  public modalForm: FormGroup;

  /**
  * Metodo para inicializar servicios
  * @param data variable para acceder a la informacion pasada al modal, por medio de la inyeccion MAT_DIALOG_DATA
  * @param _formBuilder servicio para crear y controlar formularios reactivos
  */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalTipo,
    private _formBuilder: FormBuilder
  ) {
  }

  /**
   * Metodo para inicializar componente
   * Inicializa las variables con los establecidos anteriormente
   */
  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.icono = this.data.icon;
    this.descripcion = this.data.descripcion;
    this.descripcion2 = this.data.descripcion2;
    this.activarBtn1 = this.data.button1 ?? this.activarBtn1;
    this.activarBtn2 = this.data.button2 ?? this.activarBtn2;
    this.txtBoton1 = this.data.txtButton1;
    this.txtBoton2 = this.data.txtButton2;
    this.activarFormulario = this.data.activarFormulario;
    this.modalForm = this._formBuilder.group({
      valorInput: new FormControl(this.data.valorInput, [Validators.required, Validators.min(1)])
    })

  }
}
